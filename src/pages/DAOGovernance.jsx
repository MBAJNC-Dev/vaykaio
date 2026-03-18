
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Vote, Users, Landmark, FileText } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';

const DAOGovernance = () => {
  const [proposals, setProposals] = useState([]);

  useEffect(() => {
    if (pb.authStore.isValid) {
      pb.collection('dao_proposals').getList(1, 10, {
        sort: '-created',
        $autoCancel: false
      }).then(res => setProposals(res.items)).catch(() => {
        // Mock data
        setProposals([
          { id: '1', title: 'Allocate 50 ETH to Marketing Fund', status: 'active', for_votes: 75, against_votes: 25 },
          { id: '2', title: 'Update Protocol Fee Structure', status: 'passed', for_votes: 90, against_votes: 10 }
        ]);
      });
    }
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      <Helmet><title>DAO Governance</title></Helmet>
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">TravelMatrix DAO</h1>
          <p className="text-muted-foreground mt-1">Participate in decentralized governance and shape the future.</p>
        </div>
        <Button><FileText className="w-4 h-4 mr-2" /> Create Proposal</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl text-primary"><Landmark className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Treasury Balance</p>
              <h3 className="text-2xl font-bold">$1.2M</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500"><Users className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Active Members</p>
              <h3 className="text-2xl font-bold">3,492</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-green-500/10 rounded-xl text-green-500"><Vote className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Your Voting Power</p>
              <h3 className="text-2xl font-bold">1,500 vTRV</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Recent Proposals</h2>
      <div className="space-y-4">
        {proposals.map(proposal => (
          <Card key={proposal.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{proposal.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">Proposal #{proposal.id.slice(0,4)} • Ends in 2 days</p>
                </div>
                <Badge variant={proposal.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                  {proposal.status}
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-green-600">For</span>
                    <span>{proposal.for_votes}%</span>
                  </div>
                  <Progress value={proposal.for_votes} className="h-2 bg-muted [&>div]:bg-green-500" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-red-600">Against</span>
                    <span>{proposal.against_votes}%</span>
                  </div>
                  <Progress value={proposal.against_votes} className="h-2 bg-muted [&>div]:bg-red-500" />
                </div>
              </div>

              {proposal.status === 'active' && (
                <div className="mt-6 flex gap-3">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">Vote For</Button>
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white">Vote Against</Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DAOGovernance;
