
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plane, Hotel, Map, Coffee, Star, Plus, Check, ArrowRight, DollarSign } from 'lucide-react';
import { usePlanner } from '@/contexts/AIVacationPlannerContext.jsx';

const CATEGORIES = [
  { id: 'flights', label: 'Flights', icon: Plane },
  { id: 'accommodations', label: 'Stays', icon: Hotel },
  { id: 'activities', label: 'Activities', icon: Map },
  { id: 'restaurants', label: 'Dining', icon: Coffee }
];

const AIVacationPlannerReviewPage = () => {
  const navigate = useNavigate();
  const { state, selectItem, deselectItem } = usePlanner();
  const [activeCategory, setActiveCategory] = useState('accommodations');

  // Redirect if no results
  if (!state.searchResults) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <p>No search results found. Please start a new plan.</p>
        <Button onClick={() => navigate('/ai-planner/chat')}>Start Over</Button>
      </div>
    );
  }

  const currentItems = state.searchResults[activeCategory] || [];
  const selectedForCategory = state.selectedItems[activeCategory] || [];

  const handleToggleSelect = (item) => {
    const isSelected = selectedForCategory.some(i => i.id === item.id);
    if (isSelected) {
      deselectItem(activeCategory, item.id);
    } else {
      selectItem(activeCategory, item);
    }
  };

  // Calculate totals
  const calculateTotal = () => {
    let total = 0;
    Object.values(state.selectedItems).forEach(arr => {
      arr.forEach(item => {
        if (typeof item.price === 'number') total += item.price;
      });
    });
    return total;
  };

  return (
    <div className="max-w-[1600px] mx-auto py-6 px-4 sm:px-6 lg:px-8 h-[calc(100vh-4rem)] flex flex-col">
      <Helmet><title>Review Options | TravelMatrix</title></Helmet>

      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Review & Select Options</h1>
          <p className="text-muted-foreground">Choose your preferred items to build your final itinerary.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/ai-planner/refinement')}>Refine Search</Button>
          <Button onClick={() => navigate('/ai-planner/final-plan')}>
            View Final Plan <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        
        {/* Left Sidebar - Categories */}
        <Card className="lg:col-span-2 flex flex-col overflow-hidden">
          <CardContent className="p-4 space-y-2">
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              const count = state.selectedItems[cat.id]?.length || 0;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                    activeCategory === cat.id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span className="font-medium text-sm">{cat.label}</span>
                  </div>
                  {count > 0 && (
                    <Badge variant={activeCategory === cat.id ? "secondary" : "default"} className="h-5 w-5 p-0 flex items-center justify-center rounded-full">
                      {count}
                    </Badge>
                  )}
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* Main Content - Options List */}
        <Card className="lg:col-span-7 flex flex-col overflow-hidden">
          <CardHeader className="border-b pb-4 shrink-0">
            <CardTitle className="capitalize flex items-center justify-between">
              <span>Recommended {activeCategory}</span>
              <span className="text-sm font-normal text-muted-foreground">{currentItems.length} options</span>
            </CardTitle>
          </CardHeader>
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {currentItems.map(item => {
                const isSelected = selectedForCategory.some(i => i.id === item.id);
                return (
                  <div key={item.id} className={`p-4 rounded-xl border transition-all ${isSelected ? 'border-primary ring-1 ring-primary/20 bg-primary/5' : 'hover:border-muted-foreground/30 bg-card'}`}>
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          {item.rating && (
                            <span className="flex items-center text-amber-500">
                              <Star className="w-3.5 h-3.5 fill-current mr-1" /> {item.rating}
                            </span>
                          )}
                          {item.duration && <span>• {item.duration}</span>}
                          {item.type && <span>• {item.type}</span>}
                          {item.cuisine && <span>• {item.cuisine}</span>}
                        </div>
                        {item.amenities && (
                          <div className="flex gap-2 mt-2">
                            {item.amenities.map(am => <Badge key={am} variant="secondary" className="text-xs font-normal">{am}</Badge>)}
                          </div>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xl font-bold mb-3">
                          {typeof item.price === 'number' ? `$${item.price}` : item.price}
                        </div>
                        <Button 
                          variant={isSelected ? "secondary" : "default"} 
                          size="sm"
                          onClick={() => handleToggleSelect(item)}
                          className={isSelected ? "bg-primary/10 text-primary hover:bg-primary/20" : ""}
                        >
                          {isSelected ? <><Check className="w-4 h-4 mr-1" /> Selected</> : <><Plus className="w-4 h-4 mr-1" /> Select</>}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </Card>

        {/* Right Sidebar - Summary */}
        <Card className="lg:col-span-3 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-900/50">
          <CardHeader className="border-b pb-4 shrink-0">
            <CardTitle className="text-lg">Trip Summary</CardTitle>
          </CardHeader>
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-6">
              {CATEGORIES.map(cat => {
                const items = state.selectedItems[cat.id] || [];
                if (items.length === 0) return null;
                
                return (
                  <div key={cat.id} className="space-y-2">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                      <cat.icon className="w-3.5 h-3.5" /> {cat.label}
                    </h4>
                    <div className="space-y-2">
                      {items.map(item => (
                        <div key={item.id} className="flex justify-between text-sm bg-background p-2 rounded border shadow-sm">
                          <span className="truncate pr-2">{item.name}</span>
                          <span className="font-medium shrink-0">{typeof item.price === 'number' ? `$${item.price}` : item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              
              {Object.values(state.selectedItems).every(arr => arr.length === 0) && (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No items selected yet. Browse categories to build your trip.
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="p-4 border-t bg-background shrink-0">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium text-muted-foreground">Estimated Total</span>
              <span className="text-2xl font-bold">${calculateTotal()}</span>
            </div>
            <Button className="w-full" size="lg" onClick={() => navigate('/ai-planner/final-plan')}>
              Review Final Plan
            </Button>
          </div>
        </Card>

      </div>
    </div>
  );
};

export default AIVacationPlannerReviewPage;
