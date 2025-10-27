"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Gem,
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  Image as ImageIcon,
  DollarSign,
  Package,
  Tag,
  Calendar,
  ShoppingCart,
} from "lucide-react";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock_quantity: number;
  active: boolean;
  created_at: string;
}

const CATEGORIES = [
  "Ruby",
  "Sapphire",
  "Emerald",
  "Diamond",
  "Topaz",
  "Amethyst",
  "Garnet",
  "Opal",
  "Peridot",
  "Aquamarine",
  "Tanzanite",
  "Tourmaline",
];

//api calls
import { createProduct, getProducts } from "@/utils/api";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Ceylon Blue Sapphire",
      description:
        "A stunning Ceylon blue sapphire with exceptional clarity and brilliant cut. Perfect for engagement rings.",
      price: 2500.0,
      image_url:
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop",
      category: "Sapphire",
      stock_quantity: 5,
      active: true,
      created_at: "2024-01-15T10:30:00Z",
    },
    {
      id: "2",
      name: "Burmese Ruby Premium",
      description:
        "Rare Burmese ruby with deep red color and excellent transparency. Certified natural stone.",
      price: 4200.0,
      image_url:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop",
      category: "Ruby",
      stock_quantity: 2,
      active: true,
      created_at: "2024-02-20T14:22:00Z",
    },
    {
      id: "3",
      name: "Colombian Emerald",
      description:
        "Premium Colombian emerald with vivid green color and minimal inclusions. Investment grade quality.",
      price: 3800.0,
      image_url:
        "https://images.unsplash.com/photo-1544980919-e17526d4ed0a?w=300&h=300&fit=crop",
      category: "Emerald",
      stock_quantity: 0,
      active: false,
      created_at: "2024-01-05T09:15:00Z",
    },
    {
      id: "4",
      name: "Pink Diamond Rare",
      description:
        "Extremely rare pink diamond with exceptional brilliance. Perfect for luxury jewelry.",
      price: 15000.0,
      image_url:
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&h=300&fit=crop",
      category: "Diamond",
      stock_quantity: 1,
      active: true,
      created_at: "2024-03-10T16:45:00Z",
    },
  ]);

  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priceRange, setPriceRange] = useState("All");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    image_url: "",
    category: "Ruby",
    stock_quantity: 0,
    active: true,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    async function fetchProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error from fetch products - ", error);
      }
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, searchQuery, categoryFilter, statusFilter, priceRange]);

  function applyFilters() {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== "All") {
      filtered = filtered.filter(
        (product) => product.category === categoryFilter
      );
    }

    // Status filter
    if (statusFilter !== "All") {
      if (statusFilter === "Active") {
        filtered = filtered.filter((product) => product.active);
      } else if (statusFilter === "Inactive") {
        filtered = filtered.filter((product) => !product.active);
      } else if (statusFilter === "Out of Stock") {
        filtered = filtered.filter((product) => product.stock_quantity === 0);
      } else if (statusFilter === "Low Stock") {
        filtered = filtered.filter(
          (product) => product.stock_quantity > 0 && product.stock_quantity <= 5
        );
      }
    }

    // Price range filter
    if (priceRange !== "All") {
      if (priceRange === "Under $1000") {
        filtered = filtered.filter((product) => product.price < 1000);
      } else if (priceRange === "$1000-$5000") {
        filtered = filtered.filter(
          (product) => product.price >= 1000 && product.price <= 5000
        );
      } else if (priceRange === "$5000-$10000") {
        filtered = filtered.filter(
          (product) => product.price > 5000 && product.price <= 10000
        );
      } else if (priceRange === "Over $10000") {
        filtered = filtered.filter((product) => product.price > 10000);
      }
    }

    setFilteredProducts(filtered);
  }

  function resetForm() {
    setForm({
      name: "",
      description: "",
      price: 0,
      image_url: "",
      category: "Ruby",
      stock_quantity: 0,
      active: true,
    });
    setSelectedFile(null);
    setError(null);
  }

  function startEdit(product: Product) {
    setEditing(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      image_url: product.image_url,
      category: product.category,
      stock_quantity: product.stock_quantity,
      active: product.active,
    });
    setSelectedFile(null);
    setCreating(false);
  }

  async function uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/admin/upload', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload image');
    }

    const data = await response.json();
    return data.url;
  }

  async function saveProduct() {
    setError(null);
    setLoading(true);

    try {
      let imageUrl = form.image_url;

      // If a file is selected, upload it first
      if (selectedFile) {
        setUploading(true);
        try {
          imageUrl = await uploadImage(selectedFile);
        } catch (uploadError: any) {
          setError(`Image upload failed: ${uploadError.message}`);
          setUploading(false);
          setLoading(false);
          return;
        }
        setUploading(false);
      }

      // Use either uploaded image URL or provided URL
      const finalImageUrl = imageUrl || form.image_url;

      if (editing) {
        // Update existing product via API
        try {
          const csrf =
            document.cookie
              .split("; ")
              .find((r) => r.startsWith("csrfToken="))
              ?.split("=")[1] || "";
          
          const response = await fetch("/api/admin/gems", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "x-csrf-token": csrf,
            },
            credentials: "include",
            body: JSON.stringify({
              id: editing.id,
              name: form.name,
              description: form.description,
              price: form.price,
              category: form.category,
              stock_quantity: form.stock_quantity,
              is_active: form.active,
              images: finalImageUrl ? [finalImageUrl] : [],
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to update product");
          }

          const updatedProduct = await response.json();
          console.log("Product updated:", updatedProduct);

          // Update local state with API response
          setProducts((prev) =>
            prev.map((p) => 
              p.id === editing.id 
                ? { 
                    ...p, 
                    ...form, 
                    image_url: finalImageUrl,
                    // Ensure we update the actual ID from API if it changed
                    id: updatedProduct.id || p.id
                  } 
                : p
            )
          );
        } catch (error) {
          console.error("Error updating product:", error);
          setError("Failed to update product");
          return; // Don't reset form on error
        }
        
        setEditing(null);
      } else {
        // Create new product
        const newProduct: Product = {
          id: "RGP-" + Date.now().toString(),
          ...form,
          image_url: finalImageUrl,
          created_at: new Date().toISOString(),
        };

        const { id, created_at, ...rest } = newProduct;
        try {
          // Call API to create product
          const csrf =
            document.cookie
              .split("; ")
              .find((r) => r.startsWith("csrfToken="))
              ?.split("=")[1] || "";
          
          const response = await fetch("/api/admin/gems", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-csrf-token": csrf,
            },
            credentials: "include",
            body: JSON.stringify({
              name: rest.name,
              description: rest.description,
              price: rest.price,
              category: rest.category,
              stock_quantity: rest.stock_quantity,
              is_active: rest.active,
              images: finalImageUrl ? [finalImageUrl] : [],
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to create product");
          }

          const createdProduct = await response.json();
          console.log("Product created:", createdProduct);

          // Update local state with the created product from API
          setProducts((prev) => [
            {
              ...newProduct,
              id: createdProduct.id,
            },
            ...prev,
          ]);
        } catch (error) {
          console.error("Error creating product:", error);
          setError("Failed to create product");
          return; // Don't reset form on error
        }

        setCreating(false);
      }

      resetForm();
    } catch (err) {
      setError("Failed to save product");
    } finally {
      setLoading(false);
    }
  }

  async function deleteProduct(product: Product) {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) return;

    setLoading(true);
    try {
      // Call API to delete product
      const csrf =
        document.cookie
          .split("; ")
          .find((r) => r.startsWith("csrfToken="))
          ?.split("=")[1] || "";
      
      const response = await fetch(`/api/admin/gems?id=${product.id}`, {
        method: "DELETE",
        headers: { 
          "x-csrf-token": csrf,
          "Content-Type": "application/json"
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      // Update local state
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      console.log("Product deleted successfully");
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Failed to delete product");
    } finally {
      setLoading(false);
    }
  }

  async function toggleActive(product: Product) {
    setLoading(true);
    try {
      // Call API to update product
      const csrf =
        document.cookie
          .split("; ")
          .find((r) => r.startsWith("csrfToken="))
          ?.split("=")[1] || "";
      
      const response = await fetch("/api/admin/gems", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrf,
        },
        credentials: "include",
        body: JSON.stringify({
          id: product.id,
          is_active: !product.active,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      // Update local state
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, active: !p.active } : p))
      );
      console.log("Product updated successfully");
    } catch (err) {
      console.error("Error updating product:", err);
      setError("Failed to update product");
    } finally {
      setLoading(false);
    }
  }

  function formatPrice(price: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(price);
  }

  function getStockBadgeColor(quantity: number) {
    if (quantity === 0) return "from-red-500 to-pink-500";
    if (quantity <= 5) return "from-orange-500 to-amber-500";
    return "from-emerald-500 to-teal-500";
  }

  function getStockStatus(quantity: number) {
    if (quantity === 0) return "Out of Stock";
    if (quantity <= 5) return "Low Stock";
    return "In Stock";
  }

  if (!mounted) {
    return null;
  }

  const stats = {
    total: products.length,
    active: products.filter((p) => p.active).length,
    outOfStock: products.filter((p) => p.stock_quantity === 0).length,
    lowStock: products.filter(
      (p) => p.stock_quantity > 0 && p.stock_quantity <= 5
    ).length,
    totalValue: products.reduce(
      (sum, p) => sum + p.price * p.stock_quantity,
      0
    ),
  };

  return (
    <div className="admin-products-page space-y-8">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full animate-pulse"></div>
        <div
          className="absolute bottom-20 left-10 w-24 h-24 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full animate-bounce"
          style={{ animationDuration: "3s" }}
        ></div>
      </div>

      {/* Header Section with Stats */}
      <div className="relative z-10 backdrop-blur-md bg-white/80 dark:bg-slate-800/80 rounded-2xl p-6 shadow-2xl border border-white/20">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
              <Gem className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Gems & Products
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Manage your precious gems inventory
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => {
                setCreating(!creating);
                setEditing(null);
                resetForm();
              }}
              className={`${
                creating
                  ? "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                  : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              } text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
            >
              {creating ? (
                <XCircle className="h-5 w-5 mr-2" />
              ) : (
                <Plus className="h-5 w-5 mr-2" />
              )}
              {creating ? "Cancel" : "Add Product"}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
          <div className="bg-white/60 dark:bg-slate-700/60 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-slate-800 dark:text-white">
              {stats.total}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Total Products
            </div>
          </div>
          <div className="bg-white/60 dark:bg-slate-700/60 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-emerald-600">
              {stats.active}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Active
            </div>
          </div>
          <div className="bg-white/60 dark:bg-slate-700/60 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {stats.outOfStock}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Out of Stock
            </div>
          </div>
          <div className="bg-white/60 dark:bg-slate-700/60 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {stats.lowStock}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Low Stock
            </div>
          </div>
          <div className="bg-white/60 dark:bg-slate-700/60 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {formatPrice(stats.totalValue)}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Total Value
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <div className="flex items-center text-red-600 dark:text-red-400">
            <AlertCircle className="h-4 w-4 mr-2" />
            {error}
          </div>
        </div>
      )}

      {/* Create/Edit Product Form */}
      {(creating || editing) && (
        <Card
          className="backdrop-blur-md bg-white/80 dark:bg-slate-800/80 border-0 shadow-2xl rounded-2xl overflow-hidden"
          style={{ animation: "slideDown 0.5s ease-out" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-purple-500/5"></div>
          <CardHeader className="relative z-10 bg-gradient-to-r from-slate-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 border-b border-slate-200/50 dark:border-slate-600/50">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg">
                <Gem className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-800 dark:text-white">
                {editing ? "Edit Product" : "Add New Product"}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="relative z-10 p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <Label className="flex items-center text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <Tag className="h-4 w-4 mr-2" />
                  Product Name
                </Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="h-12 bg-white/60 dark:bg-slate-700/60 border-slate-200 dark:border-slate-600 rounded-xl"
                  placeholder="Ceylon Blue Sapphire"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label className="flex items-center text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <Package className="h-4 w-4 mr-2" />
                  Category
                </Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm({ ...form, category: v })}
                >
                  <SelectTrigger className="h-12 bg-white/60 dark:bg-slate-700/60 border-slate-200 dark:border-slate-600 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3 md:col-span-2">
                <Label className="flex items-center text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <Edit3 className="h-4 w-4 mr-2" />
                  Description
                </Label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full h-24 p-3 bg-white/60 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Detailed description of the gemstone..."
                  required
                />
              </div>

              <div className="space-y-3">
                <Label className="flex items-center text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Price (USD)
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: parseFloat(e.target.value) || 0 })
                  }
                  className="h-12 bg-white/60 dark:bg-slate-700/60 border-slate-200 dark:border-slate-600 rounded-xl"
                  placeholder="2500.00"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label className="flex items-center text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Stock Quantity
                </Label>
                <Input
                  type="number"
                  min="0"
                  value={form.stock_quantity}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      stock_quantity: parseInt(e.target.value) || 0,
                    })
                  }
                  className="h-12 bg-white/60 dark:bg-slate-700/60 border-slate-200 dark:border-slate-600 rounded-xl"
                  placeholder="5"
                  required
                />
              </div>

              <div className="space-y-3 md:col-span-2">
                <Label className="flex items-center text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Product Image
                </Label>

                {/* File Upload */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelectedFile(file);
                          setForm({ ...form, image_url: "" }); // Clear URL when file is selected
                        }
                      }}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl cursor-pointer hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Choose Image
                    </label>
                    {selectedFile && (
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {selectedFile.name}
                      </span>
                    )}
                  </div>

                  {/* Image Preview */}
                  {(selectedFile || form.image_url) && (
                    <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      <img
                        src={selectedFile ? URL.createObjectURL(selectedFile) : form.image_url}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded-lg border border-slate-200 dark:border-slate-600"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Image Preview
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {selectedFile ? `${selectedFile.name} (${(selectedFile.size / 1024 / 1024).toFixed(2)} MB)` : "URL Image"}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedFile(null);
                          setForm({ ...form, image_url: "" });
                        }}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {/* URL Input as Alternative */}
                  <div className="text-center text-slate-500 dark:text-slate-400 text-sm mb-2">
                    — OR —
                  </div>
                  <Input
                    value={form.image_url}
                    onChange={(e) => {
                      setForm({ ...form, image_url: e.target.value });
                      if (e.target.value) setSelectedFile(null); // Clear file when URL is entered
                    }}
                    className="h-12 bg-white/60 dark:bg-slate-700/60 border-slate-200 dark:border-slate-600 rounded-xl"
                    placeholder="https://example.com/sapphire.jpg"
                    disabled={!!selectedFile}
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Enter an image URL or upload a file above
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 md:col-span-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={form.active}
                  onChange={(e) =>
                    setForm({ ...form, active: e.target.checked })
                  }
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <Label
                  htmlFor="active"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Product is active and available for sale
                </Label>
              </div>

              <div className="md:col-span-2 flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setCreating(false);
                    setEditing(null);
                    resetForm();
                  }}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button
                  onClick={saveProduct}
                  disabled={loading || uploading}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg px-6"
                >
                  {uploading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      {editing ? "Update Product" : "Create Product"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters Section */}
      <Card className="backdrop-blur-md bg-white/80 dark:bg-slate-800/80 border-0 shadow-lg rounded-xl">
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-white/60 dark:bg-slate-700/60 border-slate-200 dark:border-slate-600 rounded-xl"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-11 bg-white/60 dark:bg-slate-700/60 border-slate-200 dark:border-slate-600 rounded-xl">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-11 bg-white/60 dark:bg-slate-700/60 border-slate-200 dark:border-slate-600 rounded-xl">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                <SelectItem value="Low Stock">Low Stock</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="h-11 bg-white/60 dark:bg-slate-700/60 border-slate-200 dark:border-slate-600 rounded-xl">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Prices</SelectItem>
                <SelectItem value="Under $1000">Under $1,000</SelectItem>
                <SelectItem value="$1000-$5000">$1,000 - $5,000</SelectItem>
                <SelectItem value="$5000-$10000">$5,000 - $10,000</SelectItem>
                <SelectItem value="Over $10000">Over $10,000</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={() => {
                setSearchQuery("");
                setCategoryFilter("All");
                setStatusFilter("All");
                setPriceRange("All");
              }}
              variant="outline"
              className="h-11 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 scr-y">
        {filteredProducts.map((product, index) => (
          <Card
            key={product.id}
            className="group backdrop-blur-md bg-white/80 dark:bg-slate-800/80 border-0 shadow-lg hover:shadow-2xl rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 hover:-translate-y-2"
            style={{
              animationDelay: `${index * 0.1}s`,
              animation: mounted ? "fadeInUp 0.6s ease-out forwards" : "none",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-purple-50/50 dark:from-slate-800/50 dark:to-slate-700/50"></div>

            {/* Product Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={product.image_url || "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop"}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop";
                }}
              />
              <div className="absolute top-3 right-3 flex flex-col space-y-2">
                <Badge
                  className={`bg-gradient-to-r ${
                    product.active
                      ? "from-emerald-500 to-teal-500"
                      : "from-red-500 to-pink-500"
                  } text-white border-0 text-xs`}
                >
                  {product.active ? "Active" : "Inactive"}
                </Badge>
                <Badge
                  className={`bg-gradient-to-r ${getStockBadgeColor(
                    product.stock_quantity
                  )} text-white border-0 text-xs`}
                >
                  {getStockStatus(product.stock_quantity)}
                </Badge>
              </div>
              <div className="absolute top-3 left-3">
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 text-xs">
                  {product.category}
                </Badge>
              </div>
            </div>

            <CardContent className="relative z-10 p-4">
              <div className="space-y-3">
                <div>
                  <h3 className="font-bold text-lg text-slate-800 dark:text-white line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mt-1">
                    {product.description}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-purple-600">
                    {formatPrice(product.price)}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    Stock: {product.stock_quantity}
                  </div>
                </div>

                <div className="text-xs text-slate-400 flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  Created {new Date(product.created_at).toLocaleDateString()}
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startEdit(product)}
                    className="flex-1 h-8 text-xs border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    <Edit3 className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleActive(product)}
                    className="h-8 text-xs border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    {product.active ? (
                      <EyeOff className="h-3 w-3" />
                    ) : (
                      <Eye className="h-3 w-3" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteProduct(product)}
                    className="h-8 text-xs bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 border-0"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <Card className="backdrop-blur-md bg-white/80 dark:bg-slate-800/80 border-0 shadow-lg rounded-xl">
          <CardContent className="py-16 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 rounded-full flex items-center justify-center">
              <Gem className="h-8 w-8 text-slate-500 dark:text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {products.length === 0
                ? "No Products Found"
                : "No Products Match Your Filters"}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-4">
              {products.length === 0
                ? "Start building your gem collection by adding your first product."
                : "Try adjusting your search criteria or filters to find more products."}
            </p>
            {products.length === 0 && (
              <Button
                onClick={() => {
                  setCreating(true);
                  setEditing(null);
                  resetForm();
                }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Product
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-2xl text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-purple-500 mx-auto mb-4" />
            <p className="text-slate-700 dark:text-slate-300">Processing...</p>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-products-page {
          font-size: 1.6rem;
        }

        .admin-products-page * {
          font-size: inherit;
        }

        .admin-products-page .text-xs {
          font-size: 1.2rem;
        }
        .admin-products-page .text-sm {
          font-size: 1.4rem;
        }
        .admin-products-page .text-base {
          font-size: 1.6rem;
        }
        .admin-products-page .text-lg {
          font-size: 1.8rem;
        }
        .admin-products-page .text-xl {
          font-size: 2rem;
        }
        .admin-products-page .text-2xl {
          font-size: 2.4rem;
        }
        .admin-products-page .text-3xl {
          font-size: 3rem;
        }

        .line-clamp-1 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }

        .line-clamp-2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
