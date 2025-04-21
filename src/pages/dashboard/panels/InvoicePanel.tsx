
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getInvoice } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { InvoiceSummary } from "@/types";

const invoiceSchema = z.object({
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
}).refine(data => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return start <= end;
}, {
  message: "End date must be after start date",
  path: ["endDate"],
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

const InvoicePanel: React.FC = () => {
  const [invoiceData, setInvoiceData] = useState<InvoiceSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
      endDate: new Date().toISOString().split('T')[0], // today
    },
  });
  
  const onSubmit = async (values: InvoiceFormValues) => {
    setIsLoading(true);
    try {
      const response = await getInvoice(values.startDate, values.endDate);
      
      if (response.error) {
        toast({
          variant: "destructive",
          title: "Invoice Generation Failed",
          description: response.error,
        });
      } else if (response.data) {
        setInvoiceData(response.data);
        toast({
          title: "Invoice Generated",
          description: "Your invoice has been generated successfully",
        });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Invoice Generation Failed",
        description: "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Invoice</CardTitle>
        <CardDescription>
          Create detailed invoices for specific date ranges
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="date" disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Generating..." : "Generate Invoice"}
            </Button>
          </form>
        </Form>
        
        {invoiceData && (
          <div className="mt-8 border-t pt-8">
            <h3 className="text-xl font-bold mb-4">Invoice Summary</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Period</p>
                  <p className="font-medium">
                    {formatDate(invoiceData.startDate)} - {formatDate(invoiceData.endDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Invoice Date</p>
                  <p className="font-medium">
                    {formatDate(new Date().toISOString())}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Transaction Count</p>
                  <p className="font-medium">
                    {invoiceData.transactionCount}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="font-bold text-fintech-blue">
                    {formatCurrency(invoiceData.totalAmount)}
                  </p>
                </div>
              </div>
              
              <Alert className="bg-gray-50 border">
                <AlertTitle>Ready for Download</AlertTitle>
                <AlertDescription>
                  Your invoice summary is ready. You can download it as a PDF or view the details below.
                </AlertDescription>
              </Alert>
              
              <div className="flex justify-start space-x-2">
                <Button
                  onClick={() => window.open(invoiceData.downloadUrl, '_blank')}
                  className="bg-fintech-blue hover:bg-fintech-blue/90"
                >
                  Download PDF
                </Button>
                <Button variant="outline">
                  Print Invoice
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InvoicePanel;
