import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <div className="relative w-full max-w-sm">
      <div className="relative flex items-center">
        <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          type="search" 
          placeholder="Search devices, ONTs, POPs... (Ctrl+K)" 
          className="w-full rounded-md bg-background pl-8 focus-visible:ring-1 sm:w-[300px]"
          onClick={() => setOpen(true)}
        />
      </div>
      {open && (
        <div className="absolute top-12 left-0 w-full rounded-md border bg-popover text-popover-foreground shadow-md z-50 p-2">
          <Input autoFocus placeholder="Type to search..." value={query} onChange={e => setQuery(e.target.value)} className="mb-2" />
          <div className="max-h-[300px] overflow-y-auto text-sm p-2 text-center text-muted-foreground">
            {query ? 'Mock search results for: ' + query : 'Start typing to search'}
          </div>
        </div>
      )}
    </div>
  );
}