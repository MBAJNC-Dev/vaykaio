
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Trash2, Heart, AlertCircle, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

const FamilyMemberProfiles = ({ familyPlanId }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    member_name: '',
    age: '',
    dietary_restrictions: '',
    accessibility_needs: '',
    interests: ''
  });

  useEffect(() => {
    if (familyPlanId) fetchMembers();
  }, [familyPlanId]);

  const fetchMembers = async () => {
    try {
      const records = await pb.collection('FamilyMembers').getFullList({
        filter: `family_plan_id = "${familyPlanId}"`,
        sort: 'age',
        $autoCancel: false
      });
      setMembers(records);
    } catch (error) {
      console.error("Error fetching family members:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      const interestsArray = formData.interests.split(',').map(i => i.trim()).filter(i => i);
      
      await pb.collection('FamilyMembers').create({
        family_plan_id: familyPlanId,
        member_name: formData.member_name,
        age: parseInt(formData.age),
        dietary_restrictions: formData.dietary_restrictions,
        accessibility_needs: formData.accessibility_needs,
        interests: interestsArray
      }, { $autoCancel: false });
      
      toast.success("Family member added");
      setIsAddModalOpen(false);
      setFormData({ member_name: '', age: '', dietary_restrictions: '', accessibility_needs: '', interests: '' });
      fetchMembers();
    } catch (error) {
      toast.error("Failed to add family member");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this family member?")) return;
    try {
      await pb.collection('FamilyMembers').delete(id, { $autoCancel: false });
      toast.success("Member removed");
      fetchMembers();
    } catch (error) {
      toast.error("Failed to remove member");
    }
  };

  const getAgeCategory = (age) => {
    if (age < 3) return "Infant/Toddler";
    if (age < 12) return "Child";
    if (age < 18) return "Teen";
    if (age < 65) return "Adult";
    return "Senior";
  };

  const getAIRecommendations = (age) => {
    if (age < 12) return ["Children's Museum", "Zoo/Aquarium", "Beach Day", "Interactive Parks"];
    if (age < 18) return ["Adventure Sports", "Theme Parks", "Shopping", "Water Activities"];
    return ["Cultural Tours", "Fine Dining", "Historical Sites", "Relaxation/Spa"];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Family Profiles</h2>
          <p className="text-sm text-muted-foreground">Manage preferences and needs for everyone.</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button><UserPlus className="w-4 h-4 mr-2" /> Add Family Member</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Family Member</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddMember} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input required value={formData.member_name} onChange={e => setFormData({...formData, member_name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Age</Label>
                  <Input type="number" required min="0" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Interests (comma separated)</Label>
                <Input value={formData.interests} onChange={e => setFormData({...formData, interests: e.target.value})} placeholder="e.g., Swimming, Museums, Animals" />
              </div>
              <div className="space-y-2">
                <Label>Dietary Restrictions</Label>
                <Input value={formData.dietary_restrictions} onChange={e => setFormData({...formData, dietary_restrictions: e.target.value})} placeholder="e.g., Peanut allergy" />
              </div>
              <div className="space-y-2">
                <Label>Accessibility Needs</Label>
                <Input value={formData.accessibility_needs} onChange={e => setFormData({...formData, accessibility_needs: e.target.value})} placeholder="e.g., Needs stroller access" />
              </div>
              <Button type="submit" className="w-full">Save Profile</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-8">Loading profiles...</div>
        ) : members.length === 0 ? (
          <div className="col-span-full text-center py-12 border border-dashed rounded-xl bg-muted/30">
            <p className="text-muted-foreground">No family members added yet.</p>
          </div>
        ) : (
          members.map(member => (
            <Card key={member.id} className="overflow-hidden flex flex-col">
              <div className="h-2 bg-primary/20 w-full" />
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{member.member_name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Age {member.age} • {getAgeCategory(member.age)}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-destructive h-8 w-8 -mt-2 -mr-2" onClick={() => handleDelete(member.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 flex-1">
                {member.interests && member.interests.length > 0 && (
                  <div>
                    <div className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1"><Heart className="w-3 h-3" /> Interests</div>
                    <div className="flex flex-wrap gap-1">
                      {member.interests.map((interest, i) => (
                        <Badge key={i} variant="secondary" className="text-xs font-normal">{interest}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {(member.dietary_restrictions || member.accessibility_needs) && (
                  <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-md border border-amber-100 dark:border-amber-900/50 space-y-2">
                    <div className="text-xs font-medium text-amber-800 dark:text-amber-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Special Requirements
                    </div>
                    {member.dietary_restrictions && <p className="text-sm text-amber-900 dark:text-amber-400"><span className="font-medium">Diet:</span> {member.dietary_restrictions}</p>}
                    {member.accessibility_needs && <p className="text-sm text-amber-900 dark:text-amber-400"><span className="font-medium">Access:</span> {member.accessibility_needs}</p>}
                  </div>
                )}

                <div className="pt-2 border-t mt-auto">
                  <div className="text-xs font-medium text-primary mb-2 flex items-center gap-1"><Sparkles className="w-3 h-3" /> AI Suggestions</div>
                  <ul className="text-sm text-muted-foreground list-disc list-inside pl-4 space-y-1">
                    {getAIRecommendations(member.age).map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default FamilyMemberProfiles;
