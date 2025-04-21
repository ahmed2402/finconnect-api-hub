
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getBalance, getTestAccounts } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Balance } from "@/types";

const BalancePanel: React.FC = () => {
  const [balance, setBalance] = useState<Balance | null>(null);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const fetchBalance = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getBalance();
      if (response.error) {
        setError(response.error);
        toast({
          variant: "destructive",
          title: "Error",
          description: response.error,
        });
      } else if (response.data) {
        setBalance(response.data);
      }
    } catch (err) {
      setError("Failed to fetch balance");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch balance",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchAccounts = async () => {
    try {
      const response = await getTestAccounts();
      if (response.data) {
        setAccounts(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch test accounts:", err);
    }
  };
  
  useEffect(() => {
    fetchBalance();
    fetchAccounts();
  }, []);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Account Balance</CardTitle>
          <CardDescription>
            View your current balance and account details
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-pulse text-center">
                <div className="h-8 bg-gray-200 rounded w-32 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-48 mx-auto"></div>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={fetchBalance}>Retry</Button>
            </div>
          ) : balance ? (
            <div className="space-y-6">
              <div className="text-center py-4">
                <h3 className="text-3xl font-bold text-fintech-blue">
                  {formatCurrency(balance.balance)}
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                  Last updated: {formatDate(balance.lastUpdated)}
                </p>
              </div>
              
              <div className="pt-4 border-t">
                <Button onClick={fetchBalance} variant="outline" size="sm">
                  Refresh Balance
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No balance information available</p>
              <Button onClick={fetchBalance}>Get Balance</Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {accounts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Accounts</CardTitle>
            <CardDescription>
              Available test accounts for API operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {accounts.map(account => (
                <div key={account.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{account.name}</h4>
                      <p className="text-sm text-gray-500">ID: {account.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(account.balance)}</p>
                    </div>
                  </div>
                </div>
              ))}
              <p className="text-sm text-gray-500 mt-2">
                Use these account IDs for testing transfer operations
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BalancePanel;
