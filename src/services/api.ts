
import { ApiResponse, Balance, Transaction, TransferRequest, InvoiceSummary, RequestLog, User, PaginationParams } from "../types";

// Mock test accounts
const TEST_ACCOUNTS = [
  { id: "acc-123", name: "Test Account 1", balance: 1000 },
  { id: "acc-456", name: "Test Account 2", balance: 2000 },
];

// Mock transactions
let MOCK_TRANSACTIONS: Transaction[] = Array.from({ length: 50 }).map((_, i) => ({
  id: `tx-${i}`,
  sourceAccountId: Math.random() > 0.5 ? "acc-123" : "acc-456",
  destinationAccountId: Math.random() > 0.5 ? "acc-456" : "acc-123",
  amount: Math.floor(Math.random() * 500) + 1,
  description: `Transaction ${i + 1}`,
  status: "completed",
  createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
}));

// Mock request logs
const MOCK_LOGS: RequestLog[] = [];

// Helper to simulate API request
const simulateRequest = async <T>(data: T, error?: string): Promise<ApiResponse<T>> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  
  // Log the request
  const log: RequestLog = {
    id: `log-${Math.random().toString(36).substr(2, 9)}`,
    userId: JSON.parse(localStorage.getItem("user") || '{"id": "unknown"}').id,
    endpoint: window.location.pathname,
    method: "GET",
    statusCode: error ? 400 : 200,
    timestamp: new Date().toISOString(),
  };
  
  MOCK_LOGS.push(log);
  
  if (error) {
    return { error, status: 400 };
  }
  
  return { data, status: 200 };
};

// Check if the user is subscribed
const isUserSubscribed = (): boolean => {
  const subscription = localStorage.getItem("subscription");
  if (!subscription) return false;
  
  const parsed = JSON.parse(subscription);
  return parsed.status === "active";
};

// API Functions
export const getBalance = async (): Promise<ApiResponse<Balance>> => {
  if (!isUserSubscribed()) {
    return { error: "Subscription required", status: 403 };
  }
  
  const balance: Balance = {
    balance: TEST_ACCOUNTS[0].balance,
    lastUpdated: new Date().toISOString(),
  };
  
  return simulateRequest(balance);
};

export const transferFunds = async (transferData: TransferRequest): Promise<ApiResponse<Transaction>> => {
  if (!isUserSubscribed()) {
    return { error: "Subscription required", status: 403 };
  }
  
  // Validate transfer
  if (transferData.amount <= 0) {
    return { error: "Amount must be greater than 0", status: 400 };
  }
  
  if (transferData.sourceAccountId === transferData.destinationAccountId) {
    return { error: "Source and destination accounts cannot be the same", status: 400 };
  }
  
  // Check if accounts exist
  const sourceAccount = TEST_ACCOUNTS.find(acc => acc.id === transferData.sourceAccountId);
  const destAccount = TEST_ACCOUNTS.find(acc => acc.id === transferData.destinationAccountId);
  
  if (!sourceAccount) {
    return { error: "Source account not found", status: 404 };
  }
  
  if (!destAccount) {
    return { error: "Destination account not found", status: 404 };
  }
  
  // Check if sufficient balance
  if (sourceAccount.balance < transferData.amount) {
    return { error: "Insufficient funds", status: 400 };
  }
  
  // Process transfer
  sourceAccount.balance -= transferData.amount;
  destAccount.balance += transferData.amount;
  
  // Create transaction record
  const transaction: Transaction = {
    id: `tx-${Math.random().toString(36).substr(2, 9)}`,
    sourceAccountId: transferData.sourceAccountId,
    destinationAccountId: transferData.destinationAccountId,
    amount: transferData.amount,
    description: transferData.description || "Fund transfer",
    status: "completed",
    createdAt: new Date().toISOString(),
  };
  
  // Add to transactions
  MOCK_TRANSACTIONS.unshift(transaction);
  
  return simulateRequest(transaction);
};

export const getTransactions = async ({ page = 1, pageSize = 10 }: PaginationParams): Promise<ApiResponse<{ transactions: Transaction[], total: number }>> => {
  if (!isUserSubscribed()) {
    return { error: "Subscription required", status: 403 };
  }
  
  // Sort transactions by date (newest first)
  const sortedTransactions = [...MOCK_TRANSACTIONS].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  // Calculate pagination
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedTransactions = sortedTransactions.slice(start, end);
  
  return simulateRequest({
    transactions: paginatedTransactions,
    total: MOCK_TRANSACTIONS.length,
  });
};

export const getInvoice = async (startDate: string, endDate: string): Promise<ApiResponse<InvoiceSummary>> => {
  if (!isUserSubscribed()) {
    return { error: "Subscription required", status: 403 };
  }
  
  // Validate dates
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { error: "Invalid date format", status: 400 };
  }
  
  if (start > end) {
    return { error: "Start date must be before end date", status: 400 };
  }
  
  // Filter transactions within date range
  const filteredTransactions = MOCK_TRANSACTIONS.filter(tx => {
    const txDate = new Date(tx.createdAt);
    return txDate >= start && txDate <= end;
  });
  
  // Calculate total amount
  const totalAmount = filteredTransactions.reduce((sum, tx) => sum + tx.amount, 0);
  
  const invoiceSummary: InvoiceSummary = {
    startDate,
    endDate,
    transactionCount: filteredTransactions.length,
    totalAmount,
    downloadUrl: `#/invoice?start=${startDate}&end=${endDate}`, // Mock download URL
  };
  
  return simulateRequest(invoiceSummary);
};

// Admin API Functions
export const getAllUsers = async (): Promise<ApiResponse<User[]>> => {
  // Check if user is admin
  const storedUser = localStorage.getItem("user");
  if (!storedUser) {
    return { error: "Unauthorized", status: 401 };
  }
  
  const user = JSON.parse(storedUser);
  if (user.role !== "admin") {
    return { error: "Admin access required", status: 403 };
  }
  
  // Mock users
  const users: User[] = [
    {
      id: "user-123",
      email: "user@example.com",
      name: "Demo User",
      role: "developer",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "admin-123",
      email: "admin@example.com",
      name: "Admin User",
      role: "admin",
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "user-456",
      email: "developer@example.com",
      name: "Developer Test",
      role: "developer",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
  
  return simulateRequest(users);
};

export const cancelUserSubscription = async (userId: string): Promise<ApiResponse<{ success: boolean }>> => {
  // Check if user is admin
  const storedUser = localStorage.getItem("user");
  if (!storedUser) {
    return { error: "Unauthorized", status: 401 };
  }
  
  const user = JSON.parse(storedUser);
  if (user.role !== "admin") {
    return { error: "Admin access required", status: 403 };
  }
  
  // Mock subscription cancellation
  return simulateRequest({ success: true });
};

export const getRequestLogs = async ({ page = 1, pageSize = 10 }: PaginationParams): Promise<ApiResponse<{ logs: RequestLog[], total: number }>> => {
  // Check if user is admin
  const storedUser = localStorage.getItem("user");
  if (!storedUser) {
    return { error: "Unauthorized", status: 401 };
  }
  
  const user = JSON.parse(storedUser);
  if (user.role !== "admin") {
    return { error: "Admin access required", status: 403 };
  }
  
  // Sort logs by date (newest first)
  const sortedLogs = [...MOCK_LOGS].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  // Calculate pagination
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedLogs = sortedLogs.slice(start, end);
  
  return simulateRequest({
    logs: paginatedLogs,
    total: MOCK_LOGS.length,
  });
};

// Get test accounts
export const getTestAccounts = async (): Promise<ApiResponse<typeof TEST_ACCOUNTS>> => {
  if (!isUserSubscribed()) {
    return { error: "Subscription required", status: 403 };
  }
  
  return simulateRequest(TEST_ACCOUNTS);
};
