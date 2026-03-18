
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Calendar, Users, Search, Heart, Briefcase, FileText, Grid,
  Wifi, Battery, Signal, ChevronLeft, Plus, Star, CheckCircle2, Circle,
  ThumbsUp, ThumbsDown, Clock, Map, Download
} from 'lucide-react';

const PhoneMockup = ({ selectedFeature }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  const renderScreenContent = () => {
    switch (selectedFeature) {
      case 'trip-planning':
        return (
          <motion.div variants={containerVariants} initial="hidden" animate="show" exit="exit" className="space-y-4">
            <motion.div variants={itemVariants} className="text-center mb-6">
              <h3 className="font-bold text-lg">New Trip</h3>
              <p className="text-xs text-muted-foreground">Plan your next adventure</p>
            </motion.div>
            <motion.div variants={itemVariants} className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground ml-1">Destination</label>
              <div className="flex items-center bg-muted/50 p-3 rounded-xl border border-border/50">
                <MapPin className="w-4 h-4 text-primary mr-2" />
                <span className="text-sm font-medium">Paris, France</span>
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground ml-1">Dates</label>
              <div className="flex items-center bg-muted/50 p-3 rounded-xl border border-border/50">
                <Calendar className="w-4 h-4 text-primary mr-2" />
                <span className="text-sm font-medium">March 15 - 22, 2024</span>
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground ml-1">Travelers</label>
                <div className="flex items-center bg-muted/50 p-3 rounded-xl border border-border/50">
                  <Users className="w-4 h-4 text-primary mr-2" />
                  <span className="text-sm font-medium">4</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground ml-1">Budget</label>
                <div className="flex items-center bg-muted/50 p-3 rounded-xl border border-border/50">
                  <span className="text-primary font-bold mr-1">$</span>
                  <span className="text-sm font-medium">3,500</span>
                </div>
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="pt-4">
              <div className="bg-primary text-primary-foreground text-center py-3 rounded-xl font-semibold text-sm shadow-md">
                Create Trip
              </div>
            </motion.div>
          </motion.div>
        );

      case 'itinerary':
        return (
          <motion.div variants={containerVariants} initial="hidden" animate="show" exit="exit" className="space-y-4">
            <motion.div variants={itemVariants} className="flex justify-between items-center mb-2">
              <div>
                <h3 className="font-bold text-lg">Day 1</h3>
                <p className="text-xs text-primary font-medium">March 15, 2024</p>
              </div>
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Plus className="w-4 h-4 text-primary" />
              </div>
            </motion.div>
            
            {[
              { time: '9:00 AM', title: 'Breakfast at Café de Flore', loc: 'St. Germain', icon: '☕', color: 'bg-orange-100 text-orange-600' },
              { time: '11:00 AM', title: 'Eiffel Tower Visit', loc: 'Champ de Mars', icon: '🗼', color: 'bg-blue-100 text-blue-600' },
              { time: '1:00 PM', title: 'Lunch at Bistro', loc: '7th Arr.', icon: '🍽️', color: 'bg-green-100 text-green-600' }
            ].map((act, i) => (
              <motion.div key={i} variants={itemVariants} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold text-muted-foreground w-12 text-right">{act.time}</span>
                  <div className="w-0.5 h-full bg-border mt-1 rounded-full"></div>
                </div>
                <div className="bg-card border shadow-sm p-3 rounded-xl flex-1 mb-2 relative overflow-hidden">
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${act.color.split(' ')[0]}`}></div>
                  <h4 className="text-sm font-bold">{act.title}</h4>
                  <p className="text-xs text-muted-foreground flex items-center mt-1">
                    <MapPin className="w-3 h-3 mr-1" /> {act.loc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        );

      case 'family':
        return (
          <motion.div variants={containerVariants} initial="hidden" animate="show" exit="exit" className="space-y-4">
            <motion.div variants={itemVariants} className="text-center mb-4">
              <h3 className="font-bold text-lg">Family Sync</h3>
              <div className="flex justify-center gap-2 mt-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[hsl(var(--mockup-teal)/0.1)] text-[hsl(var(--mockup-teal))] font-medium">Sarah</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[hsl(var(--mockup-orange)/0.1)] text-[hsl(var(--mockup-orange))] font-medium">John</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[hsl(var(--mockup-blue)/0.1)] text-[hsl(var(--mockup-blue))] font-medium">Emma</span>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-card border shadow-sm rounded-xl p-3 space-y-3">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-xs font-bold">Proposed Activity</span>
                <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">Conflict</span>
              </div>
              <div>
                <h4 className="text-sm font-bold">Louvre Museum Tour</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Tomorrow, 10:00 AM</p>
              </div>
              <div className="flex gap-2 pt-1">
                <div className="flex-1 bg-muted/50 rounded-lg p-2 flex items-center justify-center gap-1 text-xs font-medium text-green-600 border border-green-200 bg-green-50">
                  <ThumbsUp className="w-3 h-3" /> 2
                </div>
                <div className="flex-1 bg-muted/50 rounded-lg p-2 flex items-center justify-center gap-1 text-xs font-medium text-red-600 border border-red-200 bg-red-50">
                  <ThumbsDown className="w-3 h-3" /> 1
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-card border shadow-sm rounded-xl p-3">
              <h4 className="text-xs font-bold mb-2 text-muted-foreground uppercase tracking-wider">Current Schedules</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 rounded-full bg-[hsl(var(--mockup-teal))]"></div>
                  <span className="font-medium w-10">Sarah</span>
                  <span className="text-muted-foreground truncate">Eiffel Tower (10:00 AM)</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 rounded-full bg-[hsl(var(--mockup-orange))]"></div>
                  <span className="font-medium w-10">John</span>
                  <span className="text-muted-foreground truncate">Free Time</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 rounded-full bg-[hsl(var(--mockup-blue))]"></div>
                  <span className="font-medium w-10">Emma</span>
                  <span className="text-muted-foreground truncate">Shopping (10:00 AM)</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        );

      case 'discovery':
        return (
          <motion.div variants={containerVariants} initial="hidden" animate="show" exit="exit" className="space-y-4">
            <motion.div variants={itemVariants} className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="text" placeholder="Restaurants, activities..." className="w-full bg-muted/50 border border-border/50 rounded-full py-2 pl-9 pr-4 text-xs focus:outline-none" readOnly />
            </motion.div>
            <motion.div variants={itemVariants} className="flex gap-2 overflow-hidden pb-1">
              {['Top Rated', '$$$', 'Nearby', 'Open Now'].map((tag, i) => (
                <span key={i} className="text-[10px] whitespace-nowrap px-3 py-1 rounded-full bg-primary/10 text-primary font-medium border border-primary/20">
                  {tag}
                </span>
              ))}
            </motion.div>
            <div className="space-y-3">
              {[
                { name: 'Le Jules Verne', type: 'Restaurant', rating: 4.9, price: '$$$$', img: 'bg-blue-100' },
                { name: 'Louvre Museum', type: 'Activity', rating: 4.8, price: '$$', img: 'bg-orange-100' }
              ].map((item, i) => (
                <motion.div key={i} variants={itemVariants} className="bg-card border shadow-sm rounded-xl overflow-hidden">
                  <div className={`h-20 ${item.img} w-full`}></div>
                  <div className="p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-bold">{item.name}</h4>
                        <p className="text-[10px] text-muted-foreground">{item.type} • {item.price}</p>
                      </div>
                      <div className="flex items-center text-[10px] font-bold bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded">
                        <Star className="w-3 h-3 mr-0.5 fill-current" /> {item.rating}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <div className="flex-1 bg-primary text-primary-foreground text-center py-1.5 rounded-lg text-[10px] font-semibold">Add to Trip</div>
                      <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center"><Heart className="w-3.5 h-3.5 text-muted-foreground" /></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 'favorites':
        return (
          <motion.div variants={containerVariants} initial="hidden" animate="show" exit="exit" className="space-y-4">
            <motion.div variants={itemVariants} className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Saved Places</h3>
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            </motion.div>
            
            {[
              { list: 'Must Visit', count: 4, items: ['Eiffel Tower', 'Louvre Museum'] },
              { list: 'Food & Dining', count: 6, items: ['Café de Flore', 'Le Jules Verne'] }
            ].map((list, i) => (
              <motion.div key={i} variants={itemVariants} className="bg-card border shadow-sm rounded-xl p-3">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-bold">{list.list}</h4>
                  <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{list.count} items</span>
                </div>
                <div className="space-y-2 mt-3">
                  {list.items.map((item, j) => (
                    <div key={j} className="flex justify-between items-center bg-muted/30 p-2 rounded-lg">
                      <span className="text-xs font-medium">{item}</span>
                      <Plus className="w-3.5 h-3.5 text-primary" />
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        );

      case 'packing':
        return (
          <motion.div variants={containerVariants} initial="hidden" animate="show" exit="exit" className="space-y-4">
            <motion.div variants={itemVariants} className="mb-4">
              <h3 className="font-bold text-lg">Packing List</h3>
              <div className="flex items-center justify-between mt-2 mb-1">
                <span className="text-xs font-medium text-muted-foreground">75% Complete</span>
                <span className="text-xs font-bold text-primary">12/16</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div className="bg-primary h-1.5 rounded-full w-3/4"></div>
              </div>
            </motion.div>

            {[
              { cat: 'Documents', items: [{ n: 'Passport', c: true }, { n: 'Travel Insurance', c: true }] },
              { cat: 'Electronics', items: [{ n: 'Camera', c: false }, { n: 'Phone Charger', c: true }] }
            ].map((group, i) => (
              <motion.div key={i} variants={itemVariants} className="space-y-2">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">{group.cat}</h4>
                <div className="bg-card border shadow-sm rounded-xl overflow-hidden">
                  {group.items.map((item, j) => (
                    <div key={j} className={`flex items-center p-3 ${j !== group.items.length - 1 ? 'border-b border-border/50' : ''}`}>
                      {item.c ? (
                        <CheckCircle2 className="w-4 h-4 text-primary mr-3" />
                      ) : (
                        <Circle className="w-4 h-4 text-muted-foreground mr-3" />
                      )}
                      <span className={`text-sm ${item.c ? 'text-muted-foreground line-through' : 'font-medium'}`}>{item.n}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        );

      case 'documents':
        return (
          <motion.div variants={containerVariants} initial="hidden" animate="show" exit="exit" className="space-y-4">
            <motion.div variants={itemVariants} className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Documents</h3>
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Plus className="w-4 h-4 text-primary" />
              </div>
            </motion.div>

            <div className="space-y-3">
              {[
                { name: 'Passports.pdf', type: 'ID', date: 'Mar 10', size: '2.4 MB' },
                { name: 'Flight_Tickets.pdf', type: 'Transport', date: 'Mar 12', size: '1.1 MB' },
                { name: 'Hotel_Booking.pdf', type: 'Accommodation', date: 'Mar 12', size: '0.8 MB' }
              ].map((doc, i) => (
                <motion.div key={i} variants={itemVariants} className="bg-card border shadow-sm rounded-xl p-3 flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold truncate">{doc.name}</h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{doc.type} • {doc.date}</p>
                  </div>
                  <Download className="w-4 h-4 text-muted-foreground" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 'shared-calendar':
        return (
          <motion.div variants={containerVariants} initial="hidden" animate="show" exit="exit" className="space-y-4">
            <motion.div variants={itemVariants} className="mb-4">
              <h3 className="font-bold text-lg">Timeline</h3>
              <p className="text-xs text-muted-foreground">Everyone's schedule</p>
            </motion.div>

            <div className="relative pl-4 border-l-2 border-muted space-y-6 mt-2">
              {[
                { time: '09:00', name: 'Sarah', act: 'Breakfast', color: 'bg-[hsl(var(--mockup-teal))]' },
                { time: '11:00', name: 'John', act: 'Museum Tour', color: 'bg-[hsl(var(--mockup-orange))]' },
                { time: '14:00', name: 'Emma', act: 'Shopping', color: 'bg-[hsl(var(--mockup-blue))]' },
                { time: '19:00', name: 'All', act: 'Family Dinner', color: 'bg-primary' }
              ].map((event, i) => (
                <motion.div key={i} variants={itemVariants} className="relative">
                  <div className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-background ${event.color}`}></div>
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-bold text-muted-foreground w-10 pt-0.5">{event.time}</span>
                    <div className="bg-card border shadow-sm rounded-xl p-2.5 flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className={`w-1.5 h-1.5 rounded-full ${event.color}`}></div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{event.name}</span>
                      </div>
                      <h4 className="text-sm font-semibold">{event.act}</h4>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative mx-auto w-[300px] h-[600px] bg-black rounded-[3rem] p-3 shadow-2xl border-4 border-gray-800 flex-shrink-0">
      {/* Phone Screen */}
      <div className="bg-background w-full h-full rounded-[2.25rem] overflow-hidden relative flex flex-col">
        
        {/* Notch */}
        <div className="absolute top-0 inset-x-0 h-6 bg-black rounded-b-3xl w-32 mx-auto z-30"></div>
        
        {/* Status Bar */}
        <div className="absolute top-1.5 inset-x-6 flex justify-between items-center text-[10px] font-medium z-20 text-foreground">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* App Header (Mock) */}
        <div className="pt-10 pb-2 px-4 border-b bg-background/80 backdrop-blur-md z-10 flex items-center justify-between">
          <ChevronLeft className="w-5 h-5 text-primary" />
          <span className="text-xs font-bold tracking-wide">VaykAIo</span>
          <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
            <span className="text-[8px] font-bold">U</span>
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 pb-8 bg-muted/10">
          <AnimatePresence mode="wait">
            {renderScreenContent()}
          </AnimatePresence>
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-2 inset-x-0 flex justify-center z-20">
          <div className="w-24 h-1 bg-foreground/20 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default PhoneMockup;
