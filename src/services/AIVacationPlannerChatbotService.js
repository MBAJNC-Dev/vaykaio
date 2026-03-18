
// Simulated AI Service for the 10-step flow
export const AIVacationPlannerChatbotService = {
  steps: [
    "greeting", "destination", "dates", "travelers", "budget", 
    "interests", "accommodation", "transportation", "dining", "additional"
  ],

  async generateAIResponse(userMessage, conversationHistory, planContext) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const currentStepIndex = planContext.stepIndex || 0;
    const currentStep = this.steps[currentStepIndex];

    let responseText = "";
    let options = [];
    let nextStepIndex = currentStepIndex;
    let extractedData = {};

    // Simple state machine for the 10 steps
    switch (currentStep) {
      case "greeting":
        responseText = "Hello! I'm your AI Vacation Planner. Let's build your dream trip. What kind of vibe are you looking for?";
        options = ["Beach", "City", "Adventure", "Cultural", "Food", "Family", "Romantic"];
        nextStepIndex = 1;
        if (userMessage) extractedData.trip_type = userMessage;
        break;
      case "destination":
        responseText = `Great choice! Do you have a specific destination in mind, or would you like some recommendations based on a ${planContext.trip_type || 'great'} vibe?`;
        options = ["Suggest destinations", "I have a place in mind"];
        nextStepIndex = 2;
        if (userMessage && userMessage !== "Suggest destinations") extractedData.destination = userMessage;
        break;
      case "dates":
        responseText = "Awesome. When are you planning to travel? (e.g., 'Next month for a week', 'July 10-20')";
        options = ["Next month", "In 3 months", "Flexible"];
        nextStepIndex = 3;
        if (userMessage) extractedData.dates_raw = userMessage;
        break;
      case "travelers":
        responseText = "Who is going on this trip? Just you, a couple, family, or a group of friends?";
        options = ["Solo", "Couple", "Family with kids", "Group of friends"];
        nextStepIndex = 4;
        if (userMessage) extractedData.travelers_raw = userMessage;
        break;
      case "budget":
        responseText = "What's your comfortable budget level for this trip? (Excluding flights)";
        options = ["Budget-friendly", "Moderate", "Luxury", "No limit"];
        nextStepIndex = 5;
        if (userMessage) extractedData.budget_level = userMessage;
        break;
      case "interests":
        responseText = "What activities do you enjoy most? Pick a few or tell me what you love doing.";
        options = ["Sightseeing", "Relaxing", "Hiking", "Museums", "Shopping", "Nightlife"];
        nextStepIndex = 6;
        if (userMessage) extractedData.interests = userMessage;
        break;
      case "accommodation":
        responseText = "Where do you prefer to stay?";
        options = ["Boutique Hotel", "Resort", "Vacation Rental", "Hostel", "Luxury Hotel"];
        nextStepIndex = 7;
        if (userMessage) extractedData.accommodation_type = userMessage;
        break;
      case "transportation":
        responseText = "How do you plan to get around locally?";
        options = ["Public Transit", "Rental Car", "Taxis/Rideshare", "Walking"];
        nextStepIndex = 8;
        if (userMessage) extractedData.transportation_type = userMessage;
        break;
      case "dining":
        responseText = "Any specific dining preferences or dietary restrictions?";
        options = ["Local Street Food", "Fine Dining", "Vegetarian/Vegan", "No restrictions"];
        nextStepIndex = 9;
        if (userMessage) extractedData.dining_preferences = userMessage;
        break;
      case "additional":
        responseText = "Almost done! Any special requests, accessibility needs, or things I should know before I generate your plan?";
        options = ["No, generate my plan!", "Need travel insurance info", "Wheelchair accessible"];
        nextStepIndex = 10; // Complete
        if (userMessage) extractedData.special_requests = userMessage;
        break;
      default:
        responseText = "I have all the details! I'm generating your comprehensive itinerary now. Click 'View Search Results' to proceed.";
        options = ["View Search Results"];
        break;
    }

    return {
      text: responseText,
      options: options,
      nextStepIndex: nextStepIndex,
      extractedData: extractedData,
      isComplete: nextStepIndex >= 10
    };
  }
};
