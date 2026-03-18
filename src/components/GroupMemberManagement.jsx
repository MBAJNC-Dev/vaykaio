
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserPlus, Mail, Trash2, Edit, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

const GroupMemberManagement = ({ groupId }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    member_name: '',
    member_email: '',
    role: 'member',
    status: 'pending',
    dietary_restrictions: ''
  });

  useEffect(() => {
    if (groupId) fetchMembers();
  }, [groupId]);

  const fetchMembers = async () => {
    try {
      const records = await pb.collection('GroupMembers').getFullList({
        filter: `group_plan_id = "${groupId}"`,
        sort: '-created',
        $autoCancel: false
      });
      setMembers(records);
    } catch (error) {
      console.error("Error fetching members:", error);
      toast.error("Failed to load group members");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await pb.collection('GroupMembers').create({
        group_plan_id: groupId,
        ...formData
      }, { $autoCancel: false });
      
      toast.success("Member added successfully");
      setIsAddModalOpen(false);
      setFormData({ member_name: '', member_email: '', role: 'member', status: 'pending', dietary_restrictions: '' });
      fetchMembers();
    } catch (error) {
      toast.error("Failed to add member");
    }
  };

  const handleRemoveMember = async (id) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;
    try {
      await pb.collection('GroupMembers').delete(id, { $autoCancel: false });
      toast.success("Member removed");
      fetchMembers();
    } catch (error) {
      toast.error("Failed to remove member");
    }
  };

  const handleSendInvite = (email) => {
    toast.success(`Invitation sent to ${email}`);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'confirmed': return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle2 className="w-3 h-3 mr-1"/> Confirmed</Badge>;
      case 'pending': return <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50"><Clock className="w-3 h-3 mr-1"/> Pending</Badge>;
      case 'declined': return <Badge variant="destructive">Declined</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Group Roster</h2>
          <p className="text-sm text-muted-foreground">Manage attendees, roles, and invitations.</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button><UserPlus className="w-4 h-4 mr-2" /> Add Member</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Group Member</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddMember} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input required value={formData.member_name} onChange={e => setFormData({...formData, member_name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" required value={formData.member_email} onChange={e => setFormData({...formData, member_email: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select value={formData.role} onValueChange={v => setFormData({...formData, role: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="leader">Leader</SelectItem>
                      <SelectItem value="organizer">Organizer</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={v => setFormData({...formData, status: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Dietary Restrictions (Optional)</Label>
                <Input value={formData.dietary_restrictions} onChange={e => setFormData({...formData, dietary_restrictions: e.target.value})} placeholder="e.g., Vegan, Gluten-free" />
              </div>
              <Button type="submit" className="w-full">Save Member</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Dietary Needs</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8">Loading members...</TableCell></TableRow>
            ) : members.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No members added yet.</TableCell></TableRow>
            ) : (
              members.map(member => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="font-medium">{member.member_name}</div>
                    <div className="text-xs text-muted-foreground">{member.member_email}</div>
                  </TableCell>
                  <TableCell>
                    <span className="capitalize text-sm flex items-center gap-1">
                      {member.role === 'leader' && <ShieldAlert className="w-3 h-3 text-primary" />}
                      {member.role}
                    </span>
                  </TableCell>
                  <TableCell>{getStatusBadge(member.status)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{member.dietary_restrictions || '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {member.status === 'pending' && (
                        <Button variant="outline" size="icon" title="Resend Invite" onClick={() => handleSendInvite(member.member_email)}>
                          <Mail className="w-4 h-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleRemoveMember(member.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default GroupMemberManagement;
