
import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useNavigate } from "react-router-dom";

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const { isSubscribed, currentPlan, cancelSubscription } = useSubscription();
  const navigate = useNavigate();
  
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <Layout>
      <div className="layout-container max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{user?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Account Type</p>
                  <p className="font-medium capitalize">{user?.role}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-medium">{formatDate(user?.createdAt || "")}</p>
                </div>
                
                <div className="pt-4">
                  <Button 
                    variant="destructive" 
                    onClick={logout}
                    className="w-full"
                  >
                    Log Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Details</CardTitle>
                <CardDescription>Manage your current subscription</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isSubscribed && currentPlan ? (
                  <>
                    <div className="p-4 border rounded-lg bg-green-50 border-green-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-green-800">Active Subscription</h3>
                          <p className="text-sm text-green-700">
                            You are currently subscribed to the {currentPlan.name} plan
                          </p>
                        </div>
                        <span className="text-xl font-bold text-green-700">${currentPlan.price}/mo</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Rate Limit</p>
                        <p className="font-medium">{currentPlan.requestsPerMinute} requests/minute</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Next Billing Cycle</p>
                        <p className="font-medium">Monthly</p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => navigate("/pricing")}
                        className="flex-1"
                      >
                        Change Plan
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => cancelSubscription()}
                        className="flex-1"
                      >
                        Cancel Subscription
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg bg-gray-50">
                      <h3 className="font-semibold">No Active Subscription</h3>
                      <p className="text-sm text-gray-600">
                        You don't have an active subscription. Subscribe to get access to our API endpoints.
                      </p>
                    </div>
                    
                    <Button
                      onClick={() => navigate("/pricing")}
                      className="w-full"
                    >
                      View Pricing Plans
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>API Access</CardTitle>
                <CardDescription>Your API credentials and usage</CardDescription>
              </CardHeader>
              <CardContent>
                {isSubscribed ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">API Key</p>
                      <div className="flex items-center mt-1">
                        <code className="bg-gray-100 px-3 py-1 rounded text-sm font-mono flex-1 overflow-x-auto">
                          {/* Generate a fake API key for display */}
                          fch_{Math.random().toString(36).substring(2, 15)}_{Math.random().toString(36).substring(2, 15)}
                        </code>
                        <Button variant="ghost" size="sm" className="ml-2">
                          Copy
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Keep your API key secure and never share it publicly
                      </p>
                    </div>
                    
                    <div className="pt-4">
                      <Button
                        variant="outline"
                        onClick={() => navigate("/documentation")}
                        className="w-full"
                      >
                        View API Documentation
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
                      <h3 className="font-semibold text-yellow-800">Subscription Required</h3>
                      <p className="text-sm text-yellow-700">
                        You need an active subscription to receive an API key and make API calls
                      </p>
                    </div>
                    
                    <Button
                      onClick={() => navigate("/pricing")}
                      className="w-full"
                    >
                      Subscribe Now
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
