
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Bell, Shield, Key, Loader2, Upload, Trash2, Plane, Eye, Lock, Zap } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const SettingsPage = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    bio: currentUser?.bio || '',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(
    currentUser?.avatar ? pb.files.getUrl(currentUser, currentUser.avatar) : ''
  );
  const [notificationSettings, setNotificationSettings] = useState({
    tripReminders: true,
    familyUpdates: true,
    marketing: false,
    urgentOnly: false,
    quietHours: false,
    digest: true,
  });
  const [aiPreferences, setAiPreferences] = useState({
    pace: 'moderate',
    interests: 'culture,food,nature',
    dietaryRestrictions: 'none',
    accessibility: false,
  });
  const [privacySettings, setPrivacySettings] = useState({
    publicProfile: true,
    photoSharing: true,
  });

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', profileData.name);
      formData.append('bio', profileData.bio);
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      await pb.collection('users').update(currentUser.id, formData, { $autoCancel: false });
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationChange = (key) => {
    setNotificationSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAIPreferenceChange = (key, value) => {
    setAiPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handlePrivacyChange = (key) => {
    setPrivacySettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      <Helmet><title>Settings - VaykAIo</title></Helmet>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Plane className="w-5 h-5 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
            </div>
            <p className="text-muted-foreground text-lg">Manage your VaykAIo preferences and account settings.</p>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto p-1 bg-muted/40 rounded-xl mb-8 border border-border/50">
              <TabsTrigger value="profile" className="py-3 rounded-lg text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm"><User className="w-4 h-4 mr-2" /> Profile</TabsTrigger>
              <TabsTrigger value="notifications" className="py-3 rounded-lg text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm"><Bell className="w-4 h-4 mr-2" /> Notifications</TabsTrigger>
              <TabsTrigger value="ai" className="py-3 rounded-lg text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm"><Zap className="w-4 h-4 mr-2" /> AI</TabsTrigger>
              <TabsTrigger value="privacy" className="py-3 rounded-lg text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm"><Shield className="w-4 h-4 mr-2" /> Privacy</TabsTrigger>
              <TabsTrigger value="account" className="py-3 rounded-lg text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm"><Key className="w-4 h-4 mr-2" /> Account</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card className="shadow-sm border-border/50">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2"><User className="w-5 h-5" /> Profile Information</CardTitle>
                  <CardDescription>Update your public profile details that others will see.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={saveProfile} className="space-y-8">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      <Avatar className="w-28 h-28 border-4 border-primary/10 shadow-lg">
                        <AvatarImage src={avatarPreview} />
                        <AvatarFallback className="text-2xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary font-bold">{profileData.name.charAt(0) || 'V'}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col gap-3 flex-1">
                        <Label htmlFor="avatar-upload" className="cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-secondary text-secondary-foreground hover:bg-secondary/90 h-10 px-4 py-2 w-fit">
                          <Upload className="w-4 h-4 mr-2" /> Change Avatar
                        </Label>
                        <Input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                        <p className="text-xs text-muted-foreground">JPG, GIF or PNG. Max 5MB.</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" name="name" value={profileData.name} onChange={handleProfileChange} className="h-11 rounded-lg" placeholder="Your name" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input id="email" name="email" value={profileData.email} disabled className="h-11 bg-muted/50 rounded-lg" />
                          <p className="text-xs text-muted-foreground">Contact support to change email.</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Input id="bio" name="bio" value={profileData.bio} onChange={handleProfileChange} className="h-11 rounded-lg" placeholder="Tell us about yourself..." maxLength="160" />
                        <p className="text-xs text-muted-foreground">{profileData.bio.length}/160 characters</p>
                      </div>
                    </div>

                    <Button type="submit" disabled={loading} size="lg" className="rounded-lg">
                      {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : 'Save Profile'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-border/50">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">Subscription & Accounts</CardTitle>
                  <CardDescription>Manage your subscription plan and connected accounts.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border border-primary/20 bg-primary/5 rounded-lg space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">Free Plan</h4>
                        <p className="text-sm text-muted-foreground">Upgrade to access advanced features</p>
                      </div>
                      <Button variant="outline" size="sm" className="rounded-lg">Upgrade</Button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Connected Accounts</h4>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm">Google Calendar</span>
                      <Button variant="outline" size="sm" className="rounded-lg">Connect</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm">Apple Calendar</span>
                      <Button variant="outline" size="sm" className="rounded-lg">Connect</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <Card className="shadow-sm border-border/50">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2"><Bell className="w-5 h-5" /> Notification Preferences</CardTitle>
                  <CardDescription>Control what notifications you receive and when.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm">Notification Types</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                        <div className="flex flex-col space-y-1">
                          <Label className="text-base font-semibold">Trip Reminders</Label>
                          <span className="text-sm text-muted-foreground">Upcoming activities and flights.</span>
                        </div>
                        <Switch checked={notificationSettings.tripReminders} onCheckedChange={() => handleNotificationChange('tripReminders')} />
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                        <div className="flex flex-col space-y-1">
                          <Label className="text-base font-semibold">Family Updates</Label>
                          <span className="text-sm text-muted-foreground">When group members update itineraries.</span>
                        </div>
                        <Switch checked={notificationSettings.familyUpdates} onCheckedChange={() => handleNotificationChange('familyUpdates')} />
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                        <div className="flex flex-col space-y-1">
                          <Label className="text-base font-semibold">Discovery Recommendations</Label>
                          <span className="text-sm text-muted-foreground">Personalized travel suggestions.</span>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                        <div className="flex flex-col space-y-1">
                          <Label className="text-base font-semibold">Marketing & Tips</Label>
                          <span className="text-sm text-muted-foreground">Travel tips, offers, and inspiration.</span>
                        </div>
                        <Switch checked={notificationSettings.marketing} onCheckedChange={() => handleNotificationChange('marketing')} />
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6 space-y-3">
                    <h3 className="font-semibold text-sm">Urgency & Frequency</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                        <div className="flex flex-col space-y-1">
                          <Label className="text-base font-semibold">Urgent Only</Label>
                          <span className="text-sm text-muted-foreground">Only urgent notifications (24h before trip).</span>
                        </div>
                        <Switch checked={notificationSettings.urgentOnly} onCheckedChange={() => handleNotificationChange('urgentOnly')} />
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                        <div className="flex flex-col space-y-1">
                          <Label className="text-base font-semibold">Daily Digest</Label>
                          <span className="text-sm text-muted-foreground">Summary email once per day.</span>
                        </div>
                        <Switch checked={notificationSettings.digest} onCheckedChange={() => handleNotificationChange('digest')} />
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                        <div className="flex flex-col space-y-1">
                          <Label className="text-base font-semibold">Quiet Hours</Label>
                          <span className="text-sm text-muted-foreground">No notifications 10 PM - 8 AM.</span>
                        </div>
                        <Switch checked={notificationSettings.quietHours} onCheckedChange={() => handleNotificationChange('quietHours')} />
                      </div>
                    </div>
                  </div>

                  <Button className="w-full rounded-lg">Save Preferences</Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* AI Preferences Tab */}
            <TabsContent value="ai" className="space-y-6">
              <Card className="shadow-sm border-border/50">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2"><Zap className="w-5 h-5" /> AI Preferences</CardTitle>
                  <CardDescription>Customize how VaykAIo plans your vacations.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="pace" className="text-base font-semibold">Pace Preference</Label>
                    <select id="pace" value={aiPreferences.pace} onChange={(e) => handleAIPreferenceChange('pace', e.target.value)} className="w-full px-4 py-3 border rounded-lg bg-background">
                      <option value="relaxed">Relaxed (less activities, more rest)</option>
                      <option value="moderate">Moderate (balanced activities)</option>
                      <option value="adventurous">Adventurous (packed schedule)</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="interests" className="text-base font-semibold">Interests</Label>
                    <Input id="interests" value={aiPreferences.interests} onChange={(e) => handleAIPreferenceChange('interests', e.target.value)} className="h-11 rounded-lg" placeholder="e.g., culture, food, nature, hiking" />
                    <p className="text-xs text-muted-foreground">Comma-separated list of interests</p>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="dietary" className="text-base font-semibold">Dietary Restrictions</Label>
                    <select id="dietary" value={aiPreferences.dietaryRestrictions} onChange={(e) => handleAIPreferenceChange('dietaryRestrictions', e.target.value)} className="w-full px-4 py-3 border rounded-lg bg-background">
                      <option value="none">None</option>
                      <option value="vegetarian">Vegetarian</option>
                      <option value="vegan">Vegan</option>
                      <option value="glutenfree">Gluten-Free</option>
                      <option value="halal">Halal</option>
                      <option value="kosher">Kosher</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="flex flex-col space-y-1">
                      <Label className="text-base font-semibold">Accessibility Features</Label>
                      <span className="text-sm text-muted-foreground">Suggest wheelchair-accessible locations.</span>
                    </div>
                    <Switch checked={aiPreferences.accessibility} onChange={(checked) => handleAIPreferenceChange('accessibility', checked)} />
                  </div>

                  <Button className="w-full rounded-lg">Save AI Preferences</Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy Tab */}
            <TabsContent value="privacy" className="space-y-6">
              <Card className="shadow-sm border-border/50">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2"><Eye className="w-5 h-5" /> Privacy Settings</CardTitle>
                  <CardDescription>Control your data sharing and profile visibility.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm">Profile Visibility</h3>
                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                      <div className="flex flex-col space-y-1">
                        <Label className="text-base font-semibold">Public Profile</Label>
                        <span className="text-sm text-muted-foreground">Others can find and view your profile.</span>
                      </div>
                      <Switch checked={privacySettings.publicProfile} onCheckedChange={() => handlePrivacyChange('publicProfile')} />
                    </div>
                  </div>

                  <div className="border-t pt-6 space-y-3">
                    <h3 className="font-semibold text-sm">Photo & Trip Sharing</h3>
                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                      <div className="flex flex-col space-y-1">
                        <Label className="text-base font-semibold">Share Trip Photos</Label>
                        <span className="text-sm text-muted-foreground">Allow photo sharing in group trips.</span>
                      </div>
                      <Switch checked={privacySettings.photoSharing} onCheckedChange={() => handlePrivacyChange('photoSharing')} />
                    </div>
                  </div>

                  <Button className="w-full rounded-lg">Save Privacy Settings</Button>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-border/50">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">Data Management</CardTitle>
                  <CardDescription>Export or delete your data.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full rounded-lg justify-start">
                    <Lock className="w-4 h-4 mr-2" /> Export Your Data
                  </Button>
                  <Button variant="outline" className="w-full rounded-lg justify-start">
                    <Trash2 className="w-4 h-4 mr-2" /> Download GDPR Report
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Account Tab */}
            <TabsContent value="account" className="space-y-6">
              <Card className="shadow-sm border-border/50">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2"><Key className="w-5 h-5" /> Account Security</CardTitle>
                  <CardDescription>Manage your account access and security.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full rounded-lg justify-start">
                    <Lock className="w-4 h-4 mr-2" /> Change Password
                  </Button>
                  <Button variant="outline" className="w-full rounded-lg justify-start">
                    <Shield className="w-4 h-4 mr-2" /> Two-Factor Authentication
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-destructive/20 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-destructive flex items-center gap-2"><Trash2 className="w-5 h-5" /> Danger Zone</CardTitle>
                  <CardDescription>Irreversible actions for your account.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-4 border border-destructive/20 bg-destructive/5 rounded-lg space-y-3">
                      <div>
                        <h4 className="font-semibold text-destructive">Delete Account</h4>
                        <p className="text-sm text-muted-foreground mt-1">Permanently delete your account and all associated data. This action cannot be undone.</p>
                      </div>
                      <Button variant="destructive" className="w-full rounded-lg">
                        <Trash2 className="w-4 h-4 mr-2" /> Delete Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
