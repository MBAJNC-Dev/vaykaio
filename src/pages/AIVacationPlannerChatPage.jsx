
import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, Loader2, ArrowRight, RefreshCcw, Sparkles } from 'lucide-react';
import { usePlanner } from '@/contexts/AIVacationPlannerContext.jsx';
import { ScenarioAwareAIService } from '@/services/ScenarioAwareAIService.js';

const AIVacationPlannerChatPage = () => {
  const navigate = useNavigate();
  const { state, addMessage, updatePlanData, setScenario, updateScenarioDetails, setGenerating, resetPlan, getScenarioSpecificFeatures } = usePlanner();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.chatHistory, state.isGenerating]);

  const handleSend = async (text) => {
    if (!text.trim() && !state.isGenerating) return;
    
    const userMsg = text.trim();
    if (userMsg) {
      addMessage({ role: 'user', text: userMsg });
    }
    
    setInputValue('');
    setGenerating(true);

    try {
      const response = await ScenarioAwareAIService.getScenarioAwareResponse(
        userMsg, 
        state.currentScenario, 
        { stepIndex: state.planData.stepIndex }
      );

      if (response.extractedData) {
        if (response.extractedData.currentScenario) {
          setScenario(response.extractedData.currentScenario, response.extractedData.scenarioDetails);
        } else if (response.extractedData.scenarioDetails) {
          updateScenarioDetails(response.extractedData.scenarioDetails);
        }
        
        updatePlanData({ stepIndex: response.nextStepIndex });
      }

      addMessage({ 
        role: 'ai', 
        text: response.text, 
        options: response.options,
        isComplete: response.isComplete
      });

    } catch (error) {
      addMessage({ role: 'ai', text: "Sorry, I encountered an error processing your request. Please try again." });
    } finally {
      setGenerating(false);
    }
  };

  const handleOptionClick = (option) => {
    if (option === "Go to Dashboard") {
      // Route based on scenario
      if (state.currentScenario === 'large_group') navigate('/groups/dashboard');
      else if (state.currentScenario === 'family') navigate('/family/dashboard');
      else navigate('/ai-planner/search'); // Fallback to standard flow
    } else {
      handleSend(option);
    }
  };

  const handleReset = () => {
    resetPlan();
  };

  const features = state.scenarioDetected ? getScenarioSpecificFeatures() : [];

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 h-[calc(100vh-4rem)] flex flex-col md:flex-row gap-6">
      <Helmet><title>AI Scenario Planner | TravelMatrix</title></Helmet>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex justify-between items-center mb-6 shrink-0">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Intelligent Trip Planner</h1>
            <p className="text-sm text-muted-foreground">
              {state.scenarioDetected 
                ? `Configuring: ${ScenarioAwareAIService.getScenarioName(state.currentScenario)}` 
                : "Step 1: Scenario Detection"}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleReset} className="text-muted-foreground">
            <RefreshCcw className="w-4 h-4 mr-2" /> Start Over
          </Button>
        </div>

        <Card className="flex-1 flex flex-col overflow-hidden border-muted shadow-sm">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50/50 dark:bg-slate-950/50">
            <AnimatePresence initial={false}>
              {state.chatHistory.map((msg, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'ai' && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  
                  <div className={`max-w-[85%] space-y-3 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                        : 'bg-white dark:bg-slate-900 border shadow-sm rounded-tl-sm'
                    }`}>
                      {msg.text}
                    </div>
                    
                    {msg.options && msg.options.length > 0 && msg.role === 'ai' && idx === state.chatHistory.length - 1 && !state.isGenerating && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {msg.options.map((opt, i) => (
                          <Button 
                            key={i} 
                            variant={msg.isComplete ? "default" : "outline"} 
                            size="sm" 
                            className={`rounded-full ${msg.isComplete ? 'shadow-md' : 'bg-white dark:bg-slate-900'}`}
                            onClick={() => handleOptionClick(opt)}
                          >
                            {opt} {msg.isComplete && <ArrowRight className="w-4 h-4 ml-2" />}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-1">
                      <User className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    </div>
                  )}
                </motion.div>
              ))}
              
              {state.isGenerating && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-white dark:bg-slate-900 border shadow-sm rounded-2xl rounded-tl-sm p-4 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Analyzing scenario...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-background border-t">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(inputValue); }}
              className="flex gap-3"
            >
              <Input 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your answer..."
                className="flex-1 rounded-full bg-muted/50 border-transparent focus-visible:bg-background"
                disabled={state.isGenerating || state.chatHistory[state.chatHistory.length-1]?.isComplete}
              />
              <Button 
                type="submit" 
                size="icon" 
                className="rounded-full shrink-0"
                disabled={!inputValue.trim() || state.isGenerating || state.chatHistory[state.chatHistory.length-1]?.isComplete}
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </Card>
      </div>

      {/* Sidebar - Scenario Features */}
      <div className="w-full md:w-72 shrink-0 flex flex-col gap-4">
        <Card className="bg-primary/5 border-primary/20">
          <div className="p-4 border-b border-primary/10 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Active Features</h3>
          </div>
          <div className="p-4">
            {!state.scenarioDetected ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Features will unlock once we determine your travel style.
              </p>
            ) : (
              <div className="space-y-3">
                <p className="text-xs font-medium text-primary uppercase tracking-wider mb-2">
                  {ScenarioAwareAIService.getScenarioName(state.currentScenario)} Tools
                </p>
                {features.map((feature, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-2 text-sm bg-background p-2 rounded-md border shadow-sm"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    {feature}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {state.scenarioDetected && (
          <Card>
            <div className="p-4 border-b">
              <h3 className="font-semibold text-sm">Collected Details</h3>
            </div>
            <div className="p-4 space-y-2 text-sm">
              {Object.entries(state.scenarioDetails).map(([key, value]) => (
                <div key={key} className="flex flex-col">
                  <span className="text-muted-foreground text-xs capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="font-medium truncate" title={String(value)}>{String(value)}</span>
                </div>
              ))}
              {Object.keys(state.scenarioDetails).length === 0 && (
                <span className="text-muted-foreground italic">Gathering info...</span>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AIVacationPlannerChatPage;
