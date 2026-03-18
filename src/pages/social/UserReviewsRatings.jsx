
import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, MapPin } from 'lucide-react';

const UserReviewsRatings = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Helmet><title>My Reviews | Vacation Planner</title></Helmet>
      
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">My Reviews & Ratings</h1>
        <p className="text-muted-foreground mt-2">Manage your contributions to the community.</p>
      </div>

      <div className="grid gap-6">
        <Card className="shadow-sm border-0">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg flex items-center gap-2"><MapPin className="w-4 h-4 text-primary"/> The Louvre Museum</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Paris, France • Visited Oct 2023</p>
              </div>
              <div className="flex text-amber-400">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">Absolutely breathtaking. We used the AI planner to find the best time to visit, and it was spot on. Barely any lines at 9 AM on a Wednesday. The Mona Lisa is smaller than you think, but the rest of the museum is massive and gorgeous.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserReviewsRatings;
