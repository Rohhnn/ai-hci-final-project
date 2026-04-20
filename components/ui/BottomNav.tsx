"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, LayoutDashboard, ShoppingCart, Package, User, Leaf } from "lucide-react";
import { clsx } from "clsx";

const tabs = [
  { href: "/app", label: "Calendar", icon: CalendarDays },
  { href: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/grocery", label: "Grocery", icon: ShoppingCart },
  { href: "/app/pantry", label: "Pantry", icon: Package },
  { href: "/app/profile", label: "Profile", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 h-screen w-56 bg-surface border-r border-border flex flex-col z-50">
      <div className="px-6 py-6 flex items-center gap-2.5 border-b border-border">
        <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
          <Leaf size={16} className="text-white" />
        </div>
        <span className="font-fraunces text-lg font-semibold">MealSync</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                active
                  ? "bg-primary text-white"
                  : "text-muted hover:bg-surface-2 hover:text-[var(--text)]"
              )}
            >
              <Icon size={18} strokeWidth={active ? 2.5 : 1.8} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}