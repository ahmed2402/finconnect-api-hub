
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Subscription, Plan } from "../types";
import { useAuth } from "./AuthContext";
import { useToast } from "@/hooks/use-toast";

// Define available plans
export const PLANS: Plan[] = [
  {
    id: "basic",
    name: "Basic",
    price: 9.99,
    features: [
      "10 requests per minute",
      "Balance checking",
      "Transaction history",
      "Basic support"
    ],
    requestsPerMinute: 10
  },
  {
    id: "premium",
    name: "Premium",
    price: 29.99,
    features: [
      "50 requests per minute",
      "All Basic features",
      "Fund transfers",
      "Invoice generation",
      "Priority support"
    ],
    requestsPerMinute: 50
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 99.99,
    features: [
      "200 requests per minute",
      "All Premium features",
      "Custom branding",
      "Dedicated support",
      "API analytics"
    ],
    requestsPerMinute: 200
  }
];

interface SubscriptionContextType {
  subscription: Subscription | null;
  isSubscribed: boolean;
  isLoading: boolean;
  currentPlan: Plan | null;
  allPlans: Plan[];
  subscribe: (planId: string) => Promise<void>;
  cancelSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
};

interface SubscriptionProviderProps {
  children: ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ children }) => {
  const { user, token } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      // Check local storage for existing subscription
      const storedSubscription = localStorage.getItem("subscription");
      if (storedSubscription) {
        setSubscription(JSON.parse(storedSubscription));
      }
      setIsLoading(false);
    } else {
      setSubscription(null);
      setIsLoading(false);
    }
  }, [user]);

  const subscribe = async (planId: string) => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!user) {
        throw new Error("You must be logged in to subscribe");
      }
      
      // Create mock subscription
      const newSubscription: Subscription = {
        id: `sub-${Math.random().toString(36).substr(2, 9)}`,
        userId: user.id,
        planId,
        status: "active",
        startDate: new Date().toISOString(),
        endDate: null, // No end date for active subscriptions
      };
      
      setSubscription(newSubscription);
      localStorage.setItem("subscription", JSON.stringify(newSubscription));
      
      toast({
        title: "Subscription Activated",
        description: `You are now subscribed to the ${PLANS.find(p => p.id === planId)?.name} plan.`,
      });
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Subscription Failed",
        description: error.message || "Something went wrong",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelSubscription = async () => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!subscription) {
        throw new Error("No active subscription to cancel");
      }
      
      // Update subscription to cancelled
      const updatedSubscription: Subscription = {
        ...subscription,
        status: "cancelled",
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // End date 30 days from now
      };
      
      setSubscription(updatedSubscription);
      localStorage.setItem("subscription", JSON.stringify(updatedSubscription));
      
      toast({
        title: "Subscription Cancelled",
        description: "Your subscription has been cancelled. You will still have access until the end of your billing period.",
      });
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Cancellation Failed",
        description: error.message || "Something went wrong",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const currentPlan = subscription?.planId 
    ? PLANS.find(plan => plan.id === subscription.planId) || null 
    : null;

  const value = {
    subscription,
    isSubscribed: subscription?.status === "active",
    isLoading,
    currentPlan,
    allPlans: PLANS,
    subscribe,
    cancelSubscription,
  };

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
};
