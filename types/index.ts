import { Timestamp } from "next/dist/server/lib/cache-handlers/types";

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

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface BillingDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  _id?: string;
  product_id: string;
  quantity: number;
  price: number;
  products: Product;
}

export interface Order {
  _id?: string;
  orderId: string;
  total_amount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  billing_details: BillingDetails;
  payment_status: "pending" | "completed" | "failed";
  payment_id?: string;
  order_items?: OrderItem[];
}

export type CheckoutRequest = {
  order_id: string;
  items: string;
  amount: number;
  currency?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
};

export type PaymentRequest = {
  checkout: CheckoutRequest;
  isProcessing: boolean;
  total: number;
  isValid: boolean;
  type?: "button" | "submit" | "reset";
};

export interface PayHereFields {
  merchant_id: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  order_id: string;
  items: string;
  currency: string;
  amount: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  hash: string;
  [key: string]: string; // Allow additional fields
}

export interface PaymentVerification {
  orderId: string;
  status: string;
  amount: number;
  currency: string;
  paymentId?: string;
  statusMessage?: string;
  paymentMethod?: string;
  createdAt: string;
  updatedAt?: string;
}
