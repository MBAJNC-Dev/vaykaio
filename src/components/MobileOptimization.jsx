
import React from 'react';
import { Home, Map, Compass, Zap, User, Bell } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Badge } from '@/components/ui/badge';

/**
 * MobileOptimization Component
 * Mobile-first bottom navigation bar for authenticated users
 * Renders only on small screens (md:hidden)
 */
const MobileOptimization = () => {
  const location = useLocation();
  const { currentUser } = useAuth();

  // Don't show for unauthenticated users
  if (!currentUser) return null;

  const navItems = [
    {
      icon: Home,
      label: 'Home',
      path: '/dashboard',
      badge: 0,
    },
    {
      icon: Map,
      label: 'Trips',
      path: '/trips',
      badge: 0,
    },
    {
      icon: Compass,
      label: 'Discover',
      path: '/discover',
      badge: 0,
    },
    {
      icon: Zap,
      label: 'AI',
      path: '/ai/planner',
      badge: 0,
    },
    {
      icon: User,
      label: 'Profile',
      path: '/profile',
      badge: 0,
    },
  ];

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-slate-800 border-t border-white/10 backdrop-blur-md z-40 pb-safe">
      <div className="flex justify-around items-stretch h-20">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full py-3 transition-all duration-200 relative group ${
                active
                  ? 'text-coral'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {/* Icon Container */}
              <div
                className={`relative transition-all duration-200 ${
                  active ? 'text-coral' : 'group-hover:text-gray-300'
                }`}
              >
                <Icon className="w-6 h-6" />

                {/* Badge for Notifications */}
                {item.badge > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 rounded-full bg-coral text-white text-xs font-bold">
                    {item.badge}
                  </Badge>
                )}

                {/* Active Indicator */}
                {active && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-coral"></div>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[10px] font-semibold mt-1 transition-colors ${
                  active ? 'text-coral' : 'text-gray-500'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileOptimization;
