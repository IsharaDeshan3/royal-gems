import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/lib/auth/service";
import { getRepositoryFactory } from "@/lib/repositories";
import { supabase } from "@/lib/supabase";
import { rateLimiters, getRateLimitIdentifier } from "@/lib/rate-limit";
import { validateInput, ValidationRule } from "@/lib/validation";

const gemRepository = getRepositoryFactory(supabase).getGemRepository();
const auditLogRepository = getRepositoryFactory(supabase).getAuditLogRepository();
const userRepository = getRepositoryFactory(supabase).getUserRepository();

// GET /api/admin/gems - Get all gems
export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const authUser = await authService.getCurrentUser();
    if (!authUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user profile to check role
    const userProfile = await userRepository.findById(authUser.id);
    if (!userProfile || !['superadmin', 'admin', 'moderator'].includes(userProfile.role)) {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || undefined;
    const category = searchParams.get("category") || undefined;
    const minPrice = searchParams.get("minPrice")
      ? parseFloat(searchParams.get("minPrice")!)
      : undefined;
    const maxPrice = searchParams.get("maxPrice")
      ? parseFloat(searchParams.get("maxPrice")!)
      : undefined;
    const isActive = searchParams.get("isActive")
      ? searchParams.get("isActive") === "true"
      : undefined;
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Fetch gems with filters
    let gems;
    if (search) {
      gems = await gemRepository.searchGems(search, limit);
    } else if (category || minPrice || maxPrice || isActive !== undefined) {
      gems = await gemRepository.findGemsWithFilters({
        category,
        minPrice,
        maxPrice,
        isActive
      }, limit, offset);
    } else {
      gems = await gemRepository.findAll(limit, offset);
    }

    return NextResponse.json({ gems }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching gems:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch gems" },
      { status: 500 }
    );
  }
}

// POST /api/admin/gems - Create new gem
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = getRateLimitIdentifier(request);
    const rateLimit = await rateLimiters.api(clientId);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // Check admin authentication
    const authUser = await authService.getCurrentUser();
    if (!authUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user profile to check role
    const userProfile = await userRepository.findById(authUser.id);
    if (!userProfile || !['superadmin', 'admin'].includes(userProfile.role)) {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate input using validation utility
    const validationRules: ValidationRule[] = [
      { field: 'name', type: 'string', required: true },
      { field: 'price', type: 'number', required: true, min: 0, max: 10000000 },
      { field: 'category', type: 'string', required: true },
      { field: 'description', type: 'string', required: false },
      { field: 'carat_weight', type: 'number', required: false, min: 0, max: 1000 },
      { field: 'stock_quantity', type: 'number', required: false, min: 0, max: 100000 },
    ];

    const validationResult = validateInput(body, validationRules);
    if (!validationResult.valid) {
      return NextResponse.json(
        { error: `Validation failed: ${validationResult.errors.map(e => e.message).join(', ')}` },
        { status: 400 }
      );
    }

    // Create gem data
    const gemData = {
      name: body.name,
      description: body.description,
      price: body.price,
      category: body.category,
      carat_weight: body.carat_weight,
      color: body.color,
      clarity: body.clarity,
      cut: body.cut,
      origin: body.origin,
      certification: body.certification,
      images: body.images || [],
      stock_quantity: body.stock_quantity || 0,
      is_active: body.is_active !== undefined ? body.is_active : true,
    };

    // Create gem
    const newGem = await gemRepository.create(gemData);

    // Log the action
    await auditLogRepository.create({
      user_id: authUser.id,
      action: "CREATE_GEM",
      resource_type: "gem",
      resource_id: newGem.id,
      details: {
        gemName: newGem.name,
        category: newGem.category,
        price: newGem.price,
      },
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      user_agent: request.headers.get('user-agent') || 'unknown',
    });

    return NextResponse.json(newGem, { status: 201 });
  } catch (error: any) {
    console.error("Error creating gem:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create gem" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/gems - Update gem
export async function PUT(request: NextRequest) {
  try {
    // Check admin authentication
    const authUser = await authService.getCurrentUser();
    if (!authUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user profile to check role
    const userProfile = await userRepository.findById(authUser.id);
    if (!userProfile || !['superadmin', 'admin'].includes(userProfile.role)) {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate gem ID
    if (!body.id) {
      return NextResponse.json(
        { error: "Gem ID is required" },
        { status: 400 }
      );
    }

    // Check if gem exists
    const existingGem = await gemRepository.findById(body.id);
    if (!existingGem) {
      return NextResponse.json({ error: "Gem not found" }, { status: 404 });
    }

    // Validate price if provided
    if (body.price !== undefined) {
      if (typeof body.price !== "number" || body.price < 0) {
        return NextResponse.json(
          { error: "Price must be a non-negative number" },
          { status: 400 }
        );
      }
    }

    // Validate stock if provided
    if (body.stock_quantity !== undefined) {
      if (typeof body.stock_quantity !== "number" || body.stock_quantity < 0) {
        return NextResponse.json(
          { error: "Stock quantity must be a non-negative number" },
          { status: 400 }
        );
      }
    }

    // Prepare update data (only include provided fields)
    const updateData: any = {};
    const allowedFields = [
      "name",
      "description",
      "price",
      "category",
      "carat_weight",
      "color",
      "clarity",
      "cut",
      "origin",
      "certification",
      "images",
      "stock_quantity",
      "is_active",
    ];

    allowedFields.forEach((field) => {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    });

    // Update gem
    const updatedGem = await gemRepository.update(body.id, updateData);

    if (!updatedGem) {
      return NextResponse.json(
        { error: "Failed to update gem" },
        { status: 500 }
      );
    }

    // Log the action
    await auditLogRepository.create({
      user_id: authUser.id,
      action: "UPDATE_GEM",
      resource_type: "gem",
      resource_id: updatedGem.id,
      details: {
        gemName: updatedGem.name,
        updatedFields: Object.keys(updateData),
      },
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      user_agent: request.headers.get('user-agent') || 'unknown',
    });

    return NextResponse.json(updatedGem, { status: 200 });
  } catch (error: any) {
    console.error("Error updating gem:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update gem" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/gems - Delete gem
export async function DELETE(request: NextRequest) {
  try {
    // Check admin authentication
    const authUser = await authService.getCurrentUser();
    if (!authUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user profile to check role
    const userProfile = await userRepository.findById(authUser.id);
    if (!userProfile || !['superadmin', 'admin'].includes(userProfile.role)) {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const gemId = searchParams.get("id");

    if (!gemId) {
      return NextResponse.json(
        { error: "Gem ID is required" },
        { status: 400 }
      );
    }

    // Check if gem exists
    const existingGem = await gemRepository.findById(gemId);
    if (!existingGem) {
      return NextResponse.json({ error: "Gem not found" }, { status: 404 });
    }

    // Delete gem
    const deleted = await gemRepository.delete(gemId);

    if (!deleted) {
      return NextResponse.json(
        { error: "Failed to delete gem" },
        { status: 500 }
      );
    }

    // Log the action
    await auditLogRepository.create({
      user_id: authUser.id,
      action: "DELETE_GEM",
      resource_type: "gem",
      resource_id: gemId,
      details: {
        gemName: existingGem.name,
        category: existingGem.category,
      },
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      user_agent: request.headers.get('user-agent') || 'unknown',
    });

    return NextResponse.json(
      { message: "Gem deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting gem:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete gem" },
      { status: 500 }
    );
  }
}