
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isSubscribed, currentPlan } = useSubscription();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get initial of user's name for avatar
  const getInitials = () => {
    if (!user?.name) return "U";
    return user.name.charAt(0).toUpperCase();
  };
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white">
        <div className="layout-container flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-2xl font-bold text-fintech-blue flex items-center">
              <span className="bg-fintech-blue text-white px-2 py-1 rounded mr-2">Fin</span>
              Connect
            </Link>
            
            <nav className="hidden md:flex items-center space-x-4 ml-8">
              <Link 
                to="/" 
                className={`text-sm font-medium ${isActive('/') ? 'text-fintech-blue' : 'text-gray-600 hover:text-fintech-blue'}`}
              >
                Home
              </Link>
              
              <Link 
                to="/pricing" 
                className={`text-sm font-medium ${isActive('/pricing') ? 'text-fintech-blue' : 'text-gray-600 hover:text-fintech-blue'}`}
              >
                Pricing
              </Link>
              
              {isAuthenticated && isSubscribed && (
                <>
                  <Link 
                    to="/dashboard" 
                    className={`text-sm font-medium ${isActive('/dashboard') ? 'text-fintech-blue' : 'text-gray-600 hover:text-fintech-blue'}`}
                  >
                    Dashboard
                  </Link>
                  
                  <Link 
                    to="/documentation" 
                    className={`text-sm font-medium ${isActive('/documentation') ? 'text-fintech-blue' : 'text-gray-600 hover:text-fintech-blue'}`}
                  >
                    API Docs
                  </Link>
                </>
              )}
              
              {user?.role === "admin" && (
                <Link 
                  to="/admin/dashboard" 
                  className={`text-sm font-medium ${isActive('/admin/dashboard') ? 'text-fintech-blue' : 'text-gray-600 hover:text-fintech-blue'}`}
                >
                  Admin
                </Link>
              )}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {isSubscribed && currentPlan && (
                  <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-fintech-green text-white">
                    {currentPlan.name} Plan
                  </span>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-fintech-blue text-white">
                          {getInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuLabel className="font-normal text-xs text-gray-500">
                      {user?.email}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {isSubscribed && (
                      <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                        Dashboard
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      Profile
                    </DropdownMenuItem>
                    {user?.role === "admin" && (
                      <DropdownMenuItem onClick={() => navigate("/admin/dashboard")}>
                        Admin Dashboard
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate("/login")}>
                  Log in
                </Button>
                <Button onClick={() => navigate("/register")}>
                  Sign up
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
      
      <main className="flex-1 py-8">
        {children}
      </main>
      
      <footer className="bg-gray-50 border-t py-8">
        <div className="layout-container">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="text-2xl font-bold text-fintech-blue flex items-center">
                <span className="bg-fintech-blue text-white px-2 py-1 rounded mr-2">Fin</span>
                Connect
              </div>
              <p className="mt-2 text-sm text-gray-500">
                The developer-friendly financial API hub
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Product</h3>
                <ul className="space-y-2">
                  <li>
                    <Link to="/pricing" className="text-sm text-gray-600 hover:text-fintech-blue">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link to="/documentation" className="text-sm text-gray-600 hover:text-fintech-blue">
                      Documentation
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Resources</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-sm text-gray-600 hover:text-fintech-blue">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-gray-600 hover:text-fintech-blue">
                      Support
                    </a>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Company</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-sm text-gray-600 hover:text-fintech-blue">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-gray-600 hover:text-fintech-blue">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} FinConnect API Hub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
