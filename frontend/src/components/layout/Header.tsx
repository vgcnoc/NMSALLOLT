import { Bell, Search, Sun, User } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/stores/auth.store';

export default function Header() {
  return (
    <header className="h-14 border-b bg-card flex items-center justify-between px-6 shrink-0">
      <div className="font-semibold text-sm">Dashboard</div>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search (Ctrl+K)"
            className="h-9 w-64 rounded-md border bg-muted/50 pl-9 pr-4 text-sm outline-none focus:border-primary"
          />
        </div>
        
        <button className="relative p-2 text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive"></span>
        </button>
        
        <button className="p-2 text-muted-foreground hover:text-foreground">
          <Sun className="h-5 w-5" />
        </button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold hover:bg-primary/30 transition-colors">
              <User className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => {
              useAuthStore.getState().logout();
            }}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
