
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge.jsx';
import { MessageSquare, Send, Bot, User, Trash2, Mic, Check, AlertCircle } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';
import AIRecommendationCard from '@/components/AIRecommendationCard';

// Mock AI response generator
const generateAIResponse = (message) => {
  const lowerMsg = message.toLowerCase();

  if (lowerMsg.includes('restaurant') || lowerMsg.includes('food') || lowerMsg.includes('eat')) {
    return {
      text: "I found some great dining options for you based on your preferences.",
      cards: [
        {
          id: 'rec1',
          title: 'Trattoria da Marco',
          description: 'Authentic Italian cuisine in the historic district.',
          type: 'restaurant',
          confidence: 0.92,
          reasoning: 'You love Italian food and this has 4.7★ ratings',
          actionLabel: 'Add to Wishlist',
          metadata: { price: '€€', rating: 4.7, reviewCount: 258, distance: '2.3 km' },
        },
        {
          id: 'rec2',
          title: 'Street Food Market',
          description: 'Local vendors with authentic street food.',
          type: 'restaurant',
          confidence: 0.88,
          reasoning: 'Perfect for budget-conscious travelers like you',
          actionLabel: 'Get Details',
          metadata: { price: '€', rating: 4.5, reviewCount: 412, distance: '1.5 km' },
        },
      ],
    };
  } else if (lowerMsg.includes('activity') || lowerMsg.includes('what to do') || lowerMsg.includes('things to do')) {
    return {
      text: "Here are some activities perfectly suited to your travel style:",
      cards: [
        {
          id: 'act1',
          title: 'Sunrise Hike',
          description: 'Scenic mountain hike with local guide.',
          type: 'activity',
          confidence: 0.90,
          reasoning: 'Matches your adventure preferences',
          actionLabel: 'Book Activity',
          metadata: { distance: '8 km away' },
        },
        {
          id: 'act2',
          title: 'Cultural Walking Tour',
          description: 'Explore historic neighborhoods with historian.',
          type: 'activity',
          confidence: 0.85,
          reasoning: 'You appreciate cultural experiences',
          actionLabel: 'Join Tour',
          metadata: { distance: '0.5 km away' },
        },
      ],
    };
  } else if (lowerMsg.includes('budget') || lowerMsg.includes('cost') || lowerMsg.includes('money')) {
    return {
      text: "Here are some smart money-saving tips for your trip:",
      cards: [
        {
          id: 'bt1',
          title: 'Free Museum Day',
          description: 'Museums offer free entry on Sundays.',
          type: 'budget',
          confidence: 0.95,
          reasoning: 'Tomorrow is Sunday - perfect timing',
          actionLabel: 'Plan Visit',
          metadata: { savings: '€45+' },
        },
        {
          id: 'bt2',
          title: 'Lunch Special Deal',
          description: '20% off lunch menu 11am-2pm.',
          type: 'budget',
          confidence: 0.89,
          reasoning: 'You mentioned flexible lunch timing',
          actionLabel: 'Set Reminder',
          metadata: { savings: '€12-18 per meal' },
        },
      ],
    };
  } else if (lowerMsg.includes('schedule') || lowerMsg.includes('time') || lowerMsg.includes('optimize')) {
    return {
      text: "I have some schedule optimization suggestions:",
      cards: [
        {
          id: 'sc1',
          title: 'Reorganize Daily Schedule',
          description: 'Move museum visit to morning to avoid crowds.',
          type: 'schedule_change',
          confidence: 0.86,
          reasoning: 'Improves your experience and saves energy',
          actionLabel: 'Accept Change',
          metadata: {},
        },
      ],
    };
  } else if (lowerMsg.includes('optimize')) {
    return {
      text: "I can help optimize your trip in several ways:",
      cards: [
        {
          id: 'opt1',
          title: 'Alternative Route',
          description: 'Save 45 minutes on your commute.',
          type: 'schedule_change',
          confidence: 0.85,
          reasoning: 'Real-time traffic analysis shows this is optimal',
          actionLabel: 'Update Route',
          metadata: { timeSaved: '45 minutes' },
        },
      ],
    };
  }

  return {
    text: "I can help you plan your trip! Try asking me about restaurants, activities, budget tips, or schedule optimization. What would you like help with?",
    cards: [],
  };
};

const AIAssistantPage = () => {
  const { tripId } = useParams();
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeAgents, setActiveAgents] = useState(['Planner', 'Experience', 'Monitor']);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetchHistory();
  }, [tripId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchHistory = async () => {
    try {
      const records = await pb.collection('chat_history').getList(1, 50, {
        filter: `trip_id = "${tripId}" && user_id = "${currentUser.id}"`,
        sort: 'created',
        $autoCancel: false,
      });
      setMessages(records.items);
    } catch (error) {
      toast.error('Failed to load chat history');
    }
  };

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    const userMsg = messageText;
    setInput('');
    setLoading(true);

    try {
      // Add user message
      const userMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: userMsg,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMessage]);

      // Simulate AI thinking
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Generate AI response
      const { text, cards } = generateAIResponse(userMsg);

      const aiMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: text,
        cards,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);

      // Try to save to database
      try {
        await pb.collection('chat_history').create({
          user_id: currentUser.id,
          trip_id: tripId,
          message: userMsg,
          response: text,
          metadata: { cards },
        }, { $autoCancel: false });
      } catch (dbError) {
        console.log('Could not save to database, continuing with local state');
      }

      setLoading(false);
    } catch (error) {
      toast.error('Failed to process message');
      setLoading(false);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  const clearHistory = async () => {
    if (!window.confirm('Clear all chat history for this trip?')) return;
    try {
      await Promise.all(messages.map(m => pb.collection('chat_history').delete(m.id, { $autoCancel: false })));
      setMessages([]);
      toast.success('History cleared');
    } catch (error) {
      toast.error('Failed to clear history');
    }
  };

  const quickActions = [
    "What should we do now?",
    "Optimize my schedule",
    "Find restaurants nearby",
    "Weather update",
    "Budget check"
  ];

  return (
    <>
      <Helmet><title>AI Assistant - VaykAIo</title></Helmet>
      <div className="h-[calc(100vh-6rem)] flex flex-col max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex justify-between items-center mb-4"
        >
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <MessageSquare className="w-8 h-8 text-primary" />
              VaykAIo Assistant
            </h1>
            <div className="flex items-center gap-2 ml-4">
              <div className="text-xs text-muted-foreground">Active Agents:</div>
              <div className="flex gap-1">
                {activeAgents.map((agent, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-1 px-2 py-1 bg-green-50 border border-green-200 rounded-full"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full bg-green-600"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="text-xs font-medium text-green-700">{agent}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={clearHistory}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </motion.div>

        {/* Chat Container */}
        <Card className="flex-1 flex flex-col overflow-hidden shadow-lg border-primary/20">
          <ScrollArea className="flex-1 p-6" ref={scrollRef}>
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-8 py-12"
              >
                <motion.div
                  className="w-20 h-20 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Bot className="w-10 h-10 text-primary" />
                </motion.div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">
                    Welcome to VaykAIo
                  </h3>
                  <p className="text-muted-foreground mt-2 max-w-md">
                    I'm your intelligent travel companion. Ask me about restaurants, activities, budget optimization, and schedule planning.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
                  {quickActions.map((action, i) => (
                    <motion.button
                      key={i}
                      onClick={() => handleSendMessage(action)}
                      className="px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-medium text-sm transition-all border border-primary/20"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {action}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="space-y-4 pb-4">
                <AnimatePresence mode="popLayout">
                  {messages.map((msg, idx) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.role === 'user' ? (
                        <>
                          <div className="flex-1 max-w-xs lg:max-w-md">
                            <motion.div
                              className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground px-4 py-3 rounded-2xl rounded-tr-sm shadow-sm"
                              whileHover={{ scale: 1.02 }}
                            >
                              <p className="text-sm">{msg.content}</p>
                            </motion.div>
                          </div>
                          <motion.div
                            className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                          >
                            <User className="w-4 h-4 text-accent" />
                          </motion.div>
                        </>
                      ) : (
                        <>
                          <motion.div
                            className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                          >
                            <Bot className="w-4 h-4 text-primary" />
                          </motion.div>
                          <div className="flex-1 max-w-2xl space-y-3">
                            <motion.div
                              className="bg-muted px-4 py-3 rounded-2xl rounded-tl-sm"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.1 }}
                            >
                              <p className="text-sm text-foreground">{msg.content}</p>
                            </motion.div>

                            {msg.cards && msg.cards.length > 0 && (
                              <div className="grid gap-3 mt-3">
                                {msg.cards.map((card, cardIdx) => (
                                  <motion.div
                                    key={card.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 + cardIdx * 0.1 }}
                                  >
                                    <AIRecommendationCard
                                      {...card}
                                      onAction={(rec) => {
                                        toast.success(`Added: ${rec.title}`);
                                      }}
                                      onDismiss={() => {
                                        // Handle dismiss
                                      }}
                                    />
                                  </motion.div>
                                ))}
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                    <div className="bg-muted px-4 py-3 rounded-2xl rounded-tl-sm flex gap-2 items-center">
                      <motion.div
                        className="w-2 h-2 bg-primary rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-primary rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-primary rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                      />
                      <span className="text-xs text-muted-foreground ml-2">AI is thinking...</span>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </ScrollArea>

          {/* Input Area */}
          <CardFooter className="p-4 border-t bg-card/50 backdrop-blur-sm space-y-3 flex-col">
            {messages.length > 0 && !loading && (
              <div className="flex gap-2 w-full flex-wrap">
                {quickActions.slice(0, 3).map((action, i) => (
                  <motion.button
                    key={i}
                    onClick={() => handleSendMessage(action)}
                    className="px-3 py-1 text-xs rounded-full bg-primary/10 hover:bg-primary/20 text-primary font-medium transition-all border border-primary/20"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {action}
                  </motion.button>
                ))}
              </div>
            )}

            <form onSubmit={handleSend} className="flex w-full gap-2">
              <Input
                placeholder="Ask me anything about your trip..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1"
                disabled={loading}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-primary"
                disabled={loading}
              >
                <Mic className="w-4 h-4" />
              </Button>
              <Button
                type="submit"
                disabled={loading || !input.trim()}
                className="gap-2"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default AIAssistantPage;
