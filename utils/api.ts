// api.ts
import axios, { AxiosResponse } from "axios";
import { Product, Order, OrderItem } from "../types";

const API_BASE_URL = "https://royal-gems-backend-production.up.railway.app/api";
// const API_BASE_URL = "http://localhost:4000/api";

// ✅ Products
export async function getProducts(): Promise<Product[]> {
  console.log("current base url", API_BASE_URL);

  const res: AxiosResponse<Product[]> = await axios.get(
    `${API_BASE_URL}/products`
  );
  return res.data;
}

export async function getProductById(id: string): Promise<Product> {
  const res: AxiosResponse<Product> = await axios.get(
    `${API_BASE_URL}/products/${id}`
  );
  return res.data;
}

export async function createProduct(
  product: Omit<Product, "id" | "created_at">
): Promise<Product> {
  console.log("Product ready to send to the backend = ", product);
  const res: AxiosResponse<Product> = await axios.post(
    `${API_BASE_URL}/products`,
    product
  );
  return res.data;
}

export async function updateProduct(
  id: string,
  product: Partial<Product>
): Promise<Product> {
  const res: AxiosResponse<Product> = await axios.put(
    `${API_BASE_URL}/products/${id}`,
    product
  );
  return res.data;
}

export async function deleteProduct(id: string): Promise<{ message: string }> {
  const res = await axios.delete(`${API_BASE_URL}/products/${id}`);
  return res.data;
}

// ✅ Orders
export async function getOrders(): Promise<Order[]> {
  const res: AxiosResponse<Order[]> = await axios.get(`${API_BASE_URL}/orders`);
  return res.data;
}

export async function getOrderById(id: string): Promise<Order> {
  const res: AxiosResponse<Order> = await axios.get(
    `${API_BASE_URL}/orders/${id}`
  );
  return res.data;
}

export async function createOrder(order: Order): Promise<Order> {
  const res: AxiosResponse<Order> = await axios.post(
    `${API_BASE_URL}/orders`,
    order
  );
  return res.data;
}

export async function updateOrderStatus(
  id: string,
  status: Order["status"]
): Promise<Order> {
  const res: AxiosResponse<Order> = await axios.put(
    `${API_BASE_URL}/orders/${id}`,
    { status }
  );
  return res.data;
}

export async function deleteOrder(id: string): Promise<{ message: string }> {
  const res = await axios.delete(`${API_BASE_URL}/orders/${id}`);
  return res.data;
}

// ✅ Order Items (if needed separately)
export async function getOrderItems(orderId: string): Promise<OrderItem[]> {
  const res: AxiosResponse<OrderItem[]> = await axios.get(
    `${API_BASE_URL}/orders/${orderId}/items`
  );
  return res.data;
}

export async function addOrderItem(
  orderId: string,
  item: { product_id: string; quantity: number; price: number }
): Promise<OrderItem> {
  const res: AxiosResponse<OrderItem> = await axios.post(
    `${API_BASE_URL}/orders/${orderId}/items`,
    item
  );
  return res.data;
}

export async function deleteOrderItem(
  orderId: string,
  itemId: string
): Promise<{ message: string }> {
  const res = await axios.delete(
    `${API_BASE_URL}/orders/${orderId}/items/${itemId}`
  );
  return res.data;
}
