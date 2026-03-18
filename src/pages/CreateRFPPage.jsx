
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2, ChevronRight, ChevronLeft, Building2, Users, Calendar, FileText } from 'lucide-react';
import { RFPService } from '@/services/RFPService.js';
import { toast } from 'sonner';

const STEPS = [
  { id: 1, title: 'Group Details', icon: Users },
  { id: 2, title: 'Property', icon: Building2 },
  { id: 3, title: 'Trip Details', icon: Calendar },
  { id: 4, title: 'Requirements', icon: FileText }
];

const CreateRFPPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    groupName: '',
    groupSize: '',
    groupType: 'corporate',
    propertyName: '',
    propertyUrl: '',
    checkInDate: '',
    checkOutDate: '',
    roomsNeeded: '',
    roomTypes: 'Standard Double',
    mealPlan: 'breakfast',
    budgetRange: '',
    specialRequests: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const rfp = await RFPService.createRFP(formData);
      toast.success('RFP Draft Created Successfully!');
      navigate(`/rfp/submission/${rfp.id}`);
    } catch (error) {
      toast.error('Failed to create RFP. Please try again.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <Helmet><title>Create RFP | TravelMatrix</title></Helmet>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Request for Proposal</h1>
        <p className="text-muted-foreground mt-1">Build a comprehensive proposal request for your group booking.</p>
      </div>

      {/* Progress Bar */}
      <div className="flex justify-between items-center mb-8 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted -z-10 rounded-full"></div>
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary -z-10 rounded-full transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
        ></div>
        
        {STEPS.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          
          return (
            <div key={step.id} className="flex flex-col items-center gap-2 bg-background px-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                isActive ? 'border-primary bg-primary text-primary-foreground' : 
                isCompleted ? 'border-primary bg-primary/10 text-primary' : 
                'border-muted bg-background text-muted-foreground'
              }`}>
                {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${isActive || isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                {step.title}
              </span>
            </div>
          );
        })}
      </div>

      <Card className="shadow-lg border-primary/10">
        <form onSubmit={currentStep === STEPS.length ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
          <CardHeader>
            <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
            <CardDescription>Please provide the required information below.</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 min-h-[300px]">
            {currentStep === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <Label htmlFor="groupName">Group Name</Label>
                  <Input id="groupName" name="groupName" value={formData.groupName} onChange={handleInputChange} placeholder="e.g., TechCorp Annual Retreat" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="groupSize">Estimated Group Size</Label>
                    <Input id="groupSize" name="groupSize" type="number" min="1" value={formData.groupSize} onChange={handleInputChange} placeholder="e.g., 50" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Group Type</Label>
                    <Select value={formData.groupType} onValueChange={(v) => handleSelectChange('groupType', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="corporate">Corporate / Business</SelectItem>
                        <SelectItem value="wedding">Wedding</SelectItem>
                        <SelectItem value="family">Family Reunion</SelectItem>
                        <SelectItem value="friends">Friends Group</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <Label htmlFor="propertyName">Target Property Name</Label>
                  <Input id="propertyName" name="propertyName" value={formData.propertyName} onChange={handleInputChange} placeholder="e.g., Grand Hyatt Tokyo" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="propertyUrl">Property Website URL (Optional)</Label>
                  <Input id="propertyUrl" name="propertyUrl" type="url" value={formData.propertyUrl} onChange={handleInputChange} placeholder="https://..." />
                  <p className="text-xs text-muted-foreground">We'll use AI to extract contact information if provided.</p>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="checkInDate">Check-in Date</Label>
                    <Input id="checkInDate" name="checkInDate" type="date" value={formData.checkInDate} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="checkOutDate">Check-out Date</Label>
                    <Input id="checkOutDate" name="checkOutDate" type="date" value={formData.checkOutDate} onChange={handleInputChange} required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="roomsNeeded">Rooms Needed</Label>
                    <Input id="roomsNeeded" name="roomsNeeded" type="number" min="1" value={formData.roomsNeeded} onChange={handleInputChange} placeholder="e.g., 25" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="roomTypes">Preferred Room Types</Label>
                    <Input id="roomTypes" name="roomTypes" value={formData.roomTypes} onChange={handleInputChange} placeholder="e.g., 20 Double, 5 Suites" />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Meal Plan</Label>
                    <Select value={formData.mealPlan} onValueChange={(v) => handleSelectChange('mealPlan', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Room Only</SelectItem>
                        <SelectItem value="breakfast">Bed & Breakfast</SelectItem>
                        <SelectItem value="half-board">Half Board</SelectItem>
                        <SelectItem value="full-board">Full Board</SelectItem>
                        <SelectItem value="all-inclusive">All Inclusive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budgetRange">Budget Range (Per Room/Night)</Label>
                    <Input id="budgetRange" name="budgetRange" value={formData.budgetRange} onChange={handleInputChange} placeholder="e.g., $150 - $250" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialRequests">Special Requests & Meeting Space Needs</Label>
                  <Textarea 
                    id="specialRequests" 
                    name="specialRequests" 
                    value={formData.specialRequests} 
                    onChange={handleInputChange} 
                    placeholder="e.g., Need a conference room for 50 people on day 2, projector required..." 
                    className="h-32"
                  />
                </div>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between border-t pt-6">
            <Button type="button" variant="outline" onClick={handleBack} disabled={currentStep === 1 || isSubmitting}>
              <ChevronLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            
            {currentStep < STEPS.length ? (
              <Button type="submit">
                Next <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Generating RFP...' : 'Review & Generate RFP'}
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CreateRFPPage;
