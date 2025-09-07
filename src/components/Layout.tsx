import { ReactNode } from "react";
import { Navigation } from "./Navigation";
import { Breadcrumb } from "./Breadcrumb";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface LayoutProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

export function Layout({ children, breadcrumbs }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Breadcrumb items={breadcrumbs} />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}