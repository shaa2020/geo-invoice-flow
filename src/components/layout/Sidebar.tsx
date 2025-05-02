
import { useState } from "react";
import { 
  Home, 
  Users, 
  ShoppingBag, 
  FileText, 
  CreditCard, 
  BarChart3, 
  Settings, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    title: "Customers",
    href: "/customers",
    icon: Users,
  },
  {
    title: "Products",
    href: "/products",
    icon: ShoppingBag,
  },
  {
    title: "Invoices",
    href: "/invoices",
    icon: FileText,
  },
  {
    title: "Payments",
    href: "/payments",
    icon: CreditCard,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  }
];

export const Sidebar = ({ open, setOpen }: SidebarProps) => {
  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out",
        open ? "w-64" : "w-20"
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b">
        <div className={cn("flex items-center", !open && "justify-center w-full")}>
          {open && (
            <span className="text-xl font-semibold text-primary">Geo Fashion</span>
          )}
          {!open && (
            <span className="text-xl font-semibold text-primary">GF</span>
          )}
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          {open ? (
            <ChevronLeft className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center p-2 rounded-lg",
                    "hover:bg-gray-100 transition-all duration-200",
                    isActive ? "bg-primary/10 text-primary" : "text-gray-700",
                    !open && "justify-center"
                  )
                }
              >
                <item.icon className={cn("w-5 h-5", open ? "mr-3" : "mr-0")} />
                {open && <span>{item.title}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
