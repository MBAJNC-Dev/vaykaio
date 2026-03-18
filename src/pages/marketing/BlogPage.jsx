import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Clock, ArrowRight } from 'lucide-react';
import * as SiteContentService from '@/services/SiteContentService.js';

const ITEMS_PER_PAGE = 6;

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [blogPosts, setBlogPosts] = useState([]);
  const [categories, setCategories] = useState(['all']);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Load blog posts
  useEffect(() => {
    const loadBlogPosts = async () => {
      try {
        setLoading(true);

        // Load featured post
        const featured = await SiteContentService.getBlogPosts({
          featured_only: true,
          limit: 1,
        });

        // Load all posts
        const allPosts = await SiteContentService.getBlogPosts({
          limit: 100,
          offset: 0,
        });

        if (allPosts && allPosts.length > 0) {
          setBlogPosts(allPosts);
          setTotalCount(allPosts.length);

          // Extract unique categories
          const uniqueCategories = ['all'];
          allPosts.forEach((post) => {
            if (post.category && !uniqueCategories.includes(post.category)) {
              uniqueCategories.push(post.category);
            }
          });
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error('Error loading blog posts:', error);
        setBlogPosts([]);
      } finally {
        setLoading(false);
      }
    };

    loadBlogPosts();
  }, []);

  // Filter and paginate posts
  const filteredPosts = selectedCategory === 'all'
    ? blogPosts
    : blogPosts.filter((post) => post.category === selectedCategory);

  const nonFeaturedPosts = filteredPosts.filter((post) => !post.is_featured);
  const featuredPost = blogPosts.find((post) => post.is_featured);

  const paginatedPosts = nonFeaturedPosts.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(nonFeaturedPosts.length / ITEMS_PER_PAGE);

  // Skeleton loader component
  const SkeletonCard = () => (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-br from-blue-100 to-purple-100 h-40 animate-pulse" />
      <CardHeader>
        <div className="h-4 bg-slate-200 rounded w-1/4 mb-3 animate-pulse" />
        <div className="h-5 bg-slate-200 rounded w-2/3 mb-2 animate-pulse" />
        <div className="h-4 bg-slate-200 rounded w-full animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          <div className="h-3 bg-slate-200 rounded w-1/3 animate-pulse" />
          <div className="h-3 bg-slate-200 rounded w-1/3 animate-pulse" />
        </div>
        <div className="h-9 bg-slate-200 rounded animate-pulse" />
      </CardContent>
    </Card>
  );

  return (
    <>
      <Helmet>
        <title>Blog - VaykAIo | Travel Tips & AI Insights</title>
        <meta name="description" content="Discover travel tips, AI insights, and product updates from the VaykAIo team and community." />
      </Helmet>

      <div className="space-y-12 pb-12">
        {/* Hero Section */}
        <div className="space-y-4 text-center pt-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">VaykAIo Blog</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover travel tips, AI insights, and product updates from the VaykAIo team and community.
          </p>
        </div>

        {/* Featured Post */}
        {loading ? (
          <Card className="border-2 border-primary/20 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 min-h-64 animate-pulse" />
              <CardContent className="pt-6 pb-6 pr-6 md:pr-0 space-y-4">
                <div className="h-4 bg-slate-200 rounded w-1/6 animate-pulse" />
                <div className="h-8 bg-slate-200 rounded w-full animate-pulse" />
                <div className="h-20 bg-slate-200 rounded animate-pulse" />
                <div className="space-y-2 pt-4">
                  <div className="h-3 bg-slate-200 rounded w-1/4 animate-pulse" />
                  <div className="h-3 bg-slate-200 rounded w-1/4 animate-pulse" />
                </div>
                <div className="h-10 bg-slate-200 rounded w-1/3 animate-pulse" />
              </CardContent>
            </div>
          </Card>
        ) : featuredPost ? (
          <Card className="border-2 border-primary/20 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center min-h-64">
                <div className="text-6xl opacity-50">📰</div>
              </div>
              <CardContent className="pt-6 pb-6 pr-6 md:pr-0 space-y-4">
                <Badge className="w-fit">{featuredPost.category || 'Featured'}</Badge>
                <h2 className="text-3xl font-bold">{featuredPost.title}</h2>
                <p className="text-muted-foreground text-lg">{featuredPost.excerpt}</p>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {featuredPost.author_name || 'VaykAIo Team'}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {featuredPost.created_at
                      ? new Date(featuredPost.created_at).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : 'Recent'}
                  </div>
                  {featuredPost.read_time_minutes && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {featuredPost.read_time_minutes} min read
                    </div>
                  )}
                </div>
                <Button className="mt-4">
                  Read Full Article <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </div>
          </Card>
        ) : null}

        {/* Category Filter */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Browse Articles</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  onClick={() => {
                    setSelectedCategory(category);
                    setCurrentPage(0);
                  }}
                  className="capitalize"
                >
                  {category === 'all' ? 'All Articles' : category}
                </Button>
              ))}
            </div>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : paginatedPosts.length > 0 ? (
              paginatedPosts.map((post) => (
                <Card
                  key={post.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
                >
                  <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 h-40 flex items-center justify-center">
                    <div className="text-6xl opacity-50">📖</div>
                  </div>
                  <CardHeader>
                    <Badge className="w-fit">{post.category || 'Article'}</Badge>
                    <CardTitle className="mt-3 line-clamp-2">{post.title}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-2">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between">
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {post.author_name || 'VaykAIo'}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {post.created_at
                          ? new Date(post.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })
                          : 'Recent'}
                      </div>
                      {post.read_time_minutes && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.read_time_minutes} min
                        </div>
                      )}
                    </div>
                    <Button variant="ghost" className="w-full justify-start">
                      Read More <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12 col-span-full">
                <p className="text-muted-foreground text-lg">
                  No articles found in this category. Check back soon!
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {currentPage > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </Button>
              )}

              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i ? 'default' : 'outline'}
                  onClick={() => setCurrentPage(i)}
                >
                  {i + 1}
                </Button>
              ))}

              {currentPage < totalPages - 1 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Newsletter Signup */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
          <CardContent className="pt-12 pb-12 text-center">
            <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
            <p className="mb-6 text-blue-100">
              Get our latest travel tips and AI insights delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg text-black"
              />
              <Button className="bg-white text-blue-600 hover:bg-gray-100">
                Subscribe
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default BlogPage;
