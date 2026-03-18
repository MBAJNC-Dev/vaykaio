import pb from '@/lib/pocketbaseClient.js';

class StayAgent {
  constructor() {
    this.status = 'idle';
    this.tripContext = null;
    this.accommodations = [];
  }

  async initialize(trip) {
    this.tripContext = trip;
    this.status = 'active';
    console.log(`StayAgent: Initialized for trip "${trip.title}"`);

    // Load accommodations
    try {
      this.accommodations = await pb.collection('accommodations').getFullList({
        filter: `trip = "${trip.id}"`,
      });
    } catch (e) {
      console.log(`StayAgent: No accommodations found for trip ${trip.id}`);
    }
  }

  async check(tripId) {
    try {
      const accommodations = await pb.collection('accommodations').getFullList({
        filter: `trip = "${tripId}"`,
      });

      const hasAccommodations = accommodations.length > 0;
      const checkInStatus = this.analyzeCheckInStatus(accommodations);
      const upcomingCheckIns = this.getUpcomingCheckIns(accommodations);

      return {
        status: 'ok',
        hasAccommodations,
        accommodationCount: accommodations.length,
        checkInStatus,
        upcomingCheckIns,
      };
    } catch (error) {
      return { status: 'error', error: error.message };
    }
  }

  async getCheckInInfo(tripId) {
    try {
      const accommodations = await pb.collection('accommodations').getFullList({
        filter: `trip = "${tripId}"`,
        sort: 'check_in_date',
      });

      if (accommodations.length === 0) {
        return {
          status: 'no_accommodations',
          message: 'No accommodations booked for this trip',
        };
      }

      const checkInInfo = accommodations.map(acc => ({
        name: acc.name || 'Unnamed Accommodation',
        address: acc.address || 'Address not provided',
        checkInDate: acc.check_in_date,
        checkInTime: acc.check_in_time || '15:00',
        checkOutDate: acc.check_out_date,
        checkOutTime: acc.check_out_time || '11:00',
        confirmationNumber: acc.confirmation_number || 'Not provided',
        phoneNumber: acc.phone_number || 'Not provided',
        specialInstructions: acc.special_instructions || '',
        amenities: acc.amenities || [],
        roomType: acc.room_type || 'Standard',
        numberOfGuests: acc.number_of_guests || 1,
        totalCost: acc.total_cost || 0,
        bookingReference: acc.booking_reference || '',
        earlyCheckInAvailable: acc.early_check_in_available || false,
        lateCheckOutAvailable: acc.late_check_out_available || false,
      }));

      console.log(`StayAgent: Retrieved check-in info for ${accommodations.length} accommodation(s)`);

      return {
        status: 'success',
        accommodations: checkInInfo,
        totalAccommodations: accommodations.length,
        firstCheckIn: checkInInfo[0],
        lastCheckOut: checkInInfo[checkInInfo.length - 1],
      };
    } catch (error) {
      console.error('StayAgent: Error getting check-in info:', error);
      return { status: 'error', error: error.message };
    }
  }

  async handleEvent(event) {
    if (event.type === 'reservation_change') {
      console.log(`StayAgent: Handling reservation change event for ${event.tripId}`);
      const checkInInfo = await this.getCheckInInfo(event.tripId);
      return {
        status: 'processed',
        event: event.type,
        updatedCheckInInfo: checkInInfo,
      };
    }
    if (event.type === 'member_joined') {
      console.log(`StayAgent: Adjusting accommodation for new member in trip ${event.tripId}`);
      return { status: 'processed', event: event.type };
    }
    return { status: 'ignored' };
  }

  getStatus() {
    return {
      name: 'StayAgent',
      status: this.status,
      tripId: this.tripContext?.id || null,
      accommodationsLoaded: this.accommodations.length > 0,
    };
  }

  // Helper methods
  analyzeCheckInStatus(accommodations) {
    if (accommodations.length === 0) return 'no_accommodations';

    const now = new Date();
    const upcoming = accommodations.filter(a => new Date(a.check_in_date) > now);
    const active = accommodations.filter(a => {
      const checkIn = new Date(a.check_in_date);
      const checkOut = new Date(a.check_out_date);
      return checkIn <= now && now <= checkOut;
    });
    const past = accommodations.filter(a => new Date(a.check_out_date) < now);

    return {
      upcoming: upcoming.length,
      active: active.length,
      past: past.length,
      nextCheckIn: upcoming.length > 0 ? upcoming[0].name : null,
    };
  }

  getUpcomingCheckIns(accommodations) {
    const now = new Date();
    const upcoming = accommodations
      .filter(a => new Date(a.check_in_date) > now)
      .sort((a, b) => new Date(a.check_in_date) - new Date(b.check_in_date))
      .slice(0, 5)
      .map(acc => ({
        accommodation: acc.name || 'Unnamed',
        checkInDate: acc.check_in_date,
        checkInTime: acc.check_in_time || '15:00',
        daysUntilCheckIn: Math.ceil((new Date(acc.check_in_date) - now) / (1000 * 60 * 60 * 24)),
      }));

    return upcoming;
  }
}

export default StayAgent;
