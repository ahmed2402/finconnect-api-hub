
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
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
    <Layout>
      <div className="layout-container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Developer Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage and explore your financial APIs</p>
          </div>
          
          {currentPlan && (
            <div className="mt-4 md:mt-0 px-4 py-2 bg-fintech-blue/10 rounded-md flex items-center">
              <div>
                <p className="text-sm font-medium">Current Plan: <span className="text-fintech-blue">{currentPlan.name}</span></p>
                <p className="text-xs text-gray-600">Rate Limit: {currentPlan.requestsPerMinute} req/min</p>
              </div>
              <Button 
                variant="link" 
                className="text-fintech-blue ml-2"
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
          
          <TabsContent value="balance">
            <BalancePanel />
          </TabsContent>
          
          <TabsContent value="transfer">
            <TransferPanel onTransferSuccess={() => setActiveTab("balance")} />
          </TabsContent>
          
          <TabsContent value="transactions">
            <TransactionsPanel />
          </TabsContent>
          
          <TabsContent value="invoice">
            <InvoicePanel />
          </TabsContent>
        </Tabs>
        
        <div className="mt-12 border-t pt-8">
          <h2 className="text-xl font-semibold mb-4">API Documentation</h2>
          <p className="mb-4">
            Learn how to integrate these APIs into your application with our comprehensive documentation.
          </p>
          <Button 
            variant="outline" 
            onClick={() => navigate("/documentation")}
          >
            View API Docs
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
