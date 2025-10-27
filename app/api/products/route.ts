import { NextRequest, NextResponse } from "next/server";
import { getRepositoryFactory } from "@/lib/repositories";
import { createClient } from '@supabase/supabase-js';

// Enable caching for better performance
export const revalidate = 60; // Revalidate every 60 seconds

// Public endpoint - no authentication required
export async function GET(request: NextRequest) {
  try {
    // Use service role client for read-only public access
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const gemRepository = getRepositoryFactory(supabase).getGemRepository();

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
    const limit = parseInt(searchParams.get("limit") || "100");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Only show active products to public
    let gems;
    if (search) {
      const allGems = await gemRepository.searchGems(search, limit);
      gems = allGems.filter(gem => gem.is_active);
    } else if (category || minPrice || maxPrice) {
      gems = await gemRepository.findGemsWithFilters({
        category,
        minPrice,
        maxPrice,
        isActive: true // Always filter for active only
      }, limit, offset);
    } else {
      const allGems = await gemRepository.findAll(limit, offset);
      gems = allGems.filter(gem => gem.is_active);
    }

    // Map to Product interface format for frontend
    const products = gems.map(gem => ({
      id: gem.id!,
      name: gem.name,
      description: gem.description || '',
      price: gem.price,
      image_url: gem.images?.[0] || '',
      images: gem.images || [],
      category: gem.category || 'Gemstone',
      stock_quantity: gem.stock_quantity || 0,
      stock: gem.stock_quantity || 0,
      active: gem.is_active ?? true,
      is_active: gem.is_active ?? true,
      specifications: {
        carat_weight: gem.carat_weight || 0,
        color: gem.color || '',
        clarity: gem.clarity || '',
        cut: gem.cut || '',
        origin: gem.origin || '',
        certification: gem.certification || ''
      },
      created_at: gem.created_at || new Date().toISOString(),
      updated_at: gem.updated_at || new Date().toISOString()
    }));

    return NextResponse.json({ products }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// GET single product by ID
export async function GET_BY_ID(id: string) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const gemRepository = getRepositoryFactory(supabase).getGemRepository();
    const gem = await gemRepository.findById(id);

    if (!gem || !gem.is_active) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const product = {
      id: gem.id!,
      name: gem.name,
      description: gem.description || '',
      price: gem.price,
      image_url: gem.images?.[0] || '',
      images: gem.images || [],
      category: gem.category || 'Gemstone',
      stock_quantity: gem.stock_quantity || 0,
      stock: gem.stock_quantity || 0,
      active: gem.is_active ?? true,
      is_active: gem.is_active ?? true,
      specifications: {
        carat_weight: gem.carat_weight || 0,
        color: gem.color || '',
        clarity: gem.clarity || '',
        cut: gem.cut || '',
        origin: gem.origin || '',
        certification: gem.certification || ''
      },
      created_at: gem.created_at || new Date().toISOString(),
      updated_at: gem.updated_at || new Date().toISOString()
    };

    return NextResponse.json({ product }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch product" },
      { status: 500 }
    );
  }
}
