import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  FolderOpen,
  Clock,
  Settings,
  Users,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/auth/AuthContext";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Study Activities",
    href: "/study-activities",
    icon: GraduationCap,
  },
  {
    name: "Words",
    href: "/words",
    icon: BookOpen,
  },
  {
    name: "Word Groups",
    href: "/groups",
    icon: FolderOpen,
  },
  {
    name: "Sessions",
    href: "/sessions",
    icon: Clock,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try { await signOut(); }
    finally { navigate("/login", { replace: true }); }
  };

  return (
    <nav className="border-b border-nav-border bg-nav-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center space-x-8">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-chinese-accent">
                中文学习 Chinese Learning
              </h1>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.startsWith(item.href);
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors rounded-md",
                      isActive
                        ? "bg-nav-active text-primary-foreground"
                        : "text-foreground hover:bg-nav-hover hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
              {user?.role === "admin" && (
                <Link to="/admin/users" className={cn("flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md", location.pathname.startsWith("/admin") ? "bg-nav-active text-primary-foreground" : "text-foreground hover:bg-nav-hover")}>
                  <Users className="h-4 w-4" />Accounts
                </Link>
              )}
            </div>
          </div>
          <div className="ml-auto hidden md:flex items-center gap-3 text-sm">
            <span className="text-muted-foreground">{user?.displayName}</span>
            <button type="button" onClick={handleSignOut} className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-nav-hover" title="Sign out">
              <LogOut className="h-4 w-4" />Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
