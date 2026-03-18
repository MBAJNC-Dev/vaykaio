
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useNavigate } from 'react-router-dom';

const DocSearch = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Placeholder data - in a real app, this would query a search index (e.g., Algolia, Meilisearch, or PocketBase fulltext)
  const searchResults = [
    { id: 1, title: 'Getting Started Guide', path: '/docs/getting-started', category: 'User Docs' },
    { id: 2, title: 'API Authentication', path: '/docs/developer#auth', category: 'Developer Docs' },
    { id: 3, title: 'Managing Group Budgets', path: '/docs/features/budgets', category: 'Feature Guides' },
    { id: 4, title: 'Interactive Onboarding', path: '/docs/onboarding', category: 'Tutorials' },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-full max-w-md cursor-pointer">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search documentation..." 
            className="pl-9 bg-muted/50 border-muted-foreground/20 hover:bg-muted transition-colors"
            readOnly
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[400px]" align="start">
        <Command>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              {searchResults.map((result) => (
                <CommandItem
                  key={result.id}
                  onSelect={() => {
                    navigate(result.path);
                    setOpen(false);
                  }}
                  className="flex flex-col items-start py-2"
                >
                  <span className="font-medium">{result.title}</span>
                  <span className="text-xs text-muted-foreground">{result.category}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default DocSearch;
