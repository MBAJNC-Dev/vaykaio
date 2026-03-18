import supabase from '@/lib/supabaseClient.js';

// In-memory cache for content
const cache = {
  siteContent: null,
  testimonials: null,
  subscriptionPlans: null,
  faqs: null,
  blogPosts: null,
  featureFlags: null,
  cacheTime: {},
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
};

/**
 * Get site content for a specific section as key-value object
 * @param {string} section - Section name (e.g., 'hero', 'problem', 'solution')
 * @returns {Promise<Object>} Object with key-value pairs
 */
export async function getSiteContent(section) {
  try {
    const isCached = cache.siteContent && cache.cacheTime.siteContent &&
      (Date.now() - cache.cacheTime.siteContent < cache.CACHE_DURATION);

    if (isCached) {
      const filtered = {};
      cache.siteContent.forEach(item => {
        if (item.section === section) {
          filtered[item.key] = item.value;
        }
      });
      return filtered;
    }

    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .eq('section', section);

    if (error) {
      console.error('Error fetching site content:', error);
      return {};
    }

    const result = {};
    data.forEach(item => {
      result[item.key] = item.value;
    });

    return result;
  } catch (err) {
    console.error('Exception in getSiteContent:', err);
    return {};
  }
}

/**
 * Get all site content grouped by section
 * @returns {Promise<Object>} Object grouped by section
 */
export async function getAllSiteContent() {
  try {
    const isCached = cache.siteContent && cache.cacheTime.siteContent &&
      (Date.now() - cache.cacheTime.siteContent < cache.CACHE_DURATION);

    if (isCached) {
      const grouped = {};
      cache.siteContent.forEach(item => {
        if (!grouped[item.section]) {
          grouped[item.section] = {};
        }
        grouped[item.section][item.key] = item.value;
      });
      return grouped;
    }

    const { data, error } = await supabase
      .from('site_content')
      .select('*');

    if (error) {
      console.error('Error fetching all site content:', error);
      return {};
    }

    cache.siteContent = data;
    cache.cacheTime.siteContent = Date.now();

    const grouped = {};
    data.forEach(item => {
      if (!grouped[item.section]) {
        grouped[item.section] = {};
      }
      grouped[item.section][item.key] = item.value;
    });

    return grouped;
  } catch (err) {
    console.error('Exception in getAllSiteContent:', err);
    return {};
  }
}

/**
 * Get testimonials from database
 * @param {boolean} featuredOnly - If true, only return featured testimonials
 * @returns {Promise<Array>} Array of testimonial objects
 */
export async function getTestimonials(featuredOnly = false) {
  try {
    const isCached = cache.testimonials && cache.cacheTime.testimonials &&
      (Date.now() - cache.cacheTime.testimonials < cache.CACHE_DURATION);

    if (isCached) {
      const data = cache.testimonials;
      return featuredOnly ? data.filter(t => t.is_featured) : data;
    }

    let query = supabase
      .from('testimonials')
      .select('*')
      .order('sort_order', { ascending: true });

    if (featuredOnly) {
      query = query.eq('is_featured', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching testimonials:', error);
      return [];
    }

    if (!featuredOnly) {
      cache.testimonials = data;
      cache.cacheTime.testimonials = Date.now();
    }

    return data || [];
  } catch (err) {
    console.error('Exception in getTestimonials:', err);
    return [];
  }
}

/**
 * Get subscription plans from database
 * @returns {Promise<Array>} Array of plan objects
 */
export async function getSubscriptionPlans() {
  try {
    const isCached = cache.subscriptionPlans && cache.cacheTime.subscriptionPlans &&
      (Date.now() - cache.cacheTime.subscriptionPlans < cache.CACHE_DURATION);

    if (isCached) {
      return cache.subscriptionPlans;
    }

    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .order('sort_order', { ascending: true, nullsFirst: false });

    if (error) {
      console.error('Error fetching subscription plans:', error);
      return [];
    }

    cache.subscriptionPlans = data || [];
    cache.cacheTime.subscriptionPlans = Date.now();

    return data || [];
  } catch (err) {
    console.error('Exception in getSubscriptionPlans:', err);
    return [];
  }
}

/**
 * Get FAQs from database
 * @param {string} category - Category filter (optional)
 * @returns {Promise<Array>} Array of FAQ objects
 */
export async function getFaqs(category = null) {
  try {
    const isCached = cache.faqs && cache.cacheTime.faqs &&
      (Date.now() - cache.cacheTime.faqs < cache.CACHE_DURATION);

    if (isCached) {
      const data = cache.faqs;
      return category ? data.filter(f => f.category === category) : data;
    }

    let query = supabase
      .from('faqs')
      .select('*')
      .order('sort_order', { ascending: true });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching FAQs:', error);
      return [];
    }

    if (!category) {
      cache.faqs = data;
      cache.cacheTime.faqs = Date.now();
    }

    return data || [];
  } catch (err) {
    console.error('Exception in getFaqs:', err);
    return [];
  }
}

/**
 * Get blog posts from database
 * @param {Object} options - Options object
 * @param {string} options.category - Category filter (optional)
 * @param {boolean} options.featured_only - Get only featured posts
 * @param {number} options.limit - Limit number of results (default: 10)
 * @param {number} options.offset - Offset for pagination (default: 0)
 * @returns {Promise<Array>} Array of blog post objects
 */
export async function getBlogPosts(options = {}) {
  try {
    const { category = null, featured_only = false, limit = 10, offset = 0 } = options;

    let query = supabase
      .from('blog_posts')
      .select('*')
      .eq('is_published', true)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (category) {
      query = query.eq('category', category);
    }

    if (featured_only) {
      query = query.eq('is_featured', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Exception in getBlogPosts:', err);
    return [];
  }
}

/**
 * Get a single blog post by slug
 * @param {string} slug - Blog post slug
 * @returns {Promise<Object|null>} Blog post object or null
 */
export async function getBlogPost(slug) {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (error) {
      console.error('Error fetching blog post:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Exception in getBlogPost:', err);
    return null;
  }
}

/**
 * Get all feature flags
 * @returns {Promise<Array>} Array of feature flag objects
 */
export async function getFeatureFlags() {
  try {
    const isCached = cache.featureFlags && cache.cacheTime.featureFlags &&
      (Date.now() - cache.cacheTime.featureFlags < cache.CACHE_DURATION);

    if (isCached) {
      return cache.featureFlags;
    }

    const { data, error } = await supabase
      .from('feature_flags')
      .select('*');

    if (error) {
      console.error('Error fetching feature flags:', error);
      return [];
    }

    cache.featureFlags = data || [];
    cache.cacheTime.featureFlags = Date.now();

    return data || [];
  } catch (err) {
    console.error('Exception in getFeatureFlags:', err);
    return [];
  }
}

/**
 * Check if a feature is enabled for a specific user plan
 * @param {string} flagName - Feature flag name
 * @param {string} userPlan - User subscription plan
 * @returns {Promise<boolean>} Whether feature is enabled
 */
export async function isFeatureEnabled(flagName, userPlan = 'free') {
  try {
    const flags = await getFeatureFlags();
    const flag = flags.find(f => f.name === flagName);

    if (!flag || !flag.is_enabled) {
      return false;
    }

    // Check rollout percentage
    if (flag.rollout_percentage < 100) {
      const randomValue = Math.random() * 100;
      if (randomValue > flag.rollout_percentage) {
        return false;
      }
    }

    // Check plan allowlist
    if (flag.allowed_plans && flag.allowed_plans.length > 0) {
      return flag.allowed_plans.includes(userPlan);
    }

    return true;
  } catch (err) {
    console.error('Exception in isFeatureEnabled:', err);
    return false;
  }
}

/**
 * Clear cache
 */
export function clearCache() {
  cache.siteContent = null;
  cache.testimonials = null;
  cache.subscriptionPlans = null;
  cache.faqs = null;
  cache.blogPosts = null;
  cache.featureFlags = null;
  cache.cacheTime = {};
}

export default {
  getSiteContent,
  getAllSiteContent,
  getTestimonials,
  getSubscriptionPlans,
  getFaqs,
  getBlogPosts,
  getBlogPost,
  getFeatureFlags,
  isFeatureEnabled,
  clearCache,
};
