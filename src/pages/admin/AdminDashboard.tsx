
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UsersPanel from "./panels/UsersPanel";
import LogsPanel from "./panels/LogsPanel";

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <Layout>
      <div className="layout-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage users, subscriptions, and view system logs</p>
        </div>
        
        <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <UsersPanel />
          </TabsContent>
          
          <TabsContent value="logs">
            <LogsPanel />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
