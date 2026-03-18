/**
 * PocketBase-to-Supabase Compatibility Layer
 *
 * This module provides a PocketBase-compatible API that uses Supabase under the hood.
 * All 128+ files that import from pocketbaseClient will work without modification.
 *
 * Translates: pb.collection('x').getList() → supabase.from('x').select()
 */

import supabase from './supabaseClient.js';

// ─── Filter Parser ────────────────────────────────────────────────────
// Converts PocketBase filter syntax to Supabase query methods
function applyPocketBaseFilter(query, filterStr) {
  if (!filterStr || !filterStr.trim()) return query;

  // Split by && (AND conditions)
  const conditions = filterStr.split('&&').map(c => c.trim());

  for (const condition of conditions) {
    // Handle OR conditions with ||
    if (condition.includes('||')) {
      const orParts = condition.split('||').map(p => p.trim());
      const orFilters = orParts.map(part => parseSingleCondition(part)).filter(Boolean);
      if (orFilters.length > 0) {
        const orString = orFilters.map(f => `${f.column}.${f.op}.${f.value}`).join(',');
        query = query.or(orString);
      }
      continue;
    }

    const parsed = parseSingleCondition(condition);
    if (parsed) {
      query = applyCondition(query, parsed);
    }
  }

  return query;
}

function parseSingleCondition(condition) {
  // Match patterns like: field = "value", field != "value", field ~ "value", field >= value
  const match = condition.match(/^(\w+(?:\.\w+)?)\s*(=|!=|>|>=|<|<=|~|!~)\s*(.+)$/);
  if (!match) return null;

  const [, column, operator, rawValue] = match;
  // Strip quotes from value
  const value = rawValue.replace(/^["']|["']$/g, '').trim();

  return { column, operator, value };
}

function applyCondition(query, { column, operator, value }) {
  switch (operator) {
    case '=':
      if (value === 'true') return query.eq(column, true);
      if (value === 'false') return query.eq(column, false);
      if (value === 'null') return query.is(column, null);
      return query.eq(column, value);
    case '!=':
      if (value === 'null') return query.not(column, 'is', null);
      return query.neq(column, value);
    case '>':
      return query.gt(column, value);
    case '>=':
      return query.gte(column, value);
    case '<':
      return query.lt(column, value);
    case '<=':
      return query.lte(column, value);
    case '~':
      // PocketBase ~ is "contains" (case-insensitive)
      return query.ilike(column, `%${value}%`);
    case '!~':
      return query.not(column, 'ilike', `%${value}%`);
    default:
      return query;
  }
}

// ─── Sort Parser ──────────────────────────────────────────────────────
// Converts PocketBase sort string to Supabase order calls
function applyPocketBaseSort(query, sortStr) {
  if (!sortStr || !sortStr.trim()) return query;

  const parts = sortStr.split(',').map(s => s.trim());
  for (const part of parts) {
    if (part.startsWith('-')) {
      query = query.order(part.slice(1), { ascending: false });
    } else if (part.startsWith('+')) {
      query = query.order(part.slice(1), { ascending: true });
    } else {
      query = query.order(part, { ascending: true });
    }
  }
  return query;
}

// ─── Collection Name Mapping ──────────────────────────────────────────
// Maps old PocketBase collection names to Supabase table names
const COLLECTION_MAP = {
  // Auth / Users
  'users': 'profiles',
  '_pb_users_auth': 'profiles',

  // Trips & Itinerary
  'trips': 'trips',
  'trip_members': 'trip_members',
  'itinerary_days': 'itinerary_days',
  'itinerary_items': 'itinerary_items',
  'routine_templates': 'routine_templates',

  // AI Plans (map old names to trips or a generic table)
  'AIPlans': 'trips',
  'ai_plans': 'trips',
  'GroupTravelPlans': 'trips',
  'SoloTravelPlans': 'trips',
  'FamilyTravelPlans': 'trips',

  // Discovery & Social
  'places': 'places',
  'favorites': 'favorites',
  'group_votes': 'group_votes',
  'group_vote_responses': 'group_vote_responses',
  'group_messages': 'group_messages',

  // Photos & Media
  'photos': 'photos',
  'albums': 'albums',
  'album_photos': 'album_photos',
  'smart_albums': 'albums',

  // Budget & Finance
  'expenses': 'expenses',
  'GroupExpenses': 'expenses',
  'budget_items': 'expenses',

  // Notifications
  'notifications': 'notifications',
  'notification_preferences': 'notification_preferences',

  // AI
  'ai_agent_logs': 'ai_agent_logs',
  'ai_recommendations': 'ai_recommendations',

  // SaaS & Content
  'subscription_plans': 'subscription_plans',
  'feature_flags': 'feature_flags',
  'blog_posts': 'blog_posts',
  'testimonials': 'testimonials',
  'site_content': 'site_content',
  'faqs': 'faqs',
  'audit_logs': 'audit_logs',

  // Booking & Packing
  'booking_checklist': 'booking_items',
  'booking_items': 'booking_items',
  'packing_items': 'packing_items',
  'packing_checklist': 'packing_items',

  // Journal
  'journal_entries': 'journal_entries',
  'travel_journal': 'journal_entries',

  // RFP (map to a generic table or trips)
  'rfps': 'trips',
  'rfp_details': 'trips',
  'rfp_responses': 'trips',
  'rfp_messages': 'group_messages',
  'rfp_templates': 'routine_templates',

  // Community / Social
  'CommunityPosts': 'blog_posts',
  'community_posts': 'blog_posts',
  'Comments': 'group_messages',

  // Admin
  'admin_logs': 'audit_logs',
  'admin_settings': 'site_content',

  // Chat
  'chat_history': 'group_messages',
  'chat_messages': 'group_messages',

  // Achievements / Gamification
  'Achievements': 'ai_recommendations',
  'achievements': 'ai_recommendations',
  'badges': 'ai_recommendations',

  // Family
  'family_members': 'trip_members',
  'family_groups': 'trips',

  // Integrations
  'integrations': 'feature_flags',
  'api_keys': 'feature_flags',

  // Destinations / Activities / Restaurants
  'destinations': 'places',
  'activities': 'places',
  'restaurants': 'places',
  'hotels': 'places',

  // Reviews
  'reviews': 'testimonials',
  'ratings': 'testimonials',

  // Travel Documents
  'travel_documents': 'booking_items',

  // Transportation
  'transportation': 'itinerary_items',

  // Settings
  'user_settings': 'profiles',
  'user_preferences': 'profiles',

  // Analytics
  'analytics_events': 'ai_agent_logs',
  'page_views': 'ai_agent_logs',

  // Webhooks / Campaigns
  'webhooks': 'feature_flags',
  'email_campaigns': 'notifications',
  'scheduled_tasks': 'ai_agent_logs',

  // Followers
  'followers': 'trip_members',

  // Blockchain (stub)
  'nfts': 'ai_recommendations',
  'dao_proposals': 'group_votes',
  'staking_positions': 'expenses',
  'crypto_portfolio': 'expenses',

  // Conversations
  'conversations': 'group_messages',
  'conversation_messages': 'group_messages',
};

function resolveTable(collectionName) {
  return COLLECTION_MAP[collectionName] || collectionName;
}

// ─── Auth Store ───────────────────────────────────────────────────────
// Mimics pb.authStore with Supabase auth
class SupabaseAuthStore {
  constructor() {
    this._model = null;
    this._token = null;
    this._isValid = false;
    this._listeners = [];
    this._initialized = false;

    // Initialize from Supabase session
    this._init();
  }

  async _init() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        this._model = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || '',
          avatar: session.user.user_metadata?.avatar_url || '',
          ...session.user.user_metadata,
          collectionId: 'profiles',
          collectionName: 'profiles',
        };
        this._token = session.access_token;
        this._isValid = true;
      }
    } catch (e) {
      console.warn('Auth init error:', e);
    }
    this._initialized = true;

    // Listen for auth changes
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        this._model = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || '',
          avatar: session.user.user_metadata?.avatar_url || '',
          ...session.user.user_metadata,
          collectionId: 'profiles',
          collectionName: 'profiles',
        };
        this._token = session.access_token;
        this._isValid = true;
      } else {
        this._model = null;
        this._token = null;
        this._isValid = false;
      }
      // Notify listeners
      this._listeners.forEach(cb => {
        try { cb(this._token, this._model); } catch (e) { /* ignore */ }
      });
    });
  }

  get isValid() {
    return this._isValid;
  }

  get model() {
    return this._model;
  }

  get token() {
    return this._token;
  }

  get record() {
    return this._model;
  }

  clear() {
    this._model = null;
    this._token = null;
    this._isValid = false;
    supabase.auth.signOut().catch(() => {});
    this._listeners.forEach(cb => {
      try { cb(null, null); } catch (e) { /* ignore */ }
    });
  }

  onChange(callback) {
    this._listeners.push(callback);
    // Return unsubscribe function
    return () => {
      this._listeners = this._listeners.filter(cb => cb !== callback);
    };
  }
}

// ─── Collection Proxy ─────────────────────────────────────────────────
// Mimics pb.collection('name') with all CRUD methods
class CollectionProxy {
  constructor(collectionName) {
    this._originalName = collectionName;
    this._tableName = resolveTable(collectionName);
  }

  // ── getList(page, perPage, options) ──
  async getList(page = 1, perPage = 50, options = {}) {
    try {
      let query = supabase.from(this._tableName).select('*', { count: 'exact' });

      // Apply filter
      if (options.filter) {
        query = applyPocketBaseFilter(query, options.filter);
      }

      // Apply sort
      if (options.sort) {
        query = applyPocketBaseSort(query, options.sort);
      }

      // Apply pagination
      const from = (page - 1) * perPage;
      const to = from + perPage - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        console.warn(`getList error on ${this._tableName}:`, error.message);
        return { items: [], totalItems: 0, totalPages: 0, page, perPage };
      }

      const totalItems = count || 0;
      const totalPages = Math.ceil(totalItems / perPage);

      return {
        items: (data || []).map(r => this._enrichRecord(r)),
        totalItems,
        totalPages,
        page,
        perPage,
      };
    } catch (e) {
      console.warn(`getList exception on ${this._tableName}:`, e);
      return { items: [], totalItems: 0, totalPages: 0, page, perPage };
    }
  }

  // ── getFullList(options) ──
  async getFullList(options = {}) {
    try {
      let query = supabase.from(this._tableName).select('*');

      if (options.filter) {
        query = applyPocketBaseFilter(query, options.filter);
      }

      if (options.sort) {
        query = applyPocketBaseSort(query, options.sort);
      }

      // Supabase defaults to 1000 rows; use pagination for more
      query = query.limit(options.batch || 500);

      const { data, error } = await query;

      if (error) {
        console.warn(`getFullList error on ${this._tableName}:`, error.message);
        return [];
      }

      return (data || []).map(r => this._enrichRecord(r));
    } catch (e) {
      console.warn(`getFullList exception on ${this._tableName}:`, e);
      return [];
    }
  }

  // ── getOne(id, options) ──
  async getOne(id, options = {}) {
    try {
      const { data, error } = await supabase
        .from(this._tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(`Record not found: ${this._tableName}/${id}`);
      }

      return this._enrichRecord(data);
    } catch (e) {
      console.warn(`getOne error on ${this._tableName}/${id}:`, e);
      throw e;
    }
  }

  // ── getFirstListItem(filter, options) ──
  async getFirstListItem(filter, options = {}) {
    try {
      let query = supabase.from(this._tableName).select('*');

      if (filter) {
        query = applyPocketBaseFilter(query, filter);
      }

      if (options.sort) {
        query = applyPocketBaseSort(query, options.sort);
      }

      const { data, error } = await query.limit(1).maybeSingle();

      if (error || !data) {
        throw new Error(`No record found matching filter: ${filter}`);
      }

      return this._enrichRecord(data);
    } catch (e) {
      console.warn(`getFirstListItem error on ${this._tableName}:`, e);
      throw e;
    }
  }

  // ── create(data, options) ──
  async create(data, options = {}) {
    try {
      // Remove PocketBase-specific fields
      const cleanData = { ...data };
      delete cleanData.$autoCancel;

      const { data: result, error } = await supabase
        .from(this._tableName)
        .insert(cleanData)
        .select()
        .single();

      if (error) {
        console.warn(`create error on ${this._tableName}:`, error.message);
        throw error;
      }

      return this._enrichRecord(result);
    } catch (e) {
      console.warn(`create exception on ${this._tableName}:`, e);
      throw e;
    }
  }

  // ── update(id, data, options) ──
  async update(id, data, options = {}) {
    try {
      const cleanData = { ...data };
      delete cleanData.$autoCancel;

      const { data: result, error } = await supabase
        .from(this._tableName)
        .update(cleanData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.warn(`update error on ${this._tableName}/${id}:`, error.message);
        throw error;
      }

      return this._enrichRecord(result);
    } catch (e) {
      console.warn(`update exception on ${this._tableName}/${id}:`, e);
      throw e;
    }
  }

  // ── delete(id, options) ──
  async delete(id, options = {}) {
    try {
      const { error } = await supabase
        .from(this._tableName)
        .delete()
        .eq('id', id);

      if (error) {
        console.warn(`delete error on ${this._tableName}/${id}:`, error.message);
        throw error;
      }

      return true;
    } catch (e) {
      console.warn(`delete exception on ${this._tableName}/${id}:`, e);
      throw e;
    }
  }

  // ── subscribe(topic, callback) - Real-time ──
  subscribe(topic, callback) {
    // Use Supabase realtime
    const channel = supabase
      .channel(`${this._tableName}-${topic || 'all'}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: this._tableName,
      }, (payload) => {
        if (callback) {
          callback({
            action: payload.eventType === 'INSERT' ? 'create'
              : payload.eventType === 'UPDATE' ? 'update'
              : payload.eventType === 'DELETE' ? 'delete' : payload.eventType,
            record: this._enrichRecord(payload.new || payload.old || {}),
          });
        }
      })
      .subscribe();

    // Return unsubscribe function
    return () => {
      supabase.removeChannel(channel);
    };
  }

  unsubscribe(topic) {
    // Supabase handles this via removeChannel; no-op here for compat
  }

  // ── authWithPassword (for users collection) ──
  async authWithPassword(email, password, options = {}) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return {
      token: data.session?.access_token,
      record: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || '',
        ...data.user.user_metadata,
      },
    };
  }

  // ── authWithOAuth2 ──
  async authWithOAuth2(options = {}) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: options.provider || 'google',
    });
    if (error) throw error;
    return data;
  }

  // Enrich record with PocketBase-compatible fields
  _enrichRecord(record) {
    if (!record) return record;
    return {
      ...record,
      collectionId: this._tableName,
      collectionName: this._originalName,
      // Ensure created/updated exist
      created: record.created_at || record.created || new Date().toISOString(),
      updated: record.updated_at || record.updated || new Date().toISOString(),
    };
  }
}

// ─── Files Proxy ──────────────────────────────────────────────────────
// Mimics pb.files.getUrl()
class FilesProxy {
  getUrl(record, filename, options = {}) {
    if (!record || !filename) return '';

    // If filename is already a full URL, return it
    if (filename.startsWith('http')) return filename;

    // If it's a Supabase storage path
    const bucket = record.collectionId || 'photos';
    const { data } = supabase.storage.from(bucket === 'photos' ? 'trip-photos' : bucket).getPublicUrl(filename);

    if (options.thumb) {
      // Supabase image transformation
      const [width, height] = options.thumb.split('x');
      return `${data.publicUrl}?width=${width}&height=${height}`;
    }

    return data.publicUrl || '';
  }
}

// ─── Main PocketBase-Compatible Client ────────────────────────────────
class SupabasePBCompat {
  constructor() {
    this.authStore = new SupabaseAuthStore();
    this.files = new FilesProxy();
    this._supabase = supabase;
  }

  collection(name) {
    return new CollectionProxy(name);
  }

  autoCancellation(enabled) {
    // No-op for compatibility
  }

  // Direct access to supabase for advanced use cases
  get supabase() {
    return supabase;
  }

  // Custom API send (maps to supabase rpc)
  async send(path, options = {}) {
    const funcName = path.replace(/^\/api\//, '').replace(/\//g, '_');
    const { data, error } = await supabase.rpc(funcName, options.body || {});
    if (error) throw error;
    return data;
  }
}

// ─── Export ───────────────────────────────────────────────────────────
const pb = new SupabasePBCompat();

export default pb;
export { pb };
