
import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription, PLANS } from "@/contexts/SubscriptionContext";

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { subscribe, isSubscribed, currentPlan, cancelSubscription, isLoading } = useSubscription();
  
  const handleSubscribe = async (planId: string) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/pricing" } });
      return;
    }
    
    try {
      await subscribe(planId);
      navigate("/dashboard");
    } catch (error) {
      console.error("Subscription error:", error);
    }
  };
  
  const handleCancelSubscription = async () => {
    try {
      await cancelSubscription();
    } catch (error) {
      console.error("Cancellation error:", error);
    }
  };

  return (
    <Layout>
      <div className="layout-container py-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600">
            Choose the plan that fits your needs. Upgrade or downgrade anytime.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {PLANS.map((plan) => {
            const isCurrentPlan = currentPlan?.id === plan.id;
            
            return (
              <Card 
                key={plan.id} 
                className={`
                  flex flex-col border-2 
                  ${isCurrentPlan ? 'border-fintech-green shadow-lg' : 'border-gray-200'}
                `}
              >
                {isCurrentPlan && (
                  <div className="bg-fintech-green text-white text-center py-1 text-sm font-medium">
                    Your Current Plan
                  </div>
                )}
                
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>
                    {plan.requestsPerMinute} requests per minute
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">${plan.price}</span>
                    <span className="text-gray-500 ml-1">/month</span>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-grow">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckIcon className="h-5 w-5 text-fintech-green shrink-0 mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                
                <CardFooter>
                  {isSubscribed ? (
                    isCurrentPlan ? (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleCancelSubscription}
                        disabled={isLoading}
                      >
                        {isLoading ? "Processing..." : "Cancel Plan"}
                      </Button>
                    ) : (
                      <Button
                        className="w-full"
                        onClick={() => handleSubscribe(plan.id)}
                        disabled={isLoading}
                      >
                        {isLoading ? "Processing..." : "Switch to This Plan"}
                      </Button>
                    )
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={isLoading}
                    >
                      {isLoading ? "Processing..." : "Subscribe"}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
        
        <div className="mt-16 text-center border-t pt-16">
          <h2 className="text-2xl font-bold mb-4">Need a custom plan?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Contact us for custom enterprise solutions with higher rate limits and dedicated support
          </p>
          <Button variant="outline">Contact Sales</Button>
        </div>
      </div>
    </Layout>
  );
};

export default Pricing;
