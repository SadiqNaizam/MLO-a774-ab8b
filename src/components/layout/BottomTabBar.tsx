import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Assuming react-router-dom for navigation
import { Home, Search, ListOrdered, UserCircle } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"; // Can use this or custom Buttons
import { cn } from '@/lib/utils';

interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/search', label: 'Search', icon: Search },
  { path: '/orders', label: 'Orders', icon: ListOrdered },
  { path: '/profile', label: 'Profile', icon: UserCircle },
];

interface BottomTabBarProps {
  className?: string;
}

const BottomTabBar: React.FC<BottomTabBarProps> = ({ className }) => {
  const location = useLocation();
  console.log("Rendering BottomTabBar, current path:", location.pathname);

  // Alternative using Buttons instead of ToggleGroup for more control
  return (
    <nav className={cn(
        "fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-top_sm_dark h-16 z-40",
        "flex items-center justify-around",
        className
    )}>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path || (item.path === '/' && location.pathname.startsWith('/home')); // Handle variations like /home
        return (
          <Link
            key={item.label}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center text-xs p-2 rounded-md w-1/4",
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <item.icon className={cn("h-5 w-5 mb-0.5", isActive ? "fill-primary/20" : "")} strokeWidth={isActive ? 2.5 : 2} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};
export default BottomTabBar;