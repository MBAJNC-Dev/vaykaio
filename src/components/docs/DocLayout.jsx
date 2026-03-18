
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Book, Code, Shield, PlayCircle, CheckSquare, HelpCircle, ChevronRight } from 'lucide-react';
import DocSearch from './DocSearch.jsx';
import { ScrollArea } from '@/components/ui/scroll-area';

const DocLayout = ({ children, title }) => {
  const location = useLocation();
  
  const navGroups = [
    {
      title: 'User Documentation',
      icon: Book,
      links: [
        { name: 'Getting Started', path: '/docs/getting-started' },
        { name: 'Feature Guides', path: '/docs/features' },
        { name: 'Best Practices', path: '/docs/best-practices' },
        { name: 'FAQ', path: '/docs/faq' },
      ]
    },
    {
      title: 'Developer Resources',
      icon: Code,
      links: [
        { name: 'API Reference', path: '/docs/developer' },
        { name: 'Webhooks', path: '/docs/developer/webhooks' },
        { name: 'SDKs & Tools', path: '/docs/developer/sdks' },
      ]
    },
    {
      title: 'Admin & Enterprise',
      icon: Shield,
      links: [
        { name: 'Admin Guide', path: '/docs/admin' },
        { name: 'Security & Compliance', path: '/docs/admin/security' },
      ]
    },
    {
      title: 'Learning Center',
      icon: PlayCircle,
      links: [
        { name: 'Interactive Onboarding', path: '/docs/onboarding' },
        { name: 'Video Tutorials', path: '/docs/tutorials' },
        { name: 'Help Center', path: '/help' },
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0 hidden md:block">
          <div className="sticky top-24 space-y-6">
            <DocSearch />
            
            <ScrollArea className="h-[calc(100vh-140px)] pr-4">
              <div className="space-y-8 pb-8">
                {navGroups.map((group, idx) => (
                  <div key={idx}>
                    <h4 className="font-semibold text-sm flex items-center gap-2 mb-3 text-foreground">
                      <group.icon className="w-4 h-4 text-primary" />
                      {group.title}
                    </h4>
                    <ul className="space-y-1.5 border-l border-border ml-2 pl-4">
                      {group.links.map((link) => {
                        const isActive = location.pathname === link.path;
                        return (
                          <li key={link.path}>
                            <Link 
                              to={link.path}
                              className={`text-sm block py-1 transition-colors ${
                                isActive 
                                  ? 'text-primary font-medium' 
                                  : 'text-muted-foreground hover:text-foreground'
                              }`}
                            >
                              {link.name}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {/* Mobile Search (visible only on small screens) */}
          <div className="md:hidden mb-6">
            <DocSearch />
          </div>

          {/* Breadcrumbs */}
          <div className="flex items-center text-sm text-muted-foreground mb-6">
            <Link to="/docs" className="hover:text-foreground transition-colors">Docs</Link>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="text-foreground font-medium">{title}</span>
          </div>

          <div className="bg-card border rounded-2xl p-6 md:p-10 shadow-sm">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DocLayout;
