
export type User = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "developer";
  createdAt: string;
};

export type Subscription = {
  id: string;
  userId: string;
  planId: string;
  status: "active" | "cancelled" | "inactive";
  startDate: string;
  endDate: string | null;
};

export type Plan = {
  id: string;
  name: string;
  price: number;
  features: string[];
  requestsPerMinute: number;
};

export type Balance = {
  balance: number;
  lastUpdated: string;
};

export type Transaction = {
  id: string;
  sourceAccountId: string;
  destinationAccountId: string;
  amount: number;
  description: string;
  status: "completed" | "pending" | "failed";
  createdAt: string;
};

export type TransferRequest = {
  sourceAccountId: string;
  destinationAccountId: string;
  amount: number;
  description?: string;
};

export type InvoiceSummary = {
  startDate: string;
  endDate: string;
  transactionCount: number;
  totalAmount: number;
  downloadUrl: string;
};

export type RequestLog = {
  id: string;
  userId: string;
  endpoint: string;
  method: string;
  statusCode: number;
  timestamp: string;
};

export type PaginationParams = {
  page: number;
  pageSize: number;
};

export type ApiResponse<T> = {
  data?: T;
  error?: string;
  status: number;
};
