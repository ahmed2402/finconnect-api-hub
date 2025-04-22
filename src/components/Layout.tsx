
import React, { useEffect, useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Moon, Sun } from "lucide-react";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isSubscribed, currentPlan } = useSubscription();
  const navigate = useNavigate();
  const location = useLocation();

  // DARK MODE STATE/PERSISTENCE
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return window.localStorage.getItem("theme") === "dark";
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      window.localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      window.localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  // Get initial of user's name for avatar
  const getInitials = () => {
    if (!user?.name) return "U";
    return user.name.charAt(0).toUpperCase();
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // Animate appearance
  useEffect(() => {
    const el = document.getElementById("main-anim-container");
    if (el) {
      el.classList.remove("opacity-0");
      el.classList.add("animate-fade-in");
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-background/80 to-secondary/25 transition-colors duration-500 dark:from-[#1A1F2C] dark:to-[#12131c]">
      <header className="border-b bg-white/80 dark:bg-[#161926]/80 backdrop-blur-md sticky top-0 z-30 transition-colors duration-300">
        <div className="layout-container flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-2xl font-bold text-fintech-blue flex items-center hover:scale-[1.07] transition-transform">
              <span className="bg-fintech-blue text-white px-2 py-1 rounded mr-2">Fin</span>
              Connect
            </Link>

            <nav className="hidden md:flex items-center space-x-4 ml-8">
              <Link 
                to="/" 
                className={`text-sm font-medium transition text-gray-600 hover:text-fintech-blue ${isActive('/') && "text-fintech-blue scale-105 font-semibold"}`}
              >
                Home
              </Link>
              <Link 
                to="/pricing" 
                className={`text-sm font-medium transition ${isActive('/pricing') ? 'text-fintech-blue scale-105 font-semibold' : 'text-gray-600 hover:text-fintech-blue'}`}
              >
                Pricing
              </Link>
              {isAuthenticated && isSubscribed && (
                <>
                  <Link 
                    to="/dashboard" 
                    className={`text-sm font-medium transition ${isActive('/dashboard') ? 'text-fintech-blue scale-105 font-semibold' : 'text-gray-600 hover:text-fintech-blue'}`}
                  >
                    Dashboard
                  </Link>

                  <Link 
                    to="/documentation" 
                    className={`text-sm font-medium transition ${isActive('/documentation') ? 'text-fintech-blue scale-105 font-semibold' : 'text-gray-600 hover:text-fintech-blue'}`}
                  >
                    API Docs
                  </Link>
                </>
              )}
              {user?.role === "admin" && (
                <Link 
                  to="/admin/dashboard" 
                  className={`text-sm font-medium transition ${isActive('/admin/dashboard') ? 'text-fintech-blue scale-105 font-semibold' : 'text-gray-600 hover:text-fintech-blue'}`}
                >
                  Admin
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {/* THEME TOGGLE */}
            <div className="flex items-center space-x-1">
              <Sun className={`w-5 h-5 transition-colors duration-300 ${isDark ? "text-gray-400" : "text-yellow-500"}`} />
              <Switch
                checked={isDark}
                onCheckedChange={() => setIsDark((v) => !v)}
                aria-label="Toggle dark mode"
                className="data-[state=checked]:bg-fintech-blue transition dark:bg-card"
              />
              <Moon className={`w-5 h-5 transition-colors duration-300 ${isDark ? "text-blue-300" : "text-gray-400"}`} />
            </div>
            {isAuthenticated ? (
              <>
                {isSubscribed && currentPlan && (
                  <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-fintech-green text-white animate-fade-in">
                    {currentPlan.name} Plan
                  </span>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full group">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-fintech-blue text-white group-hover:scale-110 transition-transform">
                          {getInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white dark:bg-[#23263a] shadow-lg z-50 border border-border animate-scale-in">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuLabel className="font-normal text-xs text-gray-500 dark:text-gray-300">
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

      {/* MAIN ANIM CONTAINER */}
      <main
        id="main-anim-container"
        className="flex-1 py-8 opacity-0 transition-all duration-700"
      >
        {children}
      </main>

      <footer className="bg-gray-50/90 dark:bg-[#171922] border-t py-8 transition-colors duration-300">
        <div className="layout-container">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="text-2xl font-bold text-fintech-blue flex items-center">
                <span className="bg-fintech-blue text-white px-2 py-1 rounded mr-2">Fin</span>
                Connect
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                The developer-friendly financial API hub
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100 mb-3">Product</h3>
                <ul className="space-y-2">
                  <li>
                    <Link to="/pricing" className="text-sm text-gray-600 hover:text-fintech-blue dark:text-gray-300 dark:hover:text-fintech-blue transition">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link to="/documentation" className="text-sm text-gray-600 hover:text-fintech-blue dark:text-gray-300 dark:hover:text-fintech-blue transition">
                      Documentation
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100 mb-3">Resources</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-sm text-gray-600 hover:text-fintech-blue dark:text-gray-300 dark:hover:text-fintech-blue transition">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-gray-600 hover:text-fintech-blue dark:text-gray-300 dark:hover:text-fintech-blue transition">
                      Support
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100 mb-3">Company</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-sm text-gray-600 hover:text-fintech-blue dark:text-gray-300 dark:hover:text-fintech-blue transition">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-gray-600 hover:text-fintech-blue dark:text-gray-300 dark:hover:text-fintech-blue transition">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-[#23263a]">
            <p className="text-sm text-gray-500 dark:text-gray-300 transition">
              &copy; {new Date().getFullYear()} FinConnect API Hub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

// Layout.tsx is now >230 lines. After reviewing, you should consider asking for a refactor into smaller, maintainable components for performance and simplicity.
