import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, MessageCircle, MapPin, Phone, Clock, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Message sent! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email',
      description: 'Send us an email anytime',
      contact: 'support@vaykaio.com',
      details: 'Response time: 2-4 hours',
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our team',
      contact: 'Available now',
      details: 'Mon-Fri 10am-6pm ET',
    },
    {
      icon: Phone,
      title: 'Phone',
      description: 'Call our support line',
      contact: '+1 (555) 123-4567',
      details: 'Mon-Fri 10am-6pm ET',
    },
  ];

  const offices = [
    {
      location: 'San Francisco, CA',
      address: '123 Tech Street, Floor 5',
      hours: 'Mon-Fri 9am-6pm PT',
      icon: '🌉',
    },
    {
      location: 'New York, NY',
      address: '456 Park Avenue, Suite 200',
      hours: 'Mon-Fri 9am-6pm ET',
      icon: '🗽',
    },
    {
      location: 'London, UK',
      address: '789 Thames Street, Floor 3',
      hours: 'Mon-Fri 9am-6pm GMT',
      icon: '🇬🇧',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Contact Us - VaykAIo</title>
        <meta name="description" content="Get in touch with the VaykAIo team. We're here to help." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

          {/* Hero */}
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Get in Touch</h1>
            <p className="text-xl text-muted-foreground">
              Have a question about VaykAIo? Want to explore enterprise options? We're here to help.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Contact Form */}
            <div className="space-y-6">
              <Card className="border-border/50 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle>Send us a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="h-11 rounded-lg"
                        placeholder="Your name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="h-11 rounded-lg"
                        placeholder="your@email.com"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="h-11 rounded-lg"
                        placeholder="What is this about?"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full h-32 px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        placeholder="Tell us what's on your mind..."
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      size="lg"
                      className="w-full rounded-lg"
                    >
                      {loading ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <div className="text-sm text-muted-foreground text-center">
                <p>We typically respond within 2-4 hours during business hours.</p>
              </div>
            </div>

            {/* Contact Methods & Info */}
            <div className="space-y-6">
              {/* Contact Methods */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Other Ways to Reach Us</h2>
                {contactMethods.map((method, idx) => (
                  <Card key={idx} className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        <div className="p-3 rounded-lg bg-primary/10 text-primary h-fit">
                          <method.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{method.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{method.description}</p>
                          <p className="font-medium text-sm">{method.contact}</p>
                          <p className="text-xs text-muted-foreground mt-1">{method.details}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick Links */}
              <Card className="border-border/50 shadow-sm bg-muted/30">
                <CardContent className="pt-6 space-y-3">
                  <div className="flex items-center justify-between group cursor-pointer hover:text-primary transition-colors">
                    <span className="font-medium">Help Center & FAQ</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="flex items-center justify-between group cursor-pointer hover:text-primary transition-colors">
                    <span className="font-medium">Documentation</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="flex items-center justify-between group cursor-pointer hover:text-primary transition-colors">
                    <span className="font-medium">Status Page</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Offices */}
          <div className="space-y-8 border-t pt-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Our Offices</h2>
              <p className="text-muted-foreground">Visit us in person or reach out to our regional teams</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {offices.map((office, idx) => (
                <Card key={idx} className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="pt-8 space-y-4">
                    <div className="text-4xl">{office.icon}</div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{office.location}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{office.address}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {office.hours}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* FAQ CTA */}
          <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20 p-12 text-center space-y-6">
            <h2 className="text-3xl font-bold">Didn't find your answer?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Check out our comprehensive FAQ section for answers to common questions.
            </p>
            <Button size="lg" className="rounded-lg">Read FAQ</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
