"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Search,
  Eye,
  RefreshCw,
  Calendar,
  DollarSign,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Download,
  Edit3,
  Globe,
} from "lucide-react";
import { getOrders } from "@/utils/api";

import { Order } from "@/types";

const ORDER_STATUSES = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];
const PAYMENT_STATUSES = ["pending", "completed", "failed"];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [dateRange, setDateRange] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function fetchOrders() {
      try {
        const orders: Order[] = await getOrders();
        if (orders) {
          setOrders(orders);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchOrders();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [orders, searchQuery, statusFilter, paymentFilter, dateRange]);

  function applyFilters() {
    let filtered = orders;

    // Search filter
    if (searchQuery) {
      filtered = filtered?.filter(
        (order) =>
          order._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.billing_details.email
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          `${order.billing_details.firstName} ${order.billing_details.lastName}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          order.payment_id?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "All") {
      filtered = filtered?.filter((order) => order.status === statusFilter);
    }

    // Payment filter
    if (paymentFilter !== "All") {
      filtered = filtered?.filter(
        (order) => order.payment_status === paymentFilter
      );
    }

    // Date range filter
    // if (dateRange !== "All") {
    //   const now = new Date();
    //   const filterDate = new Date();

    //   if (dateRange === "Today") {
    //     filterDate.setHours(0, 0, 0, 0);
    //   } else if (dateRange === "This Week") {
    //     filterDate.setDate(now.getDate() - 7);
    //   } else if (dateRange === "This Month") {
    //     filterDate.setMonth(now.getMonth() - 1);
    //   }

    //   filtered = filtered?.filter(
    //     (order) => new Date(order.created_at) >= filterDate
    //   );
    // }
    if (filtered != null) {
      setFilteredOrders(filtered);
    }
  }

  async function updateOrderStatus(
    orderId: string,
    newStatus: Order["status"]
  ) {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } finally {
      setLoading(false);
    }
  }

  function getStatusIcon(status: Order["status"]) {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "processing":
        return <RefreshCw className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "delivered":
        return <CheckCircle2 className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  }

  function getStatusColor(status: Order["status"]) {
    switch (status) {
      case "pending":
        return "from-orange-500 to-amber-500";
      case "processing":
        return "from-blue-500 to-indigo-500";
      case "shipped":
        return "from-purple-500 to-pink-500";
      case "delivered":
        return "from-emerald-500 to-teal-500";
      case "cancelled":
        return "from-red-500 to-pink-500";
      default:
        return "from-gray-500 to-slate-500";
    }
  }

  function getPaymentStatusColor(status: Order["payment_status"]) {
    switch (status) {
      case "completed":
        return "from-emerald-500 to-teal-500";
      case "pending":
        return "from-orange-500 to-amber-500";
      case "failed":
        return "from-red-500 to-pink-500";
      default:
        return "from-gray-500 to-slate-500";
    }
  }

  function formatPrice(price: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(price);
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (!mounted) {
    return null;
  }

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    totalRevenue: orders
      .filter((o) => o.payment_status === "completed")
      .reduce((sum, o) => sum + o.total_amount, 0),
    pendingRevenue: orders
      .filter((o) => o.payment_status === "pending")
      .reduce((sum, o) => sum + o.total_amount, 0),
  };

  return (
    <div className="admin-orders-page space-y-8">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full animate-pulse"></div>
        <div
          className="absolute bottom-20 left-10 w-24 h-24 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full animate-bounce"
          style={{ animationDuration: "3s" }}
        ></div>
      </div>

      {/* Header Section with Stats */}
      <div className="relative z-10 backdrop-blur-md bg-white/80 dark:bg-slate-800/80 rounded-2xl p-6 shadow-2xl border border-white/20">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg">
              <ShoppingCart className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Order Management
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Track and manage customer orders
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mt-6">
          <div className="bg-white/60 dark:bg-slate-700/60 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-slate-800 dark:text-white">
              {stats.total}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Total Orders
            </div>
          </div>
          <div className="bg-white/60 dark:bg-slate-700/60 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {stats.pending}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Pending
            </div>
          </div>
          <div className="bg-white/60 dark:bg-slate-700/60 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {stats.processing}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Processing
            </div>
          </div>
          <div className="bg-white/60 dark:bg-slate-700/60 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {stats.shipped}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Shipped
            </div>
          </div>
          <div className="bg-white/60 dark:bg-slate-700/60 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-emerald-600">
              {stats.delivered}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Delivered
            </div>
          </div>
          <div className="bg-white/60 dark:bg-slate-700/60 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-emerald-600">
              {formatPrice(stats.totalRevenue)}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Revenue
            </div>
          </div>
          <div className="bg-white/60 dark:bg-slate-700/60 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {formatPrice(stats.pendingRevenue)}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Pending
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <Card className="backdrop-blur-md bg-white/80 dark:bg-slate-800/80 border-0 shadow-lg rounded-xl">
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search orders, customers, emails..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-white/60 dark:bg-slate-700/60 border-slate-200 dark:border-slate-600 rounded-xl"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-11 bg-white/60 dark:bg-slate-700/60 border-slate-200 dark:border-slate-600 rounded-xl">
                <SelectValue placeholder="Order Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                {ORDER_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="h-11 bg-white/60 dark:bg-slate-700/60 border-slate-200 dark:border-slate-600 rounded-xl">
                <SelectValue placeholder="Payment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Payments</SelectItem>
                {PAYMENT_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="h-11 bg-white/60 dark:bg-slate-700/60 border-slate-200 dark:border-slate-600 rounded-xl">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Time</SelectItem>
                <SelectItem value="Today">Today</SelectItem>
                <SelectItem value="This Week">This Week</SelectItem>
                <SelectItem value="This Month">This Month</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("All");
                setPaymentFilter("All");
                setDateRange("All");
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

      {/* Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 scr-y">
        {filteredOrders.map((order, index) => (
          <Card
            key={order._id}
            className="group backdrop-blur-md bg-white/80 dark:bg-slate-800/80 border-0 shadow-lg hover:shadow-2xl rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 hover:-translate-y-2"
            style={{
              animationDelay: `${index * 0.1}s`,
              animation: mounted ? "fadeInUp 0.6s ease-out forwards" : "none",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-blue-50/50 dark:from-slate-800/50 dark:to-slate-700/50"></div>

            <CardHeader className="relative z-10 pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg font-bold text-slate-800 dark:text-white flex items-center">
                    <Package className="h-5 w-5 mr-2 text-blue-500" />
                    {order._id}
                  </CardTitle>
                  <div className="flex items-center space-x-2 mt-2">
                    <h1>Order Status</h1>
                    <Badge
                      className={`bg-gradient-to-r ${getStatusColor(
                        order.status
                      )} text-white border-0 text-xs flex items-center`}
                    >
                      {getStatusIcon(order.status)}
                      <span className="ml-1">
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </Badge>
                    <h1>Payment Status :</h1>
                    <Badge
                      className={`bg-gradient-to-r ${getPaymentStatusColor(
                        order.payment_status
                      )} text-white border-0 text-xs flex items-center`}
                    >
                      <CreditCard className="h-3 w-3 mr-1" />
                      {order.payment_status.charAt(0).toUpperCase() +
                        order.payment_status.slice(1)}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatPrice(order.total_amount)}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {order.order_items?.length || 0} items
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="relative z-10 pt-0">
              <div className="space-y-4">
                {/* Customer Info */}
                <div className="bg-white/60 dark:bg-slate-700/60 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="h-4 w-4 text-slate-500" />
                    <span className="font-semibold text-sm text-slate-700 dark:text-slate-300">
                      Customer
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-800 dark:text-white">
                      {order.billing_details.firstName}{" "}
                      {order.billing_details.lastName}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 flex flex-col items-start">
                      <Mail className="h-3 w-3 mr-1" />
                      <span>email: {order.billing_details.email}</span>
                      <span>phone: {order.billing_details.phone}</span>
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 flex flex-col items-start">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>address : {order.billing_details.address}</span>
                      <span>
                        city : {order.billing_details.city}, country :
                        {order.billing_details.country}
                      </span>
                      <span>
                        {" "}
                        postalCode : {order.billing_details.postalCode}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Order Items Preview */}
                {order.order_items && order.order_items.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-slate-500" />
                      <span className="font-semibold text-sm text-slate-700 dark:text-slate-300">
                        Items
                      </span>
                    </div>
                    <div className="space-y-2">
                      {order.order_items?.slice(0, 2).map((item) => {
                        const product =
                          item.products || (item.product_id as any); // populated product
                        return (
                          <div
                            key={item._id}
                            className="flex items-center space-x-3 bg-white/40 dark:bg-slate-600/40 rounded-lg p-2"
                          >
                            <img
                              src={product?.image_url || "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=50&h=50&fit=crop"}
                              alt={product?.name || "Product"}
                              className="w-8 h-8 rounded object-cover"
                              onError={(e) => {
                                e.currentTarget.onerror = null; // avoid infinite loop
                                e.currentTarget.src =
                                  "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=50&h=50&fit=crop";
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-slate-800 dark:text-white truncate">
                                {product?.name}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                Qty: {item.quantity} × {formatPrice(item.price)}
                              </p>
                            </div>
                          </div>
                        );
                      })}

                      {order.order_items && order.order_items.length > 2 && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                          +{order.order_items.length - 2} more items
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Order Date & Payment */}
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {/* {formatDate(order.created_at)} */}
                  </div>
                  {order.payment_id && (
                    <div className="flex items-center">
                      <CreditCard className="h-3 w-3 mr-1" />
                      {order.payment_id}
                    </div>
                  )}
                </div>

                {/* Status Update & Actions */}
                <div className="flex space-x-2 pt-2">
                  <Select
                    value={order.status}
                    onValueChange={(newStatus: Order["status"]) =>
                      updateOrderStatus(order._id ? order._id : "", newStatus)
                    }
                  >
                    <SelectTrigger className="flex-1 h-8 text-xs bg-white/60 dark:bg-slate-700/60 border-slate-200 dark:border-slate-600 rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ORDER_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedOrder(order)}
                    className="h-8 text-xs border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <Card className="backdrop-blur-md bg-white/80 dark:bg-slate-800/80 border-0 shadow-lg rounded-xl">
          <CardContent className="py-16 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 rounded-full flex items-center justify-center">
              <ShoppingCart className="h-8 w-8 text-slate-500 dark:text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {orders.length === 0
                ? "No Orders Found"
                : "No Orders Match Your Filters"}
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              {orders.length === 0
                ? "Orders will appear here when customers make purchases."
                : "Try adjusting your search criteria or filters to find more orders."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-auto backdrop-blur-md bg-white/90 dark:bg-slate-800/90 border-0 shadow-2xl rounded-2xl">
            <CardHeader className="border-b border-slate-200/50 dark:border-slate-600/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg shadow-lg">
                    <ShoppingCart className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-slate-800 dark:text-white">
                      Order Details - {selectedOrder._id}
                    </CardTitle>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {/* Created on {formatDate(selectedOrder.created_at)} */}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedOrder(null)}
                  className="border-slate-200 dark:border-slate-600"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Close
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Order Status & Payment Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/60 dark:bg-slate-700/60 rounded-xl p-4">
                  <h3 className="font-semibold text-slate-800 dark:text-white mb-3 flex items-center">
                    <Package className="h-4 w-4 mr-2" />
                    Order Status
                  </h3>
                  <Badge
                    className={`bg-gradient-to-r ${getStatusColor(
                      selectedOrder.status
                    )} text-white border-0 flex items-center w-fit`}
                  >
                    {getStatusIcon(selectedOrder.status)}
                    <span className="ml-1">
                      {selectedOrder.status.charAt(0).toUpperCase() +
                        selectedOrder.status.slice(1)}
                    </span>
                  </Badge>
                </div>

                <div className="bg-white/60 dark:bg-slate-700/60 rounded-xl p-4">
                  <h3 className="font-semibold text-slate-800 dark:text-white mb-3 flex items-center">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Payment Status
                  </h3>
                  <Badge
                    className={`bg-gradient-to-r ${getPaymentStatusColor(
                      selectedOrder.payment_status
                    )} text-white border-0 flex items-center w-fit`}
                  >
                    <CreditCard className="h-3 w-3 mr-1" />
                    {selectedOrder.payment_status.charAt(0).toUpperCase() +
                      selectedOrder.payment_status.slice(1)}
                  </Badge>
                  {selectedOrder.payment_id && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                      Payment ID: {selectedOrder.payment_id}
                    </p>
                  )}
                </div>

                <div className="bg-white/60 dark:bg-slate-700/60 rounded-xl p-4">
                  <h3 className="font-semibold text-slate-800 dark:text-white mb-3 flex items-center">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Order Total
                  </h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatPrice(selectedOrder.total_amount)}
                  </p>
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-white/60 dark:bg-slate-700/60 rounded-xl p-6">
                <h3 className="font-semibold text-slate-800 dark:text-white mb-4 flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                        Full Name
                      </label>
                      <p className="text-sm font-medium text-slate-800 dark:text-white">
                        {selectedOrder.billing_details.firstName}{" "}
                        {selectedOrder.billing_details.lastName}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                        Email
                      </label>
                      <p className="text-sm text-slate-800 dark:text-white flex items-center">
                        <Mail className="h-3 w-3 mr-2 text-slate-500" />
                        {selectedOrder.billing_details.email}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                        Phone
                      </label>
                      <p className="text-sm text-slate-800 dark:text-white flex items-center">
                        <Phone className="h-3 w-3 mr-2 text-slate-500" />
                        {selectedOrder.billing_details.phone}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                        Address
                      </label>
                      <p className="text-sm text-slate-800 dark:text-white">
                        {selectedOrder.billing_details.address}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                        City & Postal Code
                      </label>
                      <p className="text-sm text-slate-800 dark:text-white">
                        {selectedOrder.billing_details.city},{" "}
                        {selectedOrder.billing_details.postalCode}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                        Country
                      </label>
                      <p className="text-sm text-slate-800 dark:text-white flex items-center">
                        <Globe className="h-3 w-3 mr-2 text-slate-500" />
                        {selectedOrder.billing_details.country}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              {selectedOrder.order_items && (
                <div className="bg-white/60 dark:bg-slate-700/60 rounded-xl p-6">
                  <h3 className="font-semibold text-slate-800 dark:text-white mb-4 flex items-center">
                    <Package className="h-4 w-4 mr-2" />
                    Order Items ({selectedOrder.order_items.length})
                  </h3>
                  <div className="space-y-4">
                    {selectedOrder.order_items.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center space-x-4 bg-white/40 dark:bg-slate-600/40 rounded-lg p-4"
                      >
                        <img
                          src={item.products?.image_url || "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=100&h=100&fit=crop"}
                          alt={item.products?.name}
                          className="w-16 h-16 rounded-lg object-cover shadow-md"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=100&h=100&fit=crop";
                          }}
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-800 dark:text-white">
                            {item.products?.name}
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Category: {item.products?.category}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-slate-800 dark:text-white">
                            {formatPrice(item.price)}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            per item
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Total */}
                  <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-600/50">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-slate-800 dark:text-white">
                        Total Amount:
                      </span>
                      <span className="text-2xl font-bold text-blue-600">
                        {formatPrice(selectedOrder.total_amount)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200/50 dark:border-slate-600/50">
                <Button
                  variant="outline"
                  className="border-slate-200 dark:border-slate-600"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Order
                </Button>
                <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-0">
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Order
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-40">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-2xl text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-slate-700 dark:text-slate-300">
              Updating order...
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-orders-page {
          font-size: 1.6rem;
        }

        .admin-orders-page * {
          font-size: inherit;
        }

        .admin-orders-page .text-xs {
          font-size: 1.2rem;
        }
        .admin-orders-page .text-sm {
          font-size: 1.4rem;
        }
        .admin-orders-page .text-base {
          font-size: 1.6rem;
        }
        .admin-orders-page .text-lg {
          font-size: 1.8rem;
        }
        .admin-orders-page .text-xl {
          font-size: 2rem;
        }
        .admin-orders-page .text-2xl {
          font-size: 2.4rem;
        }
        .admin-orders-page .text-3xl {
          font-size: 3rem;
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
      `}</style>
    </div>
  );
}
