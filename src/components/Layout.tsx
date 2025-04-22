import React from "react";
import { Navbar } from "./Navbar";
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
      <Navbar />
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
