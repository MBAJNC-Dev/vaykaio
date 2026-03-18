
import React, { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import {
  LayoutDashboard, Map, Compass, Heart, Zap, Bell, Settings,
  ChevronLeft, Menu, X, Calendar, Briefcase, DollarSign,
  Users, MessageSquare, Image, BookOpen, BarChart3, Lightbulb,
  CheckSquare, MapPin
} from 'lucide-react';

const Sidebar = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const { tripId } = useParams();
  const [isOpen, setIsOpen] = useState(false);

  // Global navigation - when NOT in trip context
  const globalLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Trips', path: '/trips', icon: Map },
    { name: 'Discovery', path: '/discover', icon: Compass },
    { name: 'Favorites', path: '/favorites', icon: Heart },
    { name: 'AI Planner', path: '/ai/planner', icon: Zap },
    { name: 'Notifications', path: '/notifications', icon: Bell, badge: 0 },
  ];

  // Trip context navigation - when tripId is present
  const tripNavSections = tripId ? [
    {
      title: 'Overview',
      items: [
        { name: 'Trip Overview', path: `/trips/${tripId}`, icon: MapPin },
      ]
    },
    {
      title: 'Planning',
      items: [
        { name: 'Itinerary', path: `/trips/${tripId}/itinerary`, icon: Calendar },
        { name: 'AI Builder', path: `/trips/${tripId}/itinerary/ai-builder`, icon: Lightbulb },
        { name: 'Discovery', path: `/trips/${tripId}/discovery`, icon: Compass },
      ]
    },
    {
      title: 'Logistics',
      items: [
        { name: 'Budget & Expenses', path: `/trips/${tripId}/budget`, icon: DollarSign },
        { name: 'Packing Checklist', path: `/trips/${tripId}/packing`, icon: Briefcase },
        { name: 'Booking Checklist', path: `/trips/${tripId}/booking-checklist`, icon: CheckSquare },
      ]
    },
    {
      title: 'Group',
      items: [
        { name: 'Members & Chat', path: `/trips/${tripId}/group`, icon: Users },
        { name: 'Split Expenses', path: `/trips/${tripId}/split-expenses`, icon: DollarSign },
      ]
    },
    {
      title: 'Memories',
      items: [
        { name: 'Photos & Albums', path: `/trips/${tripId}/albums`, icon: Image },
        { name: 'Journal', path: `/trips/${tripId}/journal`, icon: BookOpen },
      ]
    },
    {
      title: 'AI',
      items: [
        { name: 'AI Assistant', path: `/trips/${tripId}/ai-assistant`, icon: Zap },
        { name: 'Recommendations', path: `/ai/recommendations`, icon: Lightbulb },
      ]
    },
  ] : [];

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  const NavLink = ({ link }) => (
    <Link
      to={link.path}
      onClick={() => setIsOpen(false)}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group ${
        isActive(link.path)
          ? 'bg-coral/20 text-coral font-medium'
          : 'text-gray-400 hover:text-white hover:bg-white/5'
      }`}
    >
      <link.icon className="w-5 h-5 flex-shrink-0" />
      <span className="text-sm">{link.name}</span>
      {link.badge ? (
        <span className="ml-auto bg-coral text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {link.badge}
        </span>
      ) : null}
    </Link>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden fixed bottom-20 right-6 z-50 p-4 bg-coral text-white rounded-full shadow-lg active:scale-95 transition-transform"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Sidebar"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar Container */}
      <div
        className={`
          fixed inset-y-0 left-0 z-40 w-72 bg-gradient-to-b from-slate-900 to-slate-800 border-r border-white/10 transform transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
          md:translate-x-0 md:static md:h-[calc(100vh-4rem)] flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 custom-scrollbar">

          {/* Trip Context Navigation */}
          {tripId && (
            <div className="space-y-4">
              {/* Trip Header with Back Button */}
              <div className="px-2 py-3 border-b border-white/10">
                <Link
                  to="/trips"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 text-gray-300 hover:text-coral transition-colors text-sm font-medium mb-3"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back to My Trips
                </Link>
                <h2 className="text-white font-bold text-sm truncate">Trip Details</h2>
              </div>

              {/* Trip Navigation Sections */}
              {tripNavSections.map((section, idx) => (
                <div key={idx}>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">
                    {section.title}
                  </h3>
                  <div className="space-y-1">
                    {section.items.map(link => (
                      <NavLink key={link.path} link={link} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Global Navigation */}
          {!tripId && (
            <>
              {/* Logo/Branding */}
              <div className="px-2 py-2">
                <h1 className="text-white font-bold text-lg">VaykAIo</h1>
                <p className="text-gray-400 text-xs">Your AI Vacation OS</p>
              </div>

              {/* Main Navigation */}
              <div>
                <div className="space-y-1">
                  {globalLinks.map(link => (
                    <NavLink key={link.path} link={link} />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="border-t border-white/10 p-4 space-y-2">
          <Link
            to="/settings"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
              isActive('/settings')
                ? 'bg-coral/20 text-coral font-medium'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">Settings</span>
          </Link>
          {currentUser && (
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                isActive('/profile')
                  ? 'bg-coral/20 text-coral font-medium'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-coral/30 flex items-center justify-center text-xs font-bold text-coral flex-shrink-0">
                {currentUser.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="text-sm">Profile</span>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
