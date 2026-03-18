
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, Bell, Settings, LogOut, ShieldAlert, Menu } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';

/**
 * AdminHeader Component
 * Header with search, notifications, and admin user profile
 */
const AdminHeader = ({ onMenuClick }) => {
  const { adminUser, logout } = useAdmin();
  const location = useLocation();
  const [searchFocus, setSearchFocus] = useState(false);

  const notificationCount = 3; // This could come from a context/state

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-slate-800/80 backdrop-blur-md supports-[backdrop-filter]:bg-slate-800/60">
      <div className="flex h-16 items-center px-4 gap-4">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-gray-300 hover:text-white hover:bg-white/10"
          onClick={onMenuClick}
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* VaykAIo Branding */}
        <div className="flex-1 flex items-center gap-4">
          <h2 className="text-white font-bold text-lg hidden md:block">VaykAIo Admin</h2>

          {/* Search Bar */}
          <div className="hidden md:flex relative w-full max-w-md">
            <Search className={`absolute left-3 top-2.5 h-4 w-4 ${searchFocus ? 'text-coral' : 'text-gray-400'}`} />
            <Input
              type="search"
              placeholder="Search users, trips, bookings..."
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setSearchFocus(false)}
              className="w-full bg-white/5 pl-10 rounded-lg border border-white/10 text-white placeholder:text-gray-500 focus:bg-white/10 focus:border-coral/50 transition-colors"
            />
          </div>
        </div>

        {/* Right Section - Notifications & Profile */}
        <div className="flex items-center gap-3">
          {/* Notifications Bell */}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-gray-300 hover:text-coral hover:bg-white/5"
          >
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 rounded-full bg-coral text-white text-xs font-bold">
                {notificationCount}
              </Badge>
            )}
          </Button>

          {/* Admin User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 rounded-full p-0 hover:bg-white/5"
              >
                <Avatar className="h-10 w-10 border border-coral/20">
                  <AvatarImage
                    src={adminUser?.avatar ? pb.files.getUrl(adminUser, adminUser.avatar) : ''}
                    alt={adminUser?.name}
                  />
                  <AvatarFallback className="bg-coral/20 text-coral font-bold">
                    {adminUser?.name?.charAt(0)?.toUpperCase() || 'A'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56 bg-slate-800 border-white/10" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium text-white leading-none flex items-center gap-2">
                    {adminUser?.name}
                    <ShieldAlert className="w-3 h-3 text-coral" />
                  </p>
                  <p className="text-xs leading-none text-gray-400">{adminUser?.email}</p>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator className="bg-white/10" />

              <DropdownMenuItem asChild className="text-gray-300 focus:text-coral focus:bg-white/5">
                <Link to="/admin/settings" className="flex items-center cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="text-gray-300 focus:text-coral focus:bg-white/5">
                <Link to="/admin/activity-log" className="flex items-center cursor-pointer">
                  <ShieldAlert className="mr-2 h-4 w-4" />
                  Activity Log
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-white/10" />

              <DropdownMenuItem
                onClick={logout}
                className="text-red-400 focus:text-red-400 focus:bg-red-400/10 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
