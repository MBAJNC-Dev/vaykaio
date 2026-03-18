
import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trophy } from 'lucide-react';

const Leaderboards = () => {
  const leaders = [
    { rank: 1, name: 'Alex Johnson', points: 12450, avatar: 'AJ' },
    { rank: 2, name: 'Maya Chen', points: 11200, avatar: 'MC' },
    { rank: 3, name: 'Sarah Williams', points: 9800, avatar: 'SW' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Helmet><title>Leaderboards | Vacation Planner</title></Helmet>
      
      <div className="text-center">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">Global Leaderboard</h1>
        <p className="text-muted-foreground mt-2">Top explorers this month.</p>
      </div>

      <Card className="shadow-lg border-0">
        <CardContent className="p-0">
          <div className="divide-y">
            {leaders.map((user) => (
              <div key={user.rank} className="flex items-center justify-between p-6 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4">
                  <span className={`font-bold text-lg w-6 text-center ${user.rank === 1 ? 'text-amber-500' : user.rank === 2 ? 'text-slate-400' : 'text-amber-700'}`}>
                    #{user.rank}
                  </span>
                  <Avatar><AvatarFallback>{user.avatar}</AvatarFallback></Avatar>
                  <span className="font-semibold">{user.name}</span>
                </div>
                <span className="font-mono font-bold text-primary">{user.points.toLocaleString()} pts</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Leaderboards;
