
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Plane, Menu, X, Bell, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext.jsx';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, currentUser, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { trackEvent } = useAnalytics();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleNavClick = (linkName) => {
    trackEvent('nav_click', { link: linkName });
  };

  const userInitial = currentUser?.name?.[0]?.toUpperCase() || currentUser?.email?.[0]?.toUpperCase() || 'V';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/95 backdrop-blur-md border-b border-border/50 shadow-sm py-3' : 'bg-transparent py-4 md:py-5'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" onClick={() => handleNavClick('logo')}>
            <div className={`p-2 rounded-lg transition-all ${isScrolled ? 'bg-primary/10 text-primary' : 'bg-primary/20 text-white'}`}>
              <Plane className="w-5 h-5" />
            </div>
            <span className={`font-bold text-xl tracking-tight transition-colors ${isScrolled ? 'text-foreground' : 'text-foreground md:text-white drop-shadow-sm'}`}>
              VaykAIo
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/features"
              className={`text-sm font-medium hover:text-primary transition-colors ${isScrolled ? 'text-muted-foreground' : 'text-white/90'}`}
              onClick={() => handleNavClick('features')}
            >
              Features
            </Link>
            <Link
              to="/pricing"
              className={`text-sm font-medium hover:text-primary transition-colors ${isScrolled ? 'text-muted-foreground' : 'text-white/90'}`}
              onClick={() => handleNavClick('pricing')}
            >
              Pricing
            </Link>
            <Link
              to="/about"
              className={`text-sm font-medium hover:text-primary transition-colors ${isScrolled ? 'text-muted-foreground' : 'text-white/90'}`}
              onClick={() => handleNavClick('about')}
            >
              About
            </Link>
            <Link
              to="/blog"
              className={`text-sm font-medium hover:text-primary transition-colors ${isScrolled ? 'text-muted-foreground' : 'text-white/90'}`}
              onClick={() => handleNavClick('blog')}
            >
              Blog
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/notifications" className={`p-2 rounded-lg transition-colors hover:bg-muted/50 relative ${isScrolled ? 'text-foreground' : 'text-white'}`}>
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
                </Link>
                <div className="flex items-center gap-3 pl-4 border-l border-border">
                  <Link to="/dashboard" className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">{userInitial}</AvatarFallback>
                    </Avatar>
                    <span className={`text-sm font-medium ${isScrolled ? 'text-foreground' : 'text-white'}`}>
                      {currentUser?.name?.split(' ')[0] || 'Dashboard'}
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={`p-2 rounded-lg transition-colors hover:bg-muted/50 ${isScrolled ? 'text-muted-foreground' : 'text-white/70'}`}
                    title="Log out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`text-sm font-medium hover:text-primary transition-colors ${isScrolled ? 'text-foreground' : 'text-white'}`}
                  onClick={() => handleNavClick('login')}
                >
                  Log in
                </Link>
                <Button className="rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground border-0" asChild onClick={() => handleNavClick('signup_header')}>
                  <Link to="/signup">Start Free</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className={`md:hidden p-2 rounded-lg transition-colors ${isScrolled ? 'text-foreground hover:bg-muted' : 'text-white hover:bg-white/10'}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border/50 shadow-lg py-4 px-4 space-y-2">
          <Link to="/features" className="block text-foreground font-medium p-3 hover:bg-muted rounded-lg transition-colors">Features</Link>
          <Link to="/pricing" className="block text-foreground font-medium p-3 hover:bg-muted rounded-lg transition-colors">Pricing</Link>
          <Link to="/about" className="block text-foreground font-medium p-3 hover:bg-muted rounded-lg transition-colors">About</Link>
          <Link to="/blog" className="block text-foreground font-medium p-3 hover:bg-muted rounded-lg transition-colors">Blog</Link>
          <div className="h-px bg-border my-2"></div>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="block text-foreground font-medium p-3 hover:bg-muted rounded-lg transition-colors">Dashboard</Link>
              <Link to="/trips" className="block text-foreground font-medium p-3 hover:bg-muted rounded-lg transition-colors">My Trips</Link>
              <Link to="/settings" className="block text-foreground font-medium p-3 hover:bg-muted rounded-lg transition-colors">Settings</Link>
              <button onClick={handleLogout} className="w-full text-left text-foreground font-medium p-3 hover:bg-muted rounded-lg transition-colors">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block text-foreground font-medium p-3 hover:bg-muted rounded-lg transition-colors">Log in</Link>
              <Button className="w-full rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
                <Link to="/signup">Start Free</Link>
              </Button>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
