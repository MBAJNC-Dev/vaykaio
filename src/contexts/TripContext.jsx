import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const TripContext = createContext(null);

export const useTripContext = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTripContext must be used within a TripProvider');
  }
  return context;
};

export const TripProvider = ({ children, tripId: initialTripId }) => {
  const [currentTrip, setCurrentTrip] = useState(null);
  const [tripMembers, setTripMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tripCache, setTripCache] = useState({});

  const loadTrip = useCallback(async (tripId) => {
    if (!tripId) {
      setCurrentTrip(null);
      setTripMembers([]);
      return;
    }

    // Check cache first
    if (tripCache[tripId]) {
      setCurrentTrip(tripCache[tripId].trip);
      setTripMembers(tripCache[tripId].members);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch trip details
      const trip = await pb.collection('trips').getOne(tripId, {
        $autoCancel: false,
      });

      // Fetch trip members
      let members = [];
      try {
        const membersRecord = await pb.collection('trip_members').getList(1, 50, {
          filter: `trip_id = "${tripId}"`,
          expand: 'user_id',
          $autoCancel: false,
        });
        members = membersRecord.items;
      } catch (err) {
        console.log('No members found or error fetching members');
      }

      setCurrentTrip(trip);
      setTripMembers(members);

      // Cache the data
      setTripCache((prev) => ({
        ...prev,
        [tripId]: { trip, members },
      }));
    } catch (err) {
      console.error('Failed to load trip:', err);
      setError(err.message || 'Failed to load trip');
      toast.error('Failed to load trip information');
    } finally {
      setIsLoading(false);
    }
  }, [tripCache]);

  // Auto-load trip when tripId changes
  useEffect(() => {
    if (initialTripId) {
      loadTrip(initialTripId);
    }
  }, [initialTripId, loadTrip]);

  const value = {
    currentTrip,
    tripMembers,
    loadTrip,
    isLoading,
    error,
    tripId: initialTripId,
  };

  return (
    <TripContext.Provider value={value}>
      {children}
    </TripContext.Provider>
  );
};
