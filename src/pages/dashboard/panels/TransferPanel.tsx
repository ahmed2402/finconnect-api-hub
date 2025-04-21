
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckIcon } from "lucide-react";
import { getTestAccounts, transferFunds } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { TransferRequest } from "@/types";

interface TransferPanelProps {
  onTransferSuccess?: () => void;
}

const transferSchema = z.object({
  sourceAccountId: z.string().min(1, "Source account is required"),
  destinationAccountId: z.string().min(1, "Destination account is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  description: z.string().optional(),
}).refine(data => data.sourceAccountId !== data.destinationAccountId, {
  message: "Source and destination accounts must be different",
  path: ["destinationAccountId"],
});

type TransferFormValues = z.infer<typeof transferSchema>;

const TransferPanel: React.FC<TransferPanelProps> = ({ onTransferSuccess }) => {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<TransferFormValues>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      sourceAccountId: "",
      destinationAccountId: "",
      amount: 0,
      description: "",
    },
  });
  
  useEffect(() => {
    fetchAccounts();
  }, []);
  
  const fetchAccounts = async () => {
    try {
      const response = await getTestAccounts();
      if (response.data) {
        setAccounts(response.data);
        if (response.data.length >= 2) {
          form.setValue("sourceAccountId", response.data[0].id);
          form.setValue("destinationAccountId", response.data[1].id);
        }
      }
    } catch (err) {
      console.error("Failed to fetch test accounts:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch test accounts",
      });
    }
  };
  
  const onSubmit = async (values: TransferFormValues) => {
    setIsLoading(true);
    try {
      const transferData: TransferRequest = {
        sourceAccountId: values.sourceAccountId,
        destinationAccountId: values.destinationAccountId,
        amount: values.amount,
        description: values.description || "Fund transfer",
      };
      
      const response = await transferFunds(transferData);
      
      if (response.error) {
        toast({
          variant: "destructive",
          title: "Transfer Failed",
          description: response.error,
        });
      } else if (response.data) {
        setIsSuccess(true);
        toast({
          title: "Transfer Successful",
          description: `Successfully transferred $${values.amount.toFixed(2)}`,
        });
        setTimeout(() => {
          if (onTransferSuccess) {
            onTransferSuccess();
          }
        }, 2000);
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Transfer Failed",
        description: "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    form.reset();
    setIsSuccess(false);
  };
  
  const formatCurrency = (accountId: string) => {
    const account = accounts.find(acc => acc.id === accountId);
    if (!account) return "";
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(account.balance);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transfer Funds</CardTitle>
        <CardDescription>
          Transfer funds between accounts securely
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isSuccess ? (
          <div className="flex flex-col items-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckIcon className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Transfer Successful</h3>
            <p className="text-gray-600 mb-6">
              Your funds have been transferred successfully
            </p>
            <Button onClick={handleReset}>Make Another Transfer</Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="sourceAccountId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From Account</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select source account" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {accounts.map(account => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.name} - {formatCurrency(account.id)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="destinationAccountId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To Account</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select destination account" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {accounts.map(account => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.name} - {formatCurrency(account.id)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <Input
                          type="number"
                          placeholder="0.00"
                          className="pl-7"
                          step="0.01"
                          min="0.01"
                          disabled={isLoading}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add a description for this transfer"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Alert className="bg-blue-50 border-blue-200">
                <AlertTitle>Test Mode</AlertTitle>
                <AlertDescription>
                  This is a test mode transfer. Use the account IDs provided in the dashboard.
                </AlertDescription>
              </Alert>
              
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  disabled={isLoading}
                >
                  Reset
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Processing..." : "Transfer Funds"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
};

export default TransferPanel;
