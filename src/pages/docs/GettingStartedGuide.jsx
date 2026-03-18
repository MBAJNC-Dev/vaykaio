
import React from 'react';
import { Helmet } from 'react-helmet';
import ReactMarkdown from 'react-markdown';
import DocLayout from '@/components/docs/DocLayout.jsx';

const markdownContent = `
# Getting Started with VaykAIo

Welcome to VaykAIo! This guide will walk you through the basics of setting up your first trip, inviting collaborators, and using our AI tools to build the perfect itinerary.

## 1. Create Your First Trip

To begin planning, you need to create a trip workspace. This acts as the central hub for all your dates, budgets, and activities.

1. Navigate to your **Dashboard**.
2. Click the **New Trip** button in the top right corner.
3. Enter your destination, travel dates, and estimated budget.
4. Click **Create Trip**.

> **Pro Tip:** If you aren't sure where to go yet, try using the [AI Destination Recommender](/docs/features/ai-recommendations) first!

## 2. Invite Collaborators

Planning is better together. Invite your family or friends to view or edit the itinerary.

* Open your trip and go to the **Settings** tab.
* Under **Collaborators**, enter the email addresses of your travel companions.
* Select their permission level (\`Viewer\` or \`Editor\`).
* Click **Send Invites**.

## 3. Generate an AI Itinerary

Don't want to start from scratch? Let our AI build a foundation for you.

1. Inside your trip, click the **AI Itinerary** button.
2. Select your travel style (e.g., *Relaxing*, *Adventurous*, *Foodie*).
3. Specify any dietary restrictions or accessibility needs.
4. Click **Generate**. The AI will populate your calendar with suggested activities and restaurants.

## Next Steps

Now that your trip is set up, explore these advanced features:

* [Managing Group Budgets](/docs/features/budgets)
* [Using the Interactive Map](/docs/features/maps)
* [Exporting your Itinerary](/docs/features/export)
`;

const GettingStartedGuide = () => {
  return (
    <DocLayout title="Getting Started">
      <Helmet><title>Getting Started | VaykAIo Docs</title></Helmet>
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <ReactMarkdown>{markdownContent}</ReactMarkdown>
      </div>
    </DocLayout>
  );
};

export default GettingStartedGuide;
