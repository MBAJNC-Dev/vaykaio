
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, MapPin } from 'lucide-react';
import { format } from 'date-fns';

const TripCard = ({ trip, onDelete }) => {
  const statusColors = {
    planning: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
    booked: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
    completed: 'bg-green-500/10 text-green-700 border-green-500/20',
  };

  return (
    <Card className="h-full flex flex-col transition-all duration-200 hover:shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            <CardTitle className="text-xl">{trip.destination}</CardTitle>
          </div>
          <Badge className={statusColors[trip.status] || statusColors.planning}>
            {trip.status || 'planning'}
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-2 mt-2">
          <Calendar className="w-4 h-4" />
          {format(new Date(trip.start_date), 'MMM d, yyyy')} - {format(new Date(trip.end_date), 'MMM d, yyyy')}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>{trip.travelers_count} {trip.travelers_count === 1 ? 'traveler' : 'travelers'}</span>
        </div>
        <div className="mt-2 text-sm">
          <span className="font-medium">Budget:</span> ${trip.budget?.toLocaleString() || '0'}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 mt-auto">
        <Button asChild className="flex-1" size="sm">
          <Link to={`/trip/${trip.id}`}>View Trip</Link>
        </Button>
        <Button variant="outline" size="sm" onClick={() => onDelete && onDelete(trip.id)}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TripCard;
