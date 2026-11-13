import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const location = useLocation();
  
  // Generate breadcrumbs from the current path if no items provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];
    
    pathSegments.forEach((segment, index) => {
      const href = "/" + pathSegments.slice(0, index + 1).join("/");
      
      // Map route segments to readable labels
      let label = segment;
      switch (segment) {
        case "dashboard":
          label = "Dashboard";
          break;
        case "study-activities":
          label = "Study Activities";
          break;
        case "words":
          label = "Words";
          break;
        case "groups":
          label = "Word Groups";
          break;
        case "sessions":
          label = "Sessions";
          break;
        case "settings":
          label = "Settings";
          break;
        default:
          // For IDs, keep as is for now
          label = segment;
      }
      
      breadcrumbs.push({
        label,
        href: index < pathSegments.length - 1 ? href : undefined, // Last item has no href
      });
    });
    
    return breadcrumbs;
  };
  
  const breadcrumbItems = items || generateBreadcrumbs();
  
  if (breadcrumbItems.length === 0) return null;
  
  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground px-4 py-3 bg-muted/30">
      {breadcrumbItems.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
          {item.href ? (
            <Link
              to={item.href}
              className="hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
