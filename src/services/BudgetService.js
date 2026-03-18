import supabase from '@/lib/supabaseClient.js';

const BudgetService = {
  // Get budget overview for a trip
  async getBudget(tripId) {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('trip_id', tripId)
        .limit(1);

      if (error) throw error;
      return data && data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error(`Failed to fetch budget for trip ${tripId}:`, error);
      throw error;
    }
  },

  // Create a budget for a trip
  async createBudget(tripId, data) {
    try {
      const { data: budget, error } = await supabase
        .from('budgets')
        .insert({
          ...data,
          trip_id: tripId,
          total_budget: data.total_budget || 0,
          currency: data.currency || 'USD',
        })
        .select()
        .single();

      if (error) throw error;
      return budget;
    } catch (error) {
      console.error(`Failed to create budget for trip ${tripId}:`, error);
      throw error;
    }
  },

  // Update a budget
  async updateBudget(budgetId, data) {
    try {
      const { data: budget, error } = await supabase
        .from('budgets')
        .update(data)
        .eq('id', budgetId)
        .select()
        .single();

      if (error) throw error;
      return budget;
    } catch (error) {
      console.error(`Failed to update budget ${budgetId}:`, error);
      throw error;
    }
  },

  // Get all expenses for a trip
  async getExpenses(tripId) {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('trip_id', tripId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Failed to fetch expenses for trip ${tripId}:`, error);
      throw error;
    }
  },

  // Add an expense
  async addExpense(tripId, data, userId) {
    try {
      if (!userId) throw new Error('Not authenticated');

      const { data: expense, error } = await supabase
        .from('expenses')
        .insert({
          ...data,
          trip_id: tripId,
          paid_by: data.paid_by || userId,
          split_type: data.split_type || 'equal',
          category: data.category || 'other',
          status: data.status || 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      return expense;
    } catch (error) {
      console.error(`Failed to add expense to trip ${tripId}:`, error);
      throw error;
    }
  },

  // Update an expense
  async updateExpense(expenseId, data) {
    try {
      const { data: expense, error } = await supabase
        .from('expenses')
        .update(data)
        .eq('id', expenseId)
        .select()
        .single();

      if (error) throw error;
      return expense;
    } catch (error) {
      console.error(`Failed to update expense ${expenseId}:`, error);
      throw error;
    }
  },

  // Delete an expense
  async deleteExpense(expenseId) {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', expenseId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error(`Failed to delete expense ${expenseId}:`, error);
      throw error;
    }
  },

  // Get expense summary grouped by category and per-person
  async getExpenseSummary(tripId) {
    try {
      const expenses = await this.getExpenses(tripId);

      const summaryByCategory = {};
      const summaryByPerson = {};
      let total = 0;

      expenses.forEach(expense => {
        // By category
        const category = expense.category || 'other';
        if (!summaryByCategory[category]) {
          summaryByCategory[category] = { total: 0, count: 0 };
        }
        summaryByCategory[category].total += expense.amount || 0;
        summaryByCategory[category].count += 1;

        // By person
        const personId = expense.paid_by;
        if (!summaryByPerson[personId]) {
          summaryByPerson[personId] = 0;
        }
        summaryByPerson[personId] += expense.amount || 0;

        total += expense.amount || 0;
      });

      return {
        total,
        by_category: summaryByCategory,
        by_person: summaryByPerson,
        count: expenses.length,
      };
    } catch (error) {
      console.error(`Failed to calculate expense summary for trip ${tripId}:`, error);
      throw error;
    }
  },

  // Calculate who owes whom based on split expenses
  async getSettlements(tripId) {
    try {
      const expenses = await this.getExpenses(tripId);

      // Get all trip members
      const { data: members, error: membersError } = await supabase
        .from('trip_members')
        .select('user_id')
        .eq('trip_id', tripId);

      if (membersError) throw membersError;

      const memberIds = (members || [])
        .map(m => m.user_id)
        .filter(Boolean);

      const balances = {};
      memberIds.forEach(id => {
        balances[id] = 0;
      });

      // Process each expense
      expenses.forEach(expense => {
        const paidBy = expense.paid_by;
        const amount = expense.amount || 0;
        const splitType = expense.split_type || 'equal';

        if (splitType === 'equal') {
          // Split equally among members
          const perPerson = amount / memberIds.length;
          balances[paidBy] += amount;

          memberIds.forEach(id => {
            if (id !== paidBy) {
              balances[id] -= perPerson;
            }
          });
        } else if (splitType === 'custom') {
          // Custom splits would require split_details
          balances[paidBy] += amount;
        }
      });

      // Convert to settlements (who owes whom)
      const settlements = [];
      const positiveBalances = Object.entries(balances).filter(([_, bal]) => bal > 0);
      const negativeBalances = Object.entries(balances).filter(([_, bal]) => bal < 0);

      positiveBalances.forEach(([creditor, amount]) => {
        let remaining = amount;

        for (const [debtor, debt] of negativeBalances) {
          const settled = Math.min(remaining, Math.abs(debt));
          if (settled > 0) {
            settlements.push({
              from: debtor,
              to: creditor,
              amount: settled,
            });
            remaining -= settled;
          }
        }
      });

      return {
        balances,
        settlements,
      };
    } catch (error) {
      console.error(`Failed to calculate settlements for trip ${tripId}:`, error);
      throw error;
    }
  },
};

export default BudgetService;
