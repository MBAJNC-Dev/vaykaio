import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Plus, BarChart2, Clock, Trash2, Archive } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import GroupService from '@/services/GroupService';

const GroupVoting = ({ groupId }) => {
  const [activeVotes, setActiveVotes] = useState([]);
  const [closedVotes, setClosedVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newVote, setNewVote] = useState({
    question: '',
    options: ['', ''],
    deadline: '',
    voteType: 'single_choice'
  });
  const [expandedVotes, setExpandedVotes] = useState({});

  useEffect(() => {
    if (groupId) fetchVotes();
  }, [groupId]);

  const fetchVotes = async () => {
    setLoading(true);
    try {
      // Fetch all votes for the group
      const allVotes = await pb.collection('group_votes').getFullList({
        filter: `trip_id = "${groupId}"`,
        sort: '-created',
        $autoCancel: false
      });

      // Separate active and closed votes
      const active = [];
      const closed = [];

      for (const vote of allVotes) {
        const results = await GroupService.getVoteResults(vote.id);
        const isExpired = vote.deadline && new Date(vote.deadline) < new Date();

        const voteData = {
          ...vote,
          results,
          isExpired,
          totalVotes: results.totalVotes,
          options: typeof vote.options === 'string' ? JSON.parse(vote.options) : vote.options
        };

        if (vote.status === 'closed' || isExpired) {
          closed.push(voteData);
        } else {
          active.push(voteData);
        }
      }

      setActiveVotes(active);
      setClosedVotes(closed);
    } catch (error) {
      console.error("Error fetching votes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOption = () => {
    setNewVote({
      ...newVote,
      options: [...newVote.options, '']
    });
  };

  const handleRemoveOption = (index) => {
    if (newVote.options.length > 2) {
      setNewVote({
        ...newVote,
        options: newVote.options.filter((_, i) => i !== index)
      });
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...newVote.options];
    newOptions[index] = value;
    setNewVote({ ...newVote, options: newOptions });
  };

  const handleCreateVote = async (e) => {
    e.preventDefault();
    const validOptions = newVote.options.filter(o => o.trim() !== '');
    if (validOptions.length < 2) {
      toast.error("Please provide at least 2 options");
      return;
    }
    if (!newVote.question.trim()) {
      toast.error("Please enter a question");
      return;
    }

    try {
      await GroupService.createVote(groupId, {
        question: newVote.question,
        options: validOptions,
        deadline: newVote.deadline || null,
        voteType: newVote.voteType
      });

      toast.success("Vote created successfully!");
      setIsAddModalOpen(false);
      setNewVote({
        question: '',
        options: ['', ''],
        deadline: '',
        voteType: 'single_choice'
      });
      fetchVotes();
    } catch (error) {
      toast.error("Failed to create vote");
      console.error(error);
    }
  };

  const handleVote = async (voteId, optionIndex, option) => {
    if (!pb.authStore.isValid) {
      toast.error("Please log in to vote");
      return;
    }

    try {
      await GroupService.castVote(voteId, pb.authStore.model.id, option);
      toast.success("Vote recorded!");
      fetchVotes();
    } catch (error) {
      toast.error("Failed to record vote");
      console.error(error);
    }
  };

  const handleCloseVote = async (voteId) => {
    try {
      await GroupService.closeVote(voteId);
      toast.success("Vote closed");
      fetchVotes();
    } catch (error) {
      toast.error("Failed to close vote");
    }
  };

  const toggleVoteExpanded = (voteId) => {
    setExpandedVotes(prev => ({
      ...prev,
      [voteId]: !prev[voteId]
    }));
  };

  const getTimeRemaining = (deadline) => {
    if (!deadline) return null;
    const now = new Date();
    const end = new Date(deadline);
    const diff = end - now;

    if (diff < 0) return 'Ended';
    if (diff < 60000) return 'Less than 1 min';
    if (diff < 3600000) return `${Math.round(diff / 60000)} min left`;
    if (diff < 86400000) return `${Math.round(diff / 3600000)} hours left`;
    return `${Math.round(diff / 86400000)} days left`;
  };

  const VoteCard = ({ vote, isClosed }) => {
    const currentUserVoted = vote.results?.voters?.includes(pb.authStore.model?.id);

    return (
      <Card className={`${isClosed ? 'opacity-75' : ''} overflow-hidden hover:shadow-md transition-shadow`}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <div className="flex items-start gap-2">
                <CardTitle className="text-lg leading-tight flex-1">{vote.question}</CardTitle>
                {isClosed && <Badge variant="secondary" className="shrink-0">Closed</Badge>}
              </div>
              {vote.deadline && !isClosed && (
                <CardDescription className="flex items-center gap-1 text-xs mt-1">
                  <Clock className="w-3 h-3" />
                  {getTimeRemaining(vote.deadline)}
                </CardDescription>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {vote.options.map((option, idx) => {
            const count = vote.results?.tallies?.[option]?.count || 0;
            const percentage = vote.results?.tallies?.[option]?.percentage || 0;
            const isMyVote = currentUserVoted && vote.results?.tallies?.[option]?.voters?.includes(pb.authStore.model?.id);

            return (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm flex items-center gap-2">
                    {option}
                    {isMyVote && <CheckCircle2 className="w-4 h-4 text-primary" />}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {percentage}% ({count})
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={percentage} className="h-2 flex-1" />
                  {!isClosed && (
                    <Button
                      variant={isMyVote ? "secondary" : "outline"}
                      size="sm"
                      className="h-7 text-xs shrink-0"
                      onClick={() => handleVote(vote.id, idx, option)}
                    >
                      {isMyVote ? 'Voted' : 'Vote'}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>

        <CardFooter className="pt-0 border-t flex justify-between items-center text-xs text-muted-foreground">
          <span>Total votes: {vote.totalVotes}</span>
          {!isClosed && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCloseVote(vote.id)}
            >
              <Archive className="w-3 h-3 mr-1" /> Close
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Group Decisions</h2>
          <p className="text-sm text-muted-foreground mt-1">Vote on activities, accommodations, and trip details.</p>
        </div>

        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="w-full md:w-auto">
              <Plus className="w-4 h-4 mr-2" /> Create Vote
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Vote</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleCreateVote} className="space-y-6 pt-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-2">
                <Label htmlFor="question">Question *</Label>
                <Input
                  id="question"
                  required
                  value={newVote.question}
                  onChange={e => setNewVote({ ...newVote, question: e.target.value })}
                  placeholder="What should we do? (e.g., Which hotel should we book?)"
                  className="text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="voteType">Vote Type</Label>
                <select
                  id="voteType"
                  value={newVote.voteType}
                  onChange={e => setNewVote({ ...newVote, voteType: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                >
                  <option value="single_choice">Single Choice</option>
                  <option value="multiple_choice">Multiple Choice</option>
                  <option value="ranked_choice">Ranked Choice</option>
                </select>
              </div>

              <div className="space-y-3">
                <Label>Options (minimum 2) *</Label>
                {newVote.options.map((opt, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      value={opt}
                      onChange={e => handleOptionChange(idx, e.target.value)}
                      placeholder={`Option ${idx + 1}`}
                      className="text-base flex-1"
                    />
                    {newVote.options.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveOption(idx)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddOption}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Option
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline (Optional)</Label>
                <Input
                  id="deadline"
                  type="datetime-local"
                  value={newVote.deadline}
                  onChange={e => setNewVote({ ...newVote, deadline: e.target.value })}
                />
              </div>

              <Button type="submit" className="w-full" size="lg">
                Create Vote
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">
            Active ({activeVotes.length})
          </TabsTrigger>
          <TabsTrigger value="closed">
            Closed ({closedVotes.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">Loading votes...</div>
            ) : activeVotes.length === 0 ? (
              <div className="text-center py-12 border border-dashed rounded-xl bg-muted/30">
                <BarChart2 className="w-12 h-12 mx-auto text-muted-foreground opacity-20 mb-3" />
                <p className="text-muted-foreground mb-4">No active votes yet!</p>
                <Button onClick={() => setIsAddModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" /> Create the first vote
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeVotes.map(vote => (
                  <VoteCard key={vote.id} vote={vote} isClosed={false} />
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="closed" className="mt-6">
          <div className="space-y-4">
            {closedVotes.length === 0 ? (
              <div className="text-center py-12 border border-dashed rounded-xl bg-muted/30">
                <BarChart2 className="w-12 h-12 mx-auto text-muted-foreground opacity-20 mb-3" />
                <p className="text-muted-foreground">No closed votes yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {closedVotes.map(vote => (
                  <VoteCard key={vote.id} vote={vote} isClosed={true} />
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GroupVoting;
