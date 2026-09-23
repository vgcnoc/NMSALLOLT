import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { LayoutDashboard, Server, Wifi, Router, AlertTriangle, MapPin, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { title: 'Dashboard', href: '/', icon: LayoutDashboard },
  { title: 'Devices', href: '/devices', icon: Server },
  { title: 'OLTs', href: '/olts', icon: Router },
  { title: 'ONTs', href: '/onus', icon: Wifi },
  { title: 'Alarms', href: '/alarms', icon: AlertTriangle },
  { title: 'POPs', href: '/pops', icon: MapPin },
  { title: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={cn("relative flex flex-col border-r bg-card transition-all duration-300", collapsed ? "w-16" : "w-64")}>
      <div className="flex h-14 items-center justify-between border-b px-4">
        {!collapsed && <span className="font-bold">ISP NMS</span>}
        <Button variant="ghost" size="icon" className="h-8 w-8 ml-auto" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <NavLink to={item.href} className={({ isActive }) => cn("flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground", isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground", collapsed && "justify-center px-0")}>
                <item.icon className={cn("h-5 w-5", !collapsed && "mr-3")} />
                {!collapsed && <span>{item.title}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
