import pb from '@/lib/pocketbaseClient.js';

class OptimizationAgent {
  constructor() {
    this.status = 'idle';
    this.tripContext = null;
    this.optimizationSuggestions = [];
  }

  async initialize(trip) {
    this.tripContext = trip;
    this.status = 'active';
    console.log(`OptimizationAgent: Initialized for trip "${trip.title}"`);
  }

  async check(tripId) {
    try {
      const scheduleIssues = await this.findScheduleIssues(tripId);
      const budgetIssues = await this.findBudgetIssues(tripId);
      const optimizations = await this.findOptimizationOpportunities(tripId);

      return {
        status: 'ok',
        scheduleIssuesFound: scheduleIssues.length,
        budgetIssuesFound: budgetIssues.length,
        optimizationOpportunities: optimizations.length,
        suggestionsAvailable: optimizations.length > 0,
      };
    } catch (error) {
      return { status: 'error', error: error.message };
    }
  }

  async optimizeSchedule(tripId) {
    try {
      const trip = await pb.collection('trips').getOne(tripId);
      const activities = await pb.collection('activities').getFullList({
        filter: `trip = "${tripId}"`,
        sort: 'start_time',
      });

      const optimizations = [];

      // Check for conflicts
      for (let i = 0; i < activities.length - 1; i++) {
        const current = activities[i];
        const next = activities[i + 1];

        const currentEnd = new Date(current.end_time);
        const nextStart = new Date(next.start_time);
        const gap = (nextStart - currentEnd) / 60000; // minutes

        if (gap < 0) {
          // Conflict!
          optimizations.push({
            type: 'conflict',
            activity1: current.title,
            activity2: next.title,
            suggestion: `${current.title} and ${next.title} overlap. Reschedule one of them.`,
            severity: 'high',
          });
        } else if (gap < 15) {
          // Too tight
          optimizations.push({
            type: 'tight_schedule',
            activity1: current.title,
            activity2: next.title,
            gap: gap,
            suggestion: `Only ${Math.round(gap)} minutes between ${current.title} and ${next.title}. Add travel buffer.`,
            severity: 'medium',
          });
        }
      }

      // Check for very long activities without breaks
      let consecutiveTime = 0;
      let consecutiveStart = null;
      for (const activity of activities) {
        const duration = (new Date(activity.end_time) - new Date(activity.start_time)) / 60000;
        consecutiveTime += duration;

        if (consecutiveTime > 480) {
          // 8+ hours without break
          optimizations.push({
            type: 'long_session',
            startActivity: activity.title,
            duration: consecutiveTime,
            suggestion: `${Math.round(consecutiveTime / 60)} hours of activities without a break. Add a rest period.`,
            severity: 'medium',
          });
          consecutiveTime = 0;
        }
      }

      console.log(`OptimizationAgent: Found ${optimizations.length} schedule optimization opportunities`);

      return {
        status: 'success',
        optimizations,
        totalIssues: optimizations.length,
        criticalIssues: optimizations.filter(o => o.severity === 'high').length,
      };
    } catch (error) {
      console.error('OptimizationAgent: Error optimizing schedule:', error);
      return { status: 'error', error: error.message };
    }
  }

  async optimizeBudget(tripId) {
    try {
      const trip = await pb.collection('trips').getOne(tripId);
      const activities = await pb.collection('activities').getFullList({
        filter: `trip = "${tripId}"`,
      });

      const suggestions = [];
      const totalBudget = trip.budget || 5000;
      const totalSpend = activities.reduce((sum, a) => sum + (a.estimated_cost || 0), 0);
      const remaining = totalBudget - totalSpend;
      const percentUsed = (totalSpend / totalBudget) * 100;

      // Budget overspend
      if (remaining < 0) {
        suggestions.push({
          type: 'overspend',
          amount: Math.abs(remaining),
          percentOverBudget: Math.round(percentUsed - 100),
          suggestion: `Over budget by $${Math.abs(remaining).toFixed(2)}. Consider removing or replacing expensive activities.`,
          severity: 'high',
        });
      }

      // Budget almost exceeded
      if (percentUsed > 85 && percentUsed < 100) {
        suggestions.push({
          type: 'budget_tight',
          remaining: remaining,
          percentUsed: Math.round(percentUsed),
          suggestion: `${Math.round(percentUsed)}% of budget used. Limited funds remaining. Be careful with spontaneous spending.`,
          severity: 'medium',
        });
      }

      // Find expensive activities that could be replaced
      const expensiveActivities = activities
        .filter(a => (a.estimated_cost || 0) > totalBudget * 0.1)
        .sort((a, b) => (b.estimated_cost || 0) - (a.estimated_cost || 0))
        .slice(0, 3);

      if (expensiveActivities.length > 0) {
        suggestions.push({
          type: 'expensive_activity',
          activities: expensiveActivities.map(a => ({
            title: a.title,
            cost: a.estimated_cost,
            costPercentOfBudget: Math.round((a.estimated_cost / totalBudget) * 100),
          })),
          suggestion: `Consider more budget-friendly alternatives to high-cost activities.`,
          severity: 'low',
        });
      }

      // Find budget-friendly activities
      const cheapActivities = activities
        .filter(a => (a.estimated_cost || 0) <= 25)
        .length;

      if (cheapActivities > activities.length / 2) {
        suggestions.push({
          type: 'budget_friendly',
          message: `Good job! Over ${Math.round((cheapActivities / activities.length) * 100)}% of your activities are budget-friendly.`,
          severity: 'positive',
        });
      }

      console.log(`OptimizationAgent: Generated ${suggestions.length} budget optimization suggestions`);

      return {
        status: 'success',
        suggestions,
        budgetAnalysis: {
          totalBudget,
          totalSpend: Math.round(totalSpend),
          remaining: Math.round(remaining),
          percentUsed: Math.round(percentUsed),
        },
      };
    } catch (error) {
      console.error('OptimizationAgent: Error optimizing budget:', error);
      return { status: 'error', error: error.message };
    }
  }

  async rebalanceDay(tripId, dayId) {
    try {
      const dayActivities = await pb.collection('activities').getFullList({
        filter: `trip = "${tripId}" && day = "${dayId}"`,
        sort: 'start_time',
      });

      const rebalancing = {
        dayId,
        originalActivityCount: dayActivities.length,
        suggestions: [],
      };

      // Check if day is too packed
      if (dayActivities.length > 5) {
        rebalancing.suggestions.push({
          type: 'too_packed',
          message: `${dayActivities.length} activities planned. Consider moving some to adjacent days for a more relaxed pace.`,
          severity: 'medium',
        });
      }

      // Check if day is light
      if (dayActivities.length < 1) {
        rebalancing.suggestions.push({
          type: 'too_light',
          message: 'No activities planned. Consider adding some experiences or free time blocks.',
          severity: 'low',
        });
      }

      // Calculate activity distribution
      const totalTime = dayActivities.reduce(
        (sum, a) => sum + (new Date(a.end_time) - new Date(a.start_time)),
        0
      );
      const hoursOfActivity = totalTime / (1000 * 60 * 60);
      const restTime = 24 - hoursOfActivity;

      if (hoursOfActivity > 14) {
        rebalancing.suggestions.push({
          type: 'insufficient_rest',
          hoursOfActivity: Math.round(hoursOfActivity),
          restHours: Math.round(restTime),
          message: `${Math.round(hoursOfActivity)} hours of activities. Only ${Math.round(restTime)} hours for rest and meals.`,
          severity: 'medium',
        });
      }

      console.log(`OptimizationAgent: Rebalanced day ${dayId} with ${rebalancing.suggestions.length} suggestions`);

      return {
        status: 'success',
        rebalancing,
      };
    } catch (error) {
      console.error('OptimizationAgent: Error rebalancing day:', error);
      return { status: 'error', error: error.message };
    }
  }

  async handleEvent(event) {
    if (event.type === 'weather_change') {
      console.log(`OptimizationAgent: Evaluating schedule adjustments due to weather`);
      return { status: 'processing', event: event.type };
    }

    if (event.type === 'time_drift') {
      console.log(`OptimizationAgent: Rebalancing schedule due to time drift`);
      return { status: 'processing', event: event.type };
    }

    if (event.type === 'budget_exceeded') {
      console.log(`OptimizationAgent: Generating budget recovery suggestions`);
      return { status: 'processing', event: event.type };
    }

    return { status: 'ignored' };
  }

  getStatus() {
    return {
      name: 'OptimizationAgent',
      status: this.status,
      tripId: this.tripContext?.id || null,
      suggestionsGenerated: this.optimizationSuggestions.length,
    };
  }

  // Helper methods
  async findScheduleIssues(tripId) {
    const activities = await pb.collection('activities').getFullList({
      filter: `trip = "${tripId}"`,
      sort: 'start_time',
    });

    const issues = [];
    for (let i = 0; i < activities.length - 1; i++) {
      const current = activities[i];
      const next = activities[i + 1];
      const gap = (new Date(next.start_time) - new Date(current.end_time)) / 60000;

      if (gap < 0) {
        issues.push({ type: 'conflict', activities: [current.title, next.title] });
      }
    }

    return issues;
  }

  async findBudgetIssues(tripId) {
    const trip = await pb.collection('trips').getOne(tripId);
    const activities = await pb.collection('activities').getFullList({
      filter: `trip = "${tripId}"`,
    });

    const issues = [];
    const totalSpend = activities.reduce((sum, a) => sum + (a.estimated_cost || 0), 0);

    if (totalSpend > (trip.budget || 5000)) {
      issues.push({
        type: 'overspend',
        amount: totalSpend - (trip.budget || 5000),
      });
    }

    return issues;
  }

  async findOptimizationOpportunities(tripId) {
    const opportunities = [];

    const schedule = await this.optimizeSchedule(tripId);
    const budget = await this.optimizeBudget(tripId);

    opportunities.push(...schedule.optimizations);
    opportunities.push(...budget.suggestions);

    return opportunities;
  }
}

export default OptimizationAgent;
