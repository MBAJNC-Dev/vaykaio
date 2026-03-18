import supabase from '@/lib/supabaseClient.js';

const GroupService = {
  // Get all members of a trip/group
  async getGroupMembers(tripId) {
    try {
      const { data, error } = await supabase
        .from('trip_members')
        .select('*')
        .eq('trip_id', tripId)
        .order('created_at');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Failed to fetch members for trip ${tripId}:`, error);
      throw error;
    }
  },

  // Update a member's role
  async updateMemberRole(memberId, role) {
    try {
      const validRoles = ['planner', 'editor', 'viewer', 'companion'];
      if (!validRoles.includes(role)) {
        throw new Error(`Invalid role: ${role}`);
      }

      const { data, error } = await supabase
        .from('trip_members')
        .update({ role })
        .eq('id', memberId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Failed to update member role:`, error);
      throw error;
    }
  },

  // Create a new vote
  async createVote(tripId, voteData, userId) {
    try {
      const { question, options, deadline, voteType = 'single_choice' } = voteData;

      if (!question || !options || options.length < 2) {
        throw new Error('Vote must have a question and at least 2 options');
      }

      const { data, error } = await supabase
        .from('group_votes')
        .insert({
          trip_id: tripId,
          question,
          options: JSON.stringify(options),
          vote_type: voteType,
          deadline: deadline || null,
          created_by: userId,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to create vote:', error);
      throw error;
    }
  },

  // Get all active votes for a trip
  async getActiveVotes(tripId) {
    try {
      const { data, error } = await supabase
        .from('group_votes')
        .select('*')
        .eq('trip_id', tripId)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Failed to fetch votes for trip ${tripId}:`, error);
      throw error;
    }
  },

  // Cast a vote
  async castVote(voteId, userId, selectedOption) {
    try {
      // Check if user already voted
      const { data: existing, error: fetchError } = await supabase
        .from('group_vote_responses')
        .select('id')
        .eq('vote_id', voteId)
        .eq('user_id', userId)
        .limit(1);

      if (fetchError) throw fetchError;

      if (existing && existing.length > 0) {
        // Update existing vote
        const { data, error } = await supabase
          .from('group_vote_responses')
          .update({ selected_option: selectedOption })
          .eq('id', existing[0].id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Create new vote response
        const { data, error } = await supabase
          .from('group_vote_responses')
          .insert({
            vote_id: voteId,
            user_id: userId,
            selected_option: selectedOption
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    } catch (error) {
      console.error('Failed to cast vote:', error);
      throw error;
    }
  },

  // Get vote results with tallies
  async getVoteResults(voteId) {
    try {
      const { data: vote, error: voteError } = await supabase
        .from('group_votes')
        .select('*')
        .eq('id', voteId)
        .single();

      if (voteError) throw voteError;

      const { data: responses, error: responseError } = await supabase
        .from('group_vote_responses')
        .select('*')
        .eq('vote_id', voteId);

      if (responseError) throw responseError;

      const options = JSON.parse(vote.options);
      const tallies = {};
      options.forEach(opt => {
        tallies[opt] = {
          count: 0,
          percentage: 0,
          voters: []
        };
      });

      (responses || []).forEach(response => {
        if (tallies[response.selected_option]) {
          tallies[response.selected_option].count++;
          tallies[response.selected_option].voters.push(response.user_id);
        }
      });

      const total = responses?.length || 0;
      Object.keys(tallies).forEach(opt => {
        tallies[opt].percentage = total > 0 ? Math.round((tallies[opt].count / total) * 100) : 0;
      });

      return {
        vote,
        tallies,
        totalVotes: total,
        voters: (responses || []).map(r => r.user_id)
      };
    } catch (error) {
      console.error('Failed to get vote results:', error);
      throw error;
    }
  },

  // Close a vote
  async closeVote(voteId) {
    try {
      const { data, error } = await supabase
        .from('group_votes')
        .update({ status: 'closed' })
        .eq('id', voteId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to close vote:', error);
      throw error;
    }
  },

  // Get consolidated group calendar (all members' activities)
  async getGroupCalendar(tripId) {
    try {
      const { data: items, error } = await supabase
        .from('itinerary_items')
        .select('*')
        .eq('trip_id', tripId)
        .order('start_time');

      if (error) throw error;

      // Organize by day
      const calendar = {};
      (items || []).forEach(item => {
        const day = item.day || 1;
        if (!calendar[day]) {
          calendar[day] = [];
        }
        calendar[day].push(item);
      });

      return calendar;
    } catch (error) {
      console.error(`Failed to fetch group calendar for trip ${tripId}:`, error);
      throw error;
    }
  },

  // Get a specific member's schedule
  async getMemberSchedule(tripId, userId) {
    try {
      const { data, error } = await supabase
        .from('itinerary_items')
        .select('*')
        .eq('trip_id', tripId)
        .eq('assigned_to', userId)
        .order('start_time');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Failed to fetch schedule for user ${userId}:`, error);
      throw error;
    }
  },

  // Detect timing/location conflicts between members
  async detectConflicts(tripId) {
    try {
      const { data: allItems, error } = await supabase
        .from('itinerary_items')
        .select('*')
        .eq('trip_id', tripId);

      if (error) throw error;

      const conflicts = [];
      const items = allItems || [];

      // Compare each item with others
      for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
          const item1 = items[i];
          const item2 = items[j];

          // Check if same day but different locations
          if (item1.day === item2.day) {
            const loc1 = item1.location_id;
            const loc2 = item2.location_id;

            if (loc1 && loc2 && loc1 !== loc2) {
              // Check time overlap
              const start1 = new Date(item1.start_time);
              const end1 = new Date(item1.end_time);
              const start2 = new Date(item2.start_time);
              const end2 = new Date(item2.end_time);

              if (start1 < end2 && start2 < end1) {
                conflicts.push({
                  type: 'location_conflict',
                  items: [item1.id, item2.id],
                  description: `Location conflict on day ${item1.day}`,
                  severity: 'medium'
                });
              }
            }
          }
        }
      }

      return conflicts;
    } catch (error) {
      console.error(`Failed to detect conflicts for trip ${tripId}:`, error);
      throw error;
    }
  },

  // Send a group message
  async sendGroupMessage(tripId, userId, message, messageType = 'text') {
    try {
      const { data, error } = await supabase
        .from('group_messages')
        .insert({
          trip_id: tripId,
          user_id: userId,
          message_type: messageType,
          content: message,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to send group message:', error);
      throw error;
    }
  },

  // Get recent group messages
  async getGroupMessages(tripId, limit = 50, offset = 0) {
    try {
      const { data: items, error, count } = await supabase
        .from('group_messages')
        .select('*', { count: 'exact' })
        .eq('trip_id', tripId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return {
        items: (items || []).reverse(),
        totalItems: count || 0,
        limit,
        offset
      };
    } catch (error) {
      console.error(`Failed to fetch messages for trip ${tripId}:`, error);
      throw error;
    }
  },

  // Add a member to a trip
  async addMember(tripId, email, role = 'viewer') {
    try {
      // First, find the user by email
      const { data: users, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .limit(1);

      if (userError) throw userError;

      if (!users || users.length === 0) {
        throw new Error('User not found');
      }

      // Create trip_member record
      const { data, error } = await supabase
        .from('trip_members')
        .insert({
          trip_id: tripId,
          user_id: users[0].id,
          role,
          status: 'invited'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to add member:', error);
      throw error;
    }
  },

  // Remove a member from a trip
  async removeMember(tripId, memberId) {
    try {
      const { error } = await supabase
        .from('trip_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Failed to remove member:', error);
      throw error;
    }
  },

  // Get trip budget summary
  async getTripBudget(tripId) {
    try {
      const { data: expenses, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('trip_id', tripId);

      if (error) throw error;

      let totalSpent = 0;
      const expensesByPayer = {};

      (expenses || []).forEach(expense => {
        totalSpent += expense.amount || 0;
        if (!expensesByPayer[expense.paid_by]) {
          expensesByPayer[expense.paid_by] = 0;
        }
        expensesByPayer[expense.paid_by] += expense.amount || 0;
      });

      return {
        totalSpent,
        expensesByPayer,
        expenses: expenses || []
      };
    } catch (error) {
      console.error(`Failed to fetch budget for trip ${tripId}:`, error);
      throw error;
    }
  }
};

export default GroupService;
