
import React from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";

const Documentation: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { isSubscribed } = useSubscription();
  
  // For demonstration, we're generating a fake API key
  const apiKey = "fch_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

  return (
    <Layout>
      <div className="layout-container">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">API Documentation</h1>
          <p className="text-gray-600 mb-8">
            Complete reference for the FinConnect API, with examples and implementation details
          </p>
          
          {isAuthenticated && isSubscribed ? (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg border">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Your API Key</h3>
                  <p className="text-xs text-gray-500 mb-2">Use this key to authenticate your API requests</p>
                </div>
                <div className="flex items-center space-x-2">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{apiKey}</code>
                  <button
                    onClick={() => navigator.clipboard.writeText(apiKey)}
                    className="text-fintech-blue hover:text-fintech-blue/80 text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-8 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <h3 className="text-sm font-semibold text-amber-800">Subscription Required</h3>
              <p className="text-xs text-amber-700">
                You need an active subscription to receive an API key and make API calls.
              </p>
            </div>
          )}
          
          <Tabs defaultValue="introduction">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="introduction">Introduction</TabsTrigger>
              <TabsTrigger value="authentication">Authentication</TabsTrigger>
              <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
              <TabsTrigger value="errors">Errors</TabsTrigger>
            </TabsList>
            
            <TabsContent value="introduction">
              <Card>
                <CardHeader>
                  <CardTitle>Introduction</CardTitle>
                  <CardDescription>
                    Getting started with the FinConnect API
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    The FinConnect API provides a suite of financial services for developers 
                    to integrate into their applications. Our RESTful API allows you to check 
                    account balances, transfer funds, view transaction history, and generate invoices.
                  </p>
                  
                  <h3 className="text-lg font-semibold mt-4">Base URL</h3>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-md text-sm font-mono overflow-x-auto">
                    <pre>https://api.finconnect.com/v1</pre>
                  </div>
                  
                  <h3 className="text-lg font-semibold mt-4">Content Type</h3>
                  <p>
                    All requests must use <code>application/json</code> content type when sending request bodies.
                    All response bodies will be returned as JSON.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="authentication">
              <Card>
                <CardHeader>
                  <CardTitle>Authentication</CardTitle>
                  <CardDescription>
                    How to authenticate your API requests
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    All API requests must include your API key in the Authorization header.
                  </p>
                  
                  <h3 className="text-lg font-semibold mt-4">Authorization Header</h3>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-md text-sm font-mono overflow-x-auto">
                    <pre>Authorization: Bearer YOUR_API_KEY</pre>
                  </div>
                  
                  <h3 className="text-lg font-semibold mt-4">Example Request</h3>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-md text-sm font-mono overflow-x-auto">
                    <pre>{`curl -X GET \\
  https://api.finconnect.com/v1/balance \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json"`}</pre>
                  </div>
                  
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-4">
                    <h4 className="text-blue-700 font-semibold">Security Note</h4>
                    <p className="text-blue-600 text-sm">
                      Always keep your API keys secure and never expose them in client-side code.
                      Use server-side code to make API requests that require authentication.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="endpoints">
              <Card>
                <CardHeader>
                  <CardTitle>API Endpoints</CardTitle>
                  <CardDescription>
                    Available endpoints and how to use them
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Balance Endpoint */}
                  <div>
                    <h3 className="text-xl font-semibold text-fintech-blue">Balance API</h3>
                    <div className="grid grid-cols-4 gap-4 mt-2">
                      <div className="col-span-1 font-semibold">Method</div>
                      <div className="col-span-3">GET</div>
                      
                      <div className="col-span-1 font-semibold">Endpoint</div>
                      <div className="col-span-3">/balance</div>
                      
                      <div className="col-span-1 font-semibold">Description</div>
                      <div className="col-span-3">Retrieve the current balance of the account</div>
                    </div>
                    
                    <h4 className="font-semibold mt-4">Response Example</h4>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-md text-sm font-mono overflow-x-auto mt-2">
                      <pre>{`{
  "balance": 1250.75,
  "lastUpdated": "2023-06-15T10:30:00Z"
}`}</pre>
                    </div>
                  </div>
                  
                  {/* Transfer Endpoint */}
                  <div className="pt-4 border-t">
                    <h3 className="text-xl font-semibold text-fintech-blue">Transfer API</h3>
                    <div className="grid grid-cols-4 gap-4 mt-2">
                      <div className="col-span-1 font-semibold">Method</div>
                      <div className="col-span-3">POST</div>
                      
                      <div className="col-span-1 font-semibold">Endpoint</div>
                      <div className="col-span-3">/transfer</div>
                      
                      <div className="col-span-1 font-semibold">Description</div>
                      <div className="col-span-3">Transfer funds between accounts</div>
                    </div>
                    
                    <h4 className="font-semibold mt-4">Request Example</h4>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-md text-sm font-mono overflow-x-auto mt-2">
                      <pre>{`{
  "sourceAccountId": "acc-123",
  "destinationAccountId": "acc-456",
  "amount": 100.50,
  "description": "Payment for services"
}`}</pre>
                    </div>
                    
                    <h4 className="font-semibold mt-4">Response Example</h4>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-md text-sm font-mono overflow-x-auto mt-2">
                      <pre>{`{
  "id": "tx-789",
  "sourceAccountId": "acc-123",
  "destinationAccountId": "acc-456",
  "amount": 100.50,
  "description": "Payment for services",
  "status": "completed",
  "createdAt": "2023-06-15T14:45:00Z"
}`}</pre>
                    </div>
                  </div>
                  
                  {/* Transactions Endpoint */}
                  <div className="pt-4 border-t">
                    <h3 className="text-xl font-semibold text-fintech-blue">Transactions API</h3>
                    <div className="grid grid-cols-4 gap-4 mt-2">
                      <div className="col-span-1 font-semibold">Method</div>
                      <div className="col-span-3">GET</div>
                      
                      <div className="col-span-1 font-semibold">Endpoint</div>
                      <div className="col-span-3">/transactions</div>
                      
                      <div className="col-span-1 font-semibold">Parameters</div>
                      <div className="col-span-3">
                        <code>page</code> (optional): Page number (default: 1)<br />
                        <code>pageSize</code> (optional): Items per page (default: 10)
                      </div>
                      
                      <div className="col-span-1 font-semibold">Description</div>
                      <div className="col-span-3">Retrieve transaction history with pagination</div>
                    </div>
                    
                    <h4 className="font-semibold mt-4">Response Example</h4>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-md text-sm font-mono overflow-x-auto mt-2">
                      <pre>{`{
  "transactions": [
    {
      "id": "tx-789",
      "sourceAccountId": "acc-123",
      "destinationAccountId": "acc-456",
      "amount": 100.50,
      "description": "Payment for services",
      "status": "completed",
      "createdAt": "2023-06-15T14:45:00Z"
    },
    // Additional transactions...
  ],
  "total": 42
}`}</pre>
                    </div>
                  </div>
                  
                  {/* Invoice Endpoint */}
                  <div className="pt-4 border-t">
                    <h3 className="text-xl font-semibold text-fintech-blue">Invoice API</h3>
                    <div className="grid grid-cols-4 gap-4 mt-2">
                      <div className="col-span-1 font-semibold">Method</div>
                      <div className="col-span-3">GET</div>
                      
                      <div className="col-span-1 font-semibold">Endpoint</div>
                      <div className="col-span-3">/invoice</div>
                      
                      <div className="col-span-1 font-semibold">Parameters</div>
                      <div className="col-span-3">
                        <code>start</code>: Start date (YYYY-MM-DD)<br />
                        <code>end</code>: End date (YYYY-MM-DD)
                      </div>
                      
                      <div className="col-span-1 font-semibold">Description</div>
                      <div className="col-span-3">Generate invoice for a specific date range</div>
                    </div>
                    
                    <h4 className="font-semibold mt-4">Response Example</h4>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-md text-sm font-mono overflow-x-auto mt-2">
                      <pre>{`{
  "startDate": "2023-06-01",
  "endDate": "2023-06-30",
  "transactionCount": 15,
  "totalAmount": 1542.75,
  "downloadUrl": "https://api.finconnect.com/v1/invoice/download?id=inv-123"
}`}</pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="errors">
              <Card>
                <CardHeader>
                  <CardTitle>Error Handling</CardTitle>
                  <CardDescription>
                    Understanding API error responses
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    The FinConnect API uses conventional HTTP response codes to indicate the 
                    success or failure of an API request. In general, codes in the 2xx range 
                    indicate success, codes in the 4xx range indicate an error that failed 
                    given the information provided, and codes in the 5xx range indicate an 
                    error with our servers.
                  </p>
                  
                  <h3 className="text-lg font-semibold mt-4">Error Response Format</h3>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-md text-sm font-mono overflow-x-auto">
                    <pre>{`{
  "error": {
    "code": "invalid_request",
    "message": "The provided account ID is invalid",
    "status": 400
  }
}`}</pre>
                  </div>
                  
                  <h3 className="text-lg font-semibold mt-4">Common Error Codes</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status Code
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Error Code
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">400</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">invalid_request</td>
                          <td className="px-6 py-4 text-sm text-gray-500">The request was unacceptable, often due to missing parameters</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">401</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">unauthorized</td>
                          <td className="px-6 py-4 text-sm text-gray-500">No valid API key provided</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">403</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">forbidden</td>
                          <td className="px-6 py-4 text-sm text-gray-500">The API key doesn't have permissions</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">404</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">not_found</td>
                          <td className="px-6 py-4 text-sm text-gray-500">The requested resource doesn't exist</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">429</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">rate_limited</td>
                          <td className="px-6 py-4 text-sm text-gray-500">Too many requests hit the API too quickly</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Documentation;
