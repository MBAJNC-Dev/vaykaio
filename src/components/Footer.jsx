
import React from 'react';
import { Link } from 'react-router-dom';
import { Plane, Twitter, Github, Linkedin, Youtube, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="bg-foreground text-background pt-20 pb-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">

          {/* Brand & Newsletter Column */}
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="bg-primary/80 text-primary-foreground p-2 rounded-lg">
                <Plane className="w-6 h-6" />
              </div>
              <span className="font-bold text-2xl tracking-tight">VaykAIo</span>
            </Link>
            <p className="text-background/70 text-sm leading-relaxed mb-8 max-w-sm">
              Your AI Vacation Command Center. We handle the planning, coordination, and logistics so you can focus on creating memories.
            </p>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold tracking-wide uppercase text-background/90">Subscribe to our newsletter</h4>
              <div className="flex gap-2 max-w-sm">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-background/10 border-background/20 text-background placeholder:text-background/50 focus-visible:ring-primary rounded-lg"
                  aria-label="Email address for newsletter"
                />
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0 rounded-lg">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h4 className="font-semibold mb-6 text-background/90">Product</h4>
            <ul className="space-y-4 text-sm text-background/70">
              <li><Link to="/features" className="hover:text-primary transition-colors flex items-center gap-1 group">Features <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" /></Link></li>
              <li><Link to="/pricing" className="hover:text-primary transition-colors flex items-center gap-1 group">Pricing <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" /></Link></li>
              <li><Link to="/blog" className="hover:text-primary transition-colors flex items-center gap-1 group">Blog <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" /></Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors flex items-center gap-1 group">About <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" /></Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-semibold mb-6 text-background/90">Support</h4>
            <ul className="space-y-4 text-sm text-background/70">
              <li><Link to="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link to="/status" className="hover:text-primary transition-colors">Status Page</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-semibold mb-6 text-background/90">Company</h4>
            <ul className="space-y-4 text-sm text-background/70">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="/cookies" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-background/60">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p>© {new Date().getFullYear()} VaykAIo. All rights reserved.</p>
            <p className="text-xs">
              <Link to="/accessibility" className="hover:text-background underline underline-offset-4">Accessibility Statement</Link>
            </p>
          </div>

          <div className="flex items-center gap-5">
            <a href="#twitter" aria-label="Twitter" className="hover:text-primary transition-colors"><Twitter className="w-5 h-5" /></a>
            <a href="#linkedin" aria-label="LinkedIn" className="hover:text-primary transition-colors"><Linkedin className="w-5 h-5" /></a>
            <a href="#youtube" aria-label="YouTube" className="hover:text-primary transition-colors"><Youtube className="w-5 h-5" /></a>
            <a href="#github" aria-label="GitHub" className="hover:text-primary transition-colors"><Github className="w-5 h-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
