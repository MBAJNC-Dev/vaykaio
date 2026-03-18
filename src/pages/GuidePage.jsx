
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, User, Calendar, ArrowLeft, Share2, Copy } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { format } from 'date-fns';
import { toast } from 'sonner';

const GuidePage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const record = await pb.collection('blog_posts').getOne(id, { $autoCancel: false });
      setPost(record);
    } catch (error) {
      console.error('Failed to load post', error);
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container mx-auto px-4 py-20 max-w-3xl">
          <Skeleton className="h-12 w-3/4 mb-6" />
          <Skeleton className="h-6 w-1/2 mb-12" />
          <Skeleton className="h-96 w-full mb-12 rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container mx-auto px-4 py-32 text-center flex-1">
          <h1 className="text-3xl font-bold mb-4">Guide not found</h1>
          <Button asChild><Link to="/blog">Back to all guides</Link></Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${post.title} - VaykAIo`}</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <article className="py-16 bg-background flex-1">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <Link to="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to all guides
            </Link>

            <div className="mb-8">
              <Badge className="mb-4 capitalize">{post.category?.replace('-', ' ')}</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-balance" style={{letterSpacing: '-0.02em'}}>
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-y py-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium text-foreground">{post.author || 'VaykAIo Team'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{format(new Date(post.created), 'MMMM d, yyyy')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{post.read_time || 5} min read</span>
                </div>
                <div className="ml-auto flex gap-2">
                  <Button variant="ghost" size="sm" onClick={copyLink}><Copy className="w-4 h-4 mr-2"/> Copy Link</Button>
                </div>
              </div>
            </div>

            {post.featured_image && (
              <div className="mb-12 rounded-2xl overflow-hidden shadow-lg">
                <img 
                  src={pb.files.getUrl(post, post.featured_image)} 
                  alt={post.title} 
                  className="w-full h-auto max-h-[500px] object-cover"
                />
              </div>
            )}

            <div className="prose prose-lg dark:prose-invert max-w-none">
              {/* In a real app, this would render markdown or rich text. For now, we render the text content. */}
              <div className="whitespace-pre-wrap leading-relaxed text-foreground/90">
                {post.content || post.excerpt || 'No content available.'}
              </div>
            </div>
          </div>
        </article>

        <Footer />
      </div>
    </>
  );
};

export default GuidePage;
