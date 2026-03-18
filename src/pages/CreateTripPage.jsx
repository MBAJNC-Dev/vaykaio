import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ChevronRight, ChevronLeft, Upload, MapPin, Calendar, Info } from 'lucide-react';
import TripService from '@/services/TripService';
import { toast } from 'sonner';
import { useForm, Controller } from 'react-hook-form';

const TRIP_TYPES = [
  { value: 'beach', label: '🏖️ Beach', description: 'Coastal relaxation' },
  { value: 'adventure', label: '⛰️ Adventure', description: 'Outdoor activities' },
  { value: 'city', label: '🏙️ City', description: 'Urban exploration' },
  { value: 'cultural', label: '🏛️ Cultural', description: 'History & heritage' },
  { value: 'family', label: '👨‍👩‍👧‍👦 Family', description: 'Group travel' },
  { value: 'romantic', label: '💑 Romantic', description: 'Couples getaway' },
];

const PACE_OPTIONS = [
  { value: 'relaxed', label: 'Relaxed', description: 'Take it easy, enjoy downtime' },
  { value: 'moderate', label: 'Moderate', description: 'Balanced mix of activities' },
  { value: 'active', label: 'Active', description: 'Packed with experiences' },
];

const INTERESTS = [
  { value: 'food', label: '🍽️ Food & Cuisine' },
  { value: 'culture', label: '🏛️ Culture & History' },
  { value: 'nature', label: '🌿 Nature & Outdoors' },
  { value: 'nightlife', label: '🎉 Nightlife & Entertainment' },
  { value: 'shopping', label: '🛍️ Shopping' },
  { value: 'sports', label: '⚽ Sports & Recreation' },
];

const CreateTripPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1
    destination: '',
    start_date: '',
    end_date: '',
    timezone: 'UTC',
    // Step 2
    name: '',
    description: '',
    cover_image: null,
    trip_type: '',
    // Step 3
    members: [],
    member_email: '',
    member_role: 'member',
    // Step 4
    budget: '',
    pace: 'moderate',
    interests: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, cover_image: file }));
    }
  };

  const handleAddMember = () => {
    if (formData.member_email) {
      setFormData(prev => ({
        ...prev,
        members: [
          ...prev.members,
          { email: prev.member_email, role: prev.member_role }
        ],
        member_email: '',
        member_role: 'member'
      }));
    }
  };

  const handleRemoveMember = (index) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== index)
    }));
  };

  const toggleInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        if (!formData.destination || !formData.start_date || !formData.end_date) {
          toast.error('Please fill in all required fields');
          return false;
        }
        if (new Date(formData.end_date) <= new Date(formData.start_date)) {
          toast.error('End date must be after start date');
          return false;
        }
        return true;
      case 2:
        if (!formData.name || !formData.trip_type) {
          toast.error('Please fill in all required fields');
          return false;
        }
        return true;
      case 3:
        return true;
      case 4:
        if (!formData.budget) {
          toast.error('Please enter a budget');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setLoading(true);
    try {
      // Create the trip
      const tripData = {
        destination: formData.destination,
        name: formData.name,
        description: formData.description,
        start_date: formData.start_date,
        end_date: formData.end_date,
        timezone: formData.timezone,
        trip_type: formData.trip_type,
        budget: Number(formData.budget) || 0,
        pace: formData.pace,
        interests: formData.interests.join(','),
        status: 'planning',
      };

      const newTrip = await TripService.createTrip(tripData);

      // Add members if any
      if (formData.members.length > 0) {
        for (const member of formData.members) {
          try {
            await TripService.inviteMember(newTrip.id, member.email, member.role);
          } catch (error) {
            console.error(`Failed to invite ${member.email}:`, error);
          }
        }
      }

      toast.success('Trip created successfully!');
      navigate(`/trips/${newTrip.id}`);
    } catch (error) {
      console.error('Error creating trip:', error);
      toast.error(error.message || 'Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  const getStepProgress = () => (step / 5) * 100;

  return (
    <>
      <Helmet>
        <title>Create New Trip - VaykAIo</title>
        <meta name="description" content="Create and plan your next adventure with VaykAIo" />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Header />

        <section className="flex-1 bg-gradient-to-b from-slate-50 to-slate-100 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
            {/* Step Indicator */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">Create Your Trip</h1>
                <Badge variant="outline" className="text-base">
                  Step {step} of 5
                </Badge>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getStepProgress()}%` }}
                />
              </div>
            </div>

            <Card className="shadow-lg">
              <CardContent className="pt-8">
                {/* Step 1: Destination & Dates */}
                {step === 1 && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Where are you going?</h2>
                      <p className="text-muted-foreground">Start with your destination and travel dates</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="destination" className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Destination
                      </Label>
                      <Input
                        id="destination"
                        name="destination"
                        placeholder="e.g., Tokyo, Japan"
                        value={formData.destination}
                        onChange={handleInputChange}
                        className="text-base"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="start_date" className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Start Date
                        </Label>
                        <Input
                          id="start_date"
                          name="start_date"
                          type="date"
                          value={formData.start_date}
                          onChange={handleInputChange}
                          className="text-base"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="end_date" className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          End Date
                        </Label>
                        <Input
                          id="end_date"
                          name="end_date"
                          type="date"
                          value={formData.end_date}
                          onChange={handleInputChange}
                          className="text-base"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select value={formData.timezone} onValueChange={(val) => handleSelectChange('timezone', val)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC">UTC</SelectItem>
                          <SelectItem value="EST">EST</SelectItem>
                          <SelectItem value="CST">CST</SelectItem>
                          <SelectItem value="MST">MST</SelectItem>
                          <SelectItem value="PST">PST</SelectItem>
                          <SelectItem value="GMT">GMT</SelectItem>
                          <SelectItem value="CET">CET</SelectItem>
                          <SelectItem value="IST">IST</SelectItem>
                          <SelectItem value="JST">JST</SelectItem>
                          <SelectItem value="AEST">AEST</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* Step 2: Trip Details */}
                {step === 2 && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Trip details</h2>
                      <p className="text-muted-foreground">Give your trip a name and describe it</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name">Trip Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="e.g., Summer Japan Adventure"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="text-base"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Describe your trip goals and ideas..."
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="text-base"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label>Trip Type</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {TRIP_TYPES.map(type => (
                          <button
                            key={type.value}
                            onClick={() => handleSelectChange('trip_type', type.value)}
                            className={`p-3 rounded-lg border-2 text-left transition-all ${
                              formData.trip_type === type.value
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="font-semibold text-sm">{type.label}</div>
                            <div className="text-xs text-muted-foreground">{type.description}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cover_image">Cover Image (Optional)</Label>
                      <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition">
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <label htmlFor="cover_image" className="cursor-pointer">
                          <span className="text-sm font-medium text-blue-600 hover:text-blue-700">
                            Click to upload
                          </span>
                          {formData.cover_image && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {formData.cover_image.name}
                            </p>
                          )}
                        </label>
                        <input
                          id="cover_image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Group Setup */}
                {step === 3 && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Group setup</h2>
                      <p className="text-muted-foreground">Invite members to your trip</p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                      <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-blue-900">
                        You'll be added as the trip organizer. Invite others by email.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="md:col-span-2 space-y-2">
                          <Label htmlFor="member_email">Email</Label>
                          <Input
                            id="member_email"
                            name="member_email"
                            type="email"
                            placeholder="friend@example.com"
                            value={formData.member_email}
                            onChange={handleInputChange}
                            className="text-base"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="member_role">Role</Label>
                          <Select
                            value={formData.member_role}
                            onValueChange={(val) => handleSelectChange('member_role', val)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="member">Member</SelectItem>
                              <SelectItem value="editor">Editor</SelectItem>
                              <SelectItem value="viewer">Viewer</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddMember}
                        className="w-full"
                      >
                        Add Member
                      </Button>
                    </div>

                    {formData.members.length > 0 && (
                      <div className="space-y-2">
                        <Label>Members to Invite ({formData.members.length})</Label>
                        <div className="space-y-2">
                          {formData.members.map((member, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                            >
                              <div>
                                <p className="font-medium text-sm">{member.email}</p>
                                <p className="text-xs text-muted-foreground capitalize">{member.role}</p>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveMember(index)}
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 4: Preferences */}
                {step === 4 && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Preferences</h2>
                      <p className="text-muted-foreground">Tell us about your travel style</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="budget">Budget ($)</Label>
                      <Input
                        id="budget"
                        name="budget"
                        type="number"
                        min="0"
                        step="100"
                        placeholder="5000"
                        value={formData.budget}
                        onChange={handleInputChange}
                        className="text-base"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label>Travel Pace</Label>
                      <div className="grid grid-cols-1 gap-3">
                        {PACE_OPTIONS.map(pace => (
                          <button
                            key={pace.value}
                            onClick={() => handleSelectChange('pace', pace.value)}
                            className={`p-3 rounded-lg border-2 text-left transition-all ${
                              formData.pace === pace.value
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="font-semibold text-sm">{pace.label}</div>
                            <div className="text-xs text-muted-foreground">{pace.description}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>Interests</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {INTERESTS.map(interest => (
                          <button
                            key={interest.value}
                            onClick={() => toggleInterest(interest.value)}
                            className={`p-2 rounded-lg border-2 text-left text-sm transition-all ${
                              formData.interests.includes(interest.value)
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            {interest.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 5: Review */}
                {step === 5 && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Review your trip</h2>
                      <p className="text-muted-foreground">Double-check everything before creating</p>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-slate-50 p-4 rounded-lg space-y-3">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase">Destination</p>
                          <p className="text-lg font-semibold">{formData.destination}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase">Start Date</p>
                            <p className="font-medium">{new Date(formData.start_date).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase">End Date</p>
                            <p className="font-medium">{new Date(formData.end_date).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-lg space-y-3">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase">Trip Name</p>
                          <p className="font-medium">{formData.name}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase">Type</p>
                            <p className="font-medium capitalize">{formData.trip_type}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase">Budget</p>
                            <p className="font-medium">${Number(formData.budget).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-lg space-y-3">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase">Pace</p>
                          <p className="font-medium capitalize">{formData.pace}</p>
                        </div>
                        {formData.interests.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase">Interests</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {formData.interests.map(interest => (
                                <Badge key={interest} variant="secondary">
                                  {INTERESTS.find(i => i.value === interest)?.label}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {formData.members.length > 0 && (
                        <div className="bg-slate-50 p-4 rounded-lg space-y-3">
                          <p className="text-xs font-medium text-muted-foreground uppercase">Members to Invite</p>
                          <div className="space-y-1">
                            {formData.members.map((member, index) => (
                              <p key={index} className="text-sm">
                                {member.email} <span className="text-muted-foreground">({member.role})</span>
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>

              {/* Navigation Buttons */}
              <div className="border-t bg-slate-50 px-8 py-6 flex justify-between items-center rounded-b-lg">
                <Button
                  variant="outline"
                  onClick={() => setStep(Math.max(1, step - 1))}
                  disabled={step === 1}
                  className="gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                <div className="text-sm text-muted-foreground">
                  Step {step} of 5
                </div>

                {step === 5 ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  >
                    {loading ? 'Creating Trip...' : 'Create Trip'}
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      if (validateStep()) {
                        setStep(step + 1);
                      }
                    }}
                    className="gap-2"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default CreateTripPage;
