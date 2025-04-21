
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getTransactions } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Transaction } from "@/types";

const TransactionsPanel: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const fetchTransactions = async (page: number = currentPage, size: number = pageSize) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getTransactions({ page, pageSize: size });
      if (response.error) {
        setError(response.error);
        toast({
          variant: "destructive",
          title: "Error",
          description: response.error,
        });
      } else if (response.data) {
        setTransactions(response.data.transactions);
        setTotalTransactions(response.data.total);
      }
    } catch (err) {
      setError("Failed to fetch transactions");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch transactions",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTransactions();
  }, [currentPage, pageSize]);
  
  const totalPages = Math.ceil(totalTransactions / pageSize);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>
          View your recent transactions and payment history
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center p-4 border rounded">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-48"></div>
                  <div className="h-3 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => fetchTransactions()}>Retry</Button>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No transactions found</p>
            <Button onClick={() => fetchTransactions()}>Refresh</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex flex-col sm:flex-row justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center">
                    <span className={`w-2 h-2 rounded-full mr-2 ${transaction.status === 'completed' ? 'bg-green-500' : transaction.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
                    <h4 className="font-medium">{transaction.description}</h4>
                  </div>
                  <p className="text-sm text-gray-500">
                    {formatDate(transaction.createdAt)} · ID: {transaction.id.substring(0, 8)}...
                  </p>
                  <p className="text-xs text-gray-400">
                    From: {transaction.sourceAccountId.substring(0, 8)}... To: {transaction.destinationAccountId.substring(0, 8)}...
                  </p>
                </div>
                <div className="text-right mt-2 sm:mt-0">
                  <p className={`font-semibold ${transaction.status === 'completed' ? 'text-green-600' : ''}`}>
                    {formatCurrency(transaction.amount)}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{transaction.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      {!isLoading && !error && transactions.length > 0 && (
        <CardFooter className="flex justify-between">
          <div className="text-sm text-gray-500">
            Showing {transactions.length} of {totalTransactions} transactions
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex items-center px-2 text-sm">
              {currentPage} / {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default TransactionsPanel;
