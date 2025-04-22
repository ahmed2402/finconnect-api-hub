
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { getBalance } from "@/services/api";
import BalancePanel from "./panels/BalancePanel";
import TransferPanel from "./panels/TransferPanel";
import TransactionsPanel from "./panels/TransactionsPanel";
import InvoicePanel from "./panels/InvoicePanel";
import { useSubscription } from "@/contexts/SubscriptionContext";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentPlan } = useSubscription();
  const [activeTab, setActiveTab] = useState("balance");
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    document.title = "Dashboard | FinConnect";
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 p-8">
          <div className="max-w-screen-xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold">Developer Dashboard</h1>
                <p className="text-muted-foreground mt-1">Manage and explore your financial APIs</p>
              </div>
              
              {currentPlan && (
                <div className="mt-4 md:mt-0 px-4 py-2 bg-primary/10 rounded-md flex items-center">
                  <div>
                    <p className="text-sm font-medium">Current Plan: <span className="text-primary">{currentPlan.name}</span></p>
                    <p className="text-xs text-muted-foreground">Rate Limit: {currentPlan.requestsPerMinute} req/min</p>
                  </div>
                  <Button 
                    variant="link" 
                    className="text-primary ml-2"
                    onClick={() => navigate("/pricing")}
                  >
                    Change
                  </Button>
                </div>
              )}
            </div>
            
            <Tabs defaultValue="balance" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="balance">Balance</TabsTrigger>
                <TabsTrigger value="transfer">Transfer</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="invoice">Invoice</TabsTrigger>
              </TabsList>
              
              <TabsContent value="balance" className="animate-fade-in">
                <BalancePanel />
              </TabsContent>
              
              <TabsContent value="transfer" className="animate-fade-in">
                <TransferPanel onTransferSuccess={() => setActiveTab("balance")} />
              </TabsContent>
              
              <TabsContent value="transactions" className="animate-fade-in">
                <TransactionsPanel />
              </TabsContent>
              
              <TabsContent value="invoice" className="animate-fade-in">
                <InvoicePanel />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
