
export const ScenarioAwareAIService = {
  scenarios: {
    LARGE_GROUP: 'large_group',
    FAMILY: 'family',
    SOLO: 'solo',
    PLANNING_TOOL: 'planning_tool'
  },

  detectScenario(userMessage) {
    const msg = userMessage.toLowerCase();
    if (msg.includes('group') || msg.includes('party') || msg.includes('corporate') || msg.includes('wedding') || msg.includes('reunion') || msg.includes('10+')) {
      return this.scenarios.LARGE_GROUP;
    }
    if (msg.includes('family') || msg.includes('kids') || msg.includes('children')) {
      return this.scenarios.FAMILY;
    }
    if (msg.includes('solo') || msg.includes('just me') || msg.includes('alone') || msg.includes('individual')) {
      return this.scenarios.SOLO;
    }
    if (msg.includes('plan') || msg.includes('organize') || msg.includes('already have') || msg.includes('tool')) {
      return this.scenarios.PLANNING_TOOL;
    }
    return null;
  },

  async getScenarioAwareResponse(userMessage, scenario, context) {
    // Simulate network delay for AI processing
    await new Promise(resolve => setTimeout(resolve, 1200));

    const stepIndex = context.stepIndex || 0;
    let responseText = "";
    let options = [];
    let nextStepIndex = stepIndex;
    let extractedData = {};
    let isComplete = false;

    // STEP 1: GREETING & DETECTION
    if (!scenario && stepIndex === 0) {
      const detected = this.detectScenario(userMessage);
      if (detected) {
        extractedData.currentScenario = detected;
        extractedData.scenarioDetected = true;
        responseText = `Great! I've set up your planner for a ${this.getScenarioName(detected)}. Let's get some specific details.`;
        
        // Move to scenario-specific questions
        nextStepIndex = 1;
        const nextPrompt = this.getScenarioSpecificPrompt(detected, nextStepIndex);
        responseText += " " + nextPrompt.text;
        options = nextPrompt.options;
      } else {
        responseText = "I didn't quite catch that. What best describes your travel situation?";
        options = [
          "Large Group/Party (10+ people)", 
          "Family Trip (2-8 people)", 
          "Solo Traveler", 
          "Planning & Organization Tool"
        ];
      }
      return { text: responseText, options, nextStepIndex, extractedData, isComplete };
    }

    // STEP 3: SCENARIO-SPECIFIC QUESTIONS
    if (scenario) {
      // Process previous answer
      this.extractScenarioData(userMessage, scenario, stepIndex, extractedData);
      
      nextStepIndex = stepIndex + 1;
      const nextPrompt = this.getScenarioSpecificPrompt(scenario, nextStepIndex);
      
      if (nextPrompt) {
        responseText = nextPrompt.text;
        options = nextPrompt.options;
      } else {
        // STEP 4: FEATURE UNLOCK & COMPLETION
        responseText = `Perfect! I have all the details for your ${this.getScenarioName(scenario)}. I'm unlocking your specialized dashboard now.`;
        options = ["Go to Dashboard"];
        isComplete = true;
      }
    }

    return {
      text: responseText,
      options: options,
      nextStepIndex: nextStepIndex,
      extractedData: extractedData,
      isComplete: isComplete
    };
  },

  getScenarioName(scenario) {
    switch(scenario) {
      case this.scenarios.LARGE_GROUP: return "Large Group Trip";
      case this.scenarios.FAMILY: return "Family Vacation";
      case this.scenarios.SOLO: return "Solo Adventure";
      case this.scenarios.PLANNING_TOOL: return "Trip Organization";
      default: return "Trip";
    }
  },

  getScenarioSpecificPrompt(scenario, stepIndex) {
    const prompts = {
      [this.scenarios.LARGE_GROUP]: [
        null, // Step 0 is detection
        { text: "What is the name of your group, and roughly how many people are going?", options: ["10-20 people", "20-50 people", "50+ people"] },
        { text: "What type of group is this?", options: ["Corporate Retreat", "Wedding Party", "Family Reunion", "Friends Getaway"] },
        { text: "What is the estimated total budget or budget per person?", options: ["$500/person", "$1000/person", "$2000+/person", "Not sure yet"] },
        { text: "Do you need to send out RFPs (Requests for Proposal) to hotels or venues?", options: ["Yes, need RFPs", "No, we'll book directly"] }
      ],
      [this.scenarios.FAMILY]: [
        null,
        { text: "How many people are in your family, and what are the ages of the children?", options: ["2 Adults, 1 Child", "2 Adults, 2 Children", "Multigenerational"] },
        { text: "Are there any special needs, accessibility requirements, or dietary restrictions?", options: ["None", "Need crib/stroller", "Food allergies", "Wheelchair access"] },
        { text: "What's your family's preferred travel style?", options: ["Relaxing Resort", "Theme Parks", "Nature & Outdoors", "Cultural/Educational"] },
        { text: "What is your comfortable budget level?", options: ["Budget-friendly", "Moderate", "Luxury"] }
      ],
      [this.scenarios.SOLO]: [
        null,
        { text: "What's your primary goal for this solo trip?", options: ["Self-discovery & Relaxation", "Meeting new people", "Adventure & Challenge", "Digital Nomad/Work"] },
        { text: "What are your safety preferences and comfort levels?", options: ["Very cautious, stick to tourist areas", "Moderate, willing to explore", "Adventurous, off the beaten path"] },
        { text: "What type of accommodation do you prefer?", options: ["Social Hostels", "Boutique Hotels", "Private Apartments", "Luxury Resorts"] },
        { text: "How do you feel about group tours vs independent exploration?", options: ["Mostly group tours", "Mix of both", "100% independent"] }
      ],
      [this.scenarios.PLANNING_TOOL]: [
        null,
        { text: "Do you already have flights or accommodations booked?", options: ["Yes, both", "Only flights", "Only accommodation", "Nothing yet"] },
        { text: "What do you need the most help organizing?", options: ["Daily Itinerary", "Budget Tracking", "Document Storage", "All of the above"] },
        { text: "Would you like to upload an existing itinerary or booking confirmation?", options: ["Yes, upload now", "I'll do it later", "Don't have one"] }
      ]
    };

    return prompts[scenario][stepIndex] || null;
  },

  extractScenarioData(message, scenario, stepIndex, extractedData) {
    // Simple mock extraction based on step index
    if (!extractedData.scenarioDetails) extractedData.scenarioDetails = {};
    
    if (scenario === this.scenarios.LARGE_GROUP) {
      if (stepIndex === 1) extractedData.scenarioDetails.groupSize = message;
      if (stepIndex === 2) extractedData.scenarioDetails.groupType = message;
      if (stepIndex === 3) extractedData.scenarioDetails.budget = message;
      if (stepIndex === 4) extractedData.scenarioDetails.needsRFP = message.includes('Yes');
    } else if (scenario === this.scenarios.FAMILY) {
      if (stepIndex === 1) extractedData.scenarioDetails.familyComposition = message;
      if (stepIndex === 2) extractedData.scenarioDetails.specialNeeds = message;
      if (stepIndex === 3) extractedData.scenarioDetails.travelStyle = message;
      if (stepIndex === 4) extractedData.scenarioDetails.budget = message;
    } else if (scenario === this.scenarios.SOLO) {
      if (stepIndex === 1) extractedData.scenarioDetails.goal = message;
      if (stepIndex === 2) extractedData.scenarioDetails.safety = message;
      if (stepIndex === 3) extractedData.scenarioDetails.accommodation = message;
      if (stepIndex === 4) extractedData.scenarioDetails.tourPreference = message;
    } else if (scenario === this.scenarios.PLANNING_TOOL) {
      if (stepIndex === 1) extractedData.scenarioDetails.existingBookings = message;
      if (stepIndex === 2) extractedData.scenarioDetails.organizationNeeds = message;
      if (stepIndex === 3) extractedData.scenarioDetails.hasUploads = message;
    }
  },

  adaptFeaturesForScenario(scenario) {
    switch(scenario) {
      case this.scenarios.LARGE_GROUP:
        return ['Group Voting', 'Expense Splitting', 'RFP Management', 'Announcements', 'Room Assignments'];
      case this.scenarios.FAMILY:
        return ['Kid-Friendly Filters', 'Shared Calendar', 'Packing Lists', 'Emergency Contacts', 'Meal Planning'];
      case this.scenarios.SOLO:
        return ['Safety Check-ins', 'Meetup Suggestions', 'Budget Tracker', 'Journaling', 'Local Emergency Info'];
      case this.scenarios.PLANNING_TOOL:
        return ['Document Vault', 'Email Parsing', 'Calendar Sync', 'Expense Tracking', 'Checklists'];
      default:
        return ['Itinerary', 'Budget', 'Documents'];
    }
  }
};
