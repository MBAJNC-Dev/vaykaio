
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  {
    question: "How does the AI generate itineraries?",
    answer: "Our AI analyzes millions of data points including historical travel patterns, real-time weather, local event schedules, and your personal preferences to craft a highly optimized, conflict-free schedule."
  },
  {
    question: "Do I need a VR headset to use the AR/VR previews?",
    answer: "No! While a VR headset provides the most immersive experience, our 3D previews work perfectly on standard mobile phones and desktop browsers using WebGL technology."
  },
  {
    question: "How is my data secured with Web3?",
    answer: "We utilize decentralized identity protocols. Your personal data and booking confirmations are encrypted and stored on a secure blockchain network, meaning only you hold the keys to your information."
  },
  {
    question: "Can I collaborate with my family on a single trip?",
    answer: "Absolutely. You can invite unlimited collaborators to your trip workspace. Everyone can vote on activities, suggest restaurants, and view the shared budget in real-time."
  },
  {
    question: "What happens if my flight is delayed?",
    answer: "Our system monitors global flight data. If a delay is detected, the AI automatically suggests adjustments to your itinerary and can notify your hotel or scheduled activities on your behalf."
  }
];

const FAQAccordion = () => {
  return (
    <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
      {faqs.map((faq, idx) => (
        <AccordionItem key={idx} value={`item-${idx}`} className="border-b border-border/50 py-2">
          <AccordionTrigger className="text-left text-lg font-semibold hover:text-primary transition-colors">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-4">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default FAQAccordion;
