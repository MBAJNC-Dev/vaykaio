
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Users, UserPlus, Shield, Settings } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { FamilyGroupService } from '@/services/FamilyGroupService';
import { toast } from 'sonner';

const FamilySharingPage = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState('');

  useEffect(() => {
    const fetchGroups = async () => {
      if (!pb.authStore.isValid) return;
      try {
        const data = await FamilyGroupService.getUserGroups(pb.authStore.model.id);
        setGroups(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  const handleInvite = async (groupId) => {
    if (!newEmail) return;
    try {
      await FamilyGroupService.inviteMember(groupId, newEmail);
      toast.success(`Invitation sent to ${newEmail}`);
      setNewEmail('');
    } catch (error) {
      toast.error('Failed to send invitation');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Helmet><title>Family Sharing | VaykAIo</title></Helmet>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Family Sharing</h1>
            <p className="text-muted-foreground">Manage your private family groups and shared albums.</p>
          </div>
          <Button><Users className="w-4 h-4 mr-2" /> Create Group</Button>
        </div>

        {loading ? (
          <div className="h-64 bg-muted animate-pulse rounded-2xl" />
        ) : groups.length > 0 ? (
          <div className="space-y-8">
            {groups.map(group => (
              <Card key={group.id} className="border-border/50 shadow-sm">
                <CardHeader className="border-b bg-muted/20 pb-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Shield className="w-5 h-5 text-primary" /> {group.group_name}
                    </CardTitle>
                    <Button variant="ghost" size="icon"><Settings className="w-4 h-4" /></Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="mb-8">
                    <h4 className="font-medium mb-4">Invite Member</h4>
                    <div className="flex gap-3 max-w-md">
                      <Input 
                        placeholder="Email address" 
                        type="email" 
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                      />
                      <Button onClick={() => handleInvite(group.id)}><UserPlus className="w-4 h-4 mr-2" /> Invite</Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4">Members</h4>
                    <div className="bg-muted/30 rounded-xl p-4 border text-sm text-muted-foreground">
                      Member list will appear here.
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-card rounded-2xl border border-dashed">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No family groups yet</h3>
            <p className="text-muted-foreground mb-6">Create a group to start sharing photos privately.</p>
            <Button><Users className="w-4 h-4 mr-2" /> Create Family Group</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FamilySharingPage;
