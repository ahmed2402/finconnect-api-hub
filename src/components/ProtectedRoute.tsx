
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresSubscription?: boolean;
  requiresAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiresSubscription = false,
  requiresAdmin = false
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { isSubscribed, isLoading: isSubscriptionLoading } = useSubscription();
  const location = useLocation();

  if (isLoading || isSubscriptionLoading) {
    return <div className="layout-container flex items-center justify-center min-h-[60vh]">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiresAdmin && user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  if (requiresSubscription && !isSubscribed) {
    return <Navigate to="/pricing" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
