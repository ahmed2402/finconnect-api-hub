
import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="layout-container">
        {/* Hero Section */}
        <div className="py-12 md:py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            The Developer-Friendly <span className="text-fintech-blue">Financial API</span> Hub
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
            Access powerful financial APIs to build the next generation of fintech applications
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => navigate("/register")}
              className="bg-fintech-blue hover:bg-fintech-blue/90 text-white font-medium py-6 px-8 rounded-lg"
            >
              Get Started
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/documentation")}
              className="border-fintech-blue text-fintech-blue hover:bg-fintech-blue/10 font-medium py-6 px-8 rounded-lg"
            >
              Explore APIs
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16 border-t">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose FinConnect
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-white shadow-sm">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-fintech-blue/10 text-fintech-blue mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Secure & Reliable
              </h3>
              <p className="text-gray-600">
                Enterprise-grade security with JWT authentication and role-based access control
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-white shadow-sm">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-fintech-green/10 text-fintech-green mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Lightning Fast
              </h3>
              <p className="text-gray-600">
                Low-latency APIs designed for high performance and real-time financial operations
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-white shadow-sm">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-fintech-blue/10 text-fintech-blue mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Comprehensive APIs
              </h3>
              <p className="text-gray-600">
                Everything you need to build powerful fintech applications in one place
              </p>
            </div>
          </div>
        </div>

        {/* API Preview Section */}
        <div className="py-16 border-t">
          <h2 className="text-3xl font-bold text-center mb-4">
            Our Financial APIs
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Explore our suite of financial APIs designed to power modern fintech applications
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="api-card">
              <div className="api-card-header">
                <h3 className="text-xl font-semibold">Balance API</h3>
              </div>
              <div className="api-card-content">
                <p className="text-gray-600 mb-4">
                  Retrieve real-time account balances with a simple API call
                </p>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-md text-sm font-mono overflow-x-auto">
                  <pre>GET /api/balance</pre>
                </div>
              </div>
            </div>

            <div className="api-card">
              <div className="api-card-header">
                <h3 className="text-xl font-semibold">Transfer API</h3>
              </div>
              <div className="api-card-content">
                <p className="text-gray-600 mb-4">
                  Transfer funds between accounts securely and instantly
                </p>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-md text-sm font-mono overflow-x-auto">
                  <pre>POST /api/transfer</pre>
                </div>
              </div>
            </div>

            <div className="api-card">
              <div className="api-card-header">
                <h3 className="text-xl font-semibold">Transactions API</h3>
              </div>
              <div className="api-card-content">
                <p className="text-gray-600 mb-4">
                  Access detailed transaction history with powerful filtering
                </p>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-md text-sm font-mono overflow-x-auto">
                  <pre>GET /api/transactions?page=1&pageSize=10</pre>
                </div>
              </div>
            </div>

            <div className="api-card">
              <div className="api-card-header">
                <h3 className="text-xl font-semibold">Invoice API</h3>
              </div>
              <div className="api-card-content">
                <p className="text-gray-600 mb-4">
                  Generate and download detailed invoice reports
                </p>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-md text-sm font-mono overflow-x-auto">
                  <pre>GET /api/invoice?start=2023-01-01&end=2023-01-31</pre>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Button 
              variant="outline" 
              onClick={() => navigate("/documentation")}
              className="border-fintech-blue text-fintech-blue hover:bg-fintech-blue/10"
            >
              View Full Documentation
            </Button>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16 border-t border-b">
          <div className="bg-fintech-blue text-white rounded-2xl p-8 md:p-12">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">
                Ready to get started?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of developers already building with FinConnect APIs
              </p>
              <Button 
                size="lg" 
                onClick={() => navigate("/register")}
                className="bg-white text-fintech-blue hover:bg-white/90 font-medium"
              >
                Create Free Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
