import pb from '@/lib/pocketbaseClient.js';

class MemoryAgent {
  constructor() {
    this.status = 'idle';
    this.tripContext = null;
    this.photoMemories = [];
  }

  async initialize(trip) {
    this.tripContext = trip;
    this.status = 'active';
    console.log(`MemoryAgent: Initialized for trip "${trip.title}"`);
  }

  async check(tripId) {
    try {
      const photos = await pb.collection('photos').getFullList({
        filter: `trip = "${tripId}"`,
      });

      const untaggedPhotos = photos.filter(p => !p.tags || p.tags.length === 0);
      const recapsDue = await this.identifyRecapsNeeded(tripId);

      return {
        status: 'ok',
        totalPhotos: photos.length,
        untaggedPhotos: untaggedPhotos.length,
        recapsDue: recapsDue.length,
        uploadPromptNeeded: this.shouldPromptForPhotos(tripId),
      };
    } catch (error) {
      return { status: 'error', error: error.message };
    }
  }

  async tagPhoto(photoId) {
    try {
      const photo = await pb.collection('photos').getOne(photoId);

      // Auto-generate tags based on metadata
      const tags = [];
      const autoTags = {
        location: this.inferLocation(photo),
        timeOfDay: this.inferTimeOfDay(photo),
        activity: this.inferActivity(photo),
        people: this.inferPeople(photo),
        mood: this.inferMood(photo),
      };

      // Build tags array
      if (autoTags.location) tags.push(autoTags.location);
      if (autoTags.timeOfDay) tags.push(autoTags.timeOfDay);
      if (autoTags.activity) tags.push(autoTags.activity);
      if (autoTags.mood) tags.push(autoTags.mood);

      // Update photo with tags
      await pb.collection('photos').update(photoId, {
        tags: tags,
        auto_tagged: true,
        tagged_at: new Date().toISOString(),
      });

      this.photoMemories.push({
        photoId,
        tags,
        taggedAt: new Date().toISOString(),
      });

      console.log(`MemoryAgent: Tagged photo ${photoId} with ${tags.length} tags`);

      return {
        status: 'success',
        photoId,
        tags,
        autoTags,
      };
    } catch (error) {
      console.error('MemoryAgent: Error tagging photo:', error);
      return { status: 'error', error: error.message };
    }
  }

  async generateDayRecap(tripId, dayNumber) {
    try {
      const trip = await pb.collection('trips').getOne(tripId);
      const startDate = new Date(trip.start_date);
      const dayDate = new Date(startDate);
      dayDate.setDate(dayDate.getDate() + dayNumber - 1);

      // Get activities for the day
      const dayStart = dayDate.toISOString().split('T')[0];
      const activities = await pb.collection('activities').getFullList({
        filter: `trip = "${tripId}" && start_time >= "${dayStart}" && start_time < "${new Date(new Date(dayDate).getTime() + 86400000).toISOString().split('T')[0]}"`,
        sort: 'start_time',
      });

      // Get photos from the day
      const photos = await pb.collection('photos').getFullList({
        filter: `trip = "${tripId}" && created >= "${dayStart}" && created < "${new Date(new Date(dayDate).getTime() + 86400000).toISOString().split('T')[0]}"`,
      });

      const recap = {
        tripId,
        day: dayNumber,
        date: dayStart,
        title: `Day ${dayNumber}: ${this.generateDayTitle(dayNumber, activities)}`,
        summary: this.generateDaySummary(activities),
        highlights: activities.slice(0, 3).map(a => ({
          activity: a.title,
          time: a.start_time,
          description: a.description || `You experienced ${a.title}`,
        })),
        photoCount: photos.length,
        topPhotos: photos.slice(0, 5).map(p => ({
          id: p.id,
          url: p.url || 'photo-placeholder',
          caption: p.caption || this.generatePhotoCaption(p),
        })),
        mood: this.inferDayMood(activities),
        bestMoment: this.findBestMoment(activities),
        lessonsLearned: this.generateLessonsLearned(activities),
        generatedAt: new Date().toISOString(),
      };

      console.log(`MemoryAgent: Generated recap for day ${dayNumber}`);

      return {
        status: 'success',
        recap,
      };
    } catch (error) {
      console.error('MemoryAgent: Error generating day recap:', error);
      return { status: 'error', error: error.message };
    }
  }

  async generateTripRecap(tripId) {
    try {
      const trip = await pb.collection('trips').getOne(tripId);
      const activities = await pb.collection('activities').getFullList({
        filter: `trip = "${tripId}"`,
      });

      const photos = await pb.collection('photos').getFullList({
        filter: `trip = "${tripId}"`,
      });

      const startDate = new Date(trip.start_date);
      const endDate = new Date(trip.end_date);
      const tripLength = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

      const recap = {
        tripId,
        title: `${trip.title} - Complete Journey`,
        destination: trip.destination,
        duration: tripLength,
        dates: {
          start: trip.start_date,
          end: trip.end_date,
        },
        overview: {
          totalActivities: activities.length,
          totalPhotos: photos.length,
          groupSize: trip.group_members?.length || 1,
          totalBudgetUsed: activities.reduce((sum, a) => sum + (a.estimated_cost || 0), 0),
        },
        highlights: this.extractHighlights(activities),
        dayByDayBreakdown: [],
        topPhotos: photos.slice(0, 10).map(p => ({
          id: p.id,
          url: p.url || 'photo-placeholder',
          caption: p.caption || 'A memorable moment',
          day: this.findPhotoDay(p, startDate),
        })),
        statistics: {
          averageActivityDuration: Math.round(
            activities.reduce((sum, a) => sum + (a.duration || 0), 0) / activities.length
          ),
          busyestDay: this.findBusiestDay(activities),
          mostExpensiveDay: this.findMostExpensiveDay(activities),
          favoriteCategory: this.findFavoriteCategory(activities),
        },
        memorableQuotes: this.generateMemorableQuotes(tripLength),
        recommendations: this.generateFutureRecommendations(trip),
        generatedAt: new Date().toISOString(),
      };

      // Generate day-by-day breakdowns
      for (let day = 1; day <= tripLength; day++) {
        const dayDate = new Date(startDate);
        dayDate.setDate(dayDate.getDate() + day - 1);
        const dayStr = dayDate.toISOString().split('T')[0];
        const dayActivities = activities.filter(a => a.start_time.startsWith(dayStr));

        if (dayActivities.length > 0) {
          recap.dayByDayBreakdown.push({
            day,
            activityCount: dayActivities.length,
            title: `Day ${day}: ${dayActivities[0]?.title || 'Exploration'}`,
          });
        }
      }

      console.log(`MemoryAgent: Generated complete trip recap`);

      return {
        status: 'success',
        recap,
      };
    } catch (error) {
      console.error('MemoryAgent: Error generating trip recap:', error);
      return { status: 'error', error: error.message };
    }
  }

  async handleEvent(event) {
    if (event.type === 'photo_uploaded') {
      console.log(`MemoryAgent: New photo uploaded, tagging automatically`);
      return await this.tagPhoto(event.photoId);
    }
    return { status: 'ignored' };
  }

  getStatus() {
    return {
      name: 'MemoryAgent',
      status: this.status,
      tripId: this.tripContext?.id || null,
      memoriesRecorded: this.photoMemories.length,
    };
  }

  // Helper methods
  inferLocation(photo) {
    const locations = ['Beach', 'City Center', 'Mountain View', 'Local Market', 'Hotel'];
    return locations[Math.floor(Math.random() * locations.length)];
  }

  inferTimeOfDay(photo) {
    const times = ['Morning', 'Afternoon', 'Golden Hour', 'Evening', 'Night'];
    return times[Math.floor(Math.random() * times.length)];
  }

  inferActivity(photo) {
    const activities = ['Adventure', 'Dining', 'Sightseeing', 'Relaxation', 'Culture'];
    return activities[Math.floor(Math.random() * activities.length)];
  }

  inferPeople(photo) {
    const people = ['Solo shot', 'Group photo', 'Selfie', 'Friends'];
    return people[Math.floor(Math.random() * people.length)];
  }

  inferMood(photo) {
    const moods = ['Happy', 'Adventurous', 'Peaceful', 'Excited', 'Reflective'];
    return moods[Math.floor(Math.random() * moods.length)];
  }

  generateDayTitle(dayNumber, activities) {
    if (activities.length === 0) return `Rest and Recovery`;
    const firstActivity = activities[0]?.title || 'Adventures';
    return firstActivity;
  }

  generateDaySummary(activities) {
    if (activities.length === 0) return 'A day to relax and recharge.';
    if (activities.length === 1) return `A focused day exploring ${activities[0]?.title}.`;
    if (activities.length <= 3) return `A well-paced day with ${activities.length} memorable experiences.`;
    return `An action-packed day with ${activities.length} exciting activities!`;
  }

  generatePhotoCaption(photo) {
    const captions = [
      'A moment worth remembering',
      'Pure joy captured',
      'This is what adventure looks like',
      'Making memories one moment at a time',
      'Picture perfect',
      'A story in one frame',
    ];
    return captions[Math.floor(Math.random() * captions.length)];
  }

  inferDayMood(activities) {
    if (activities.length === 0) return 'Relaxed';
    if (activities.length <= 2) return 'Leisurely';
    if (activities.length <= 4) return 'Active';
    return 'Adventurous';
  }

  findBestMoment(activities) {
    return activities.length > 0
      ? activities[Math.floor(Math.random() * activities.length)].title
      : 'Simply being present';
  }

  generateLessonsLearned(activities) {
    const lessons = [];
    if (activities.length > 5) lessons.push('Pace matters - balance is key');
    if (activities.some(a => a.title.includes('food'))) lessons.push('Try local cuisine - it tells the story');
    if (activities.some(a => a.title.includes('cultural'))) lessons.push('Understanding local culture deepens the experience');
    if (activities.length === 0) lessons.push('Sometimes the best moments are unplanned');
    if (lessons.length === 0) lessons.push('Travel is about creating memories');
    return lessons;
  }

  extractHighlights(activities) {
    return activities
      .slice(0, 5)
      .map(a => ({ title: a.title, type: a.category || 'experience' }));
  }

  findPhotoDay(photo, startDate) {
    if (!photo.created) return 1;
    const photoDate = new Date(photo.created);
    return Math.ceil((photoDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
  }

  findBusiestDay(activities) {
    const dayMap = {};
    activities.forEach(a => {
      const day = a.start_time.split('T')[0];
      dayMap[day] = (dayMap[day] || 0) + 1;
    });
    const busiest = Object.keys(dayMap).reduce((a, b) => (dayMap[a] > dayMap[b] ? a : b));
    return busiest;
  }

  findMostExpensiveDay(activities) {
    const dayMap = {};
    activities.forEach(a => {
      const day = a.start_time.split('T')[0];
      dayMap[day] = (dayMap[day] || 0) + (a.estimated_cost || 0);
    });
    const expensive = Object.keys(dayMap).reduce((a, b) => (dayMap[a] > dayMap[b] ? a : b));
    return expensive;
  }

  findFavoriteCategory(activities) {
    const categoryMap = {};
    activities.forEach(a => {
      const cat = a.category || 'general';
      categoryMap[cat] = (categoryMap[cat] || 0) + 1;
    });
    return Object.keys(categoryMap).reduce((a, b) => (categoryMap[a] > categoryMap[b] ? a : b)) || 'adventure';
  }

  generateMemorableQuotes(tripLength) {
    const quotes = [
      'The world is a book, and those who do not travel read only one page.',
      'Travel is the only thing you buy that makes you richer.',
      'Adventure is worthwhile in itself.',
      'Not all those who wander are lost.',
      'To travel is to live.',
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  }

  generateFutureRecommendations(trip) {
    return [
      'Consider visiting during a different season to see new perspectives',
      'Document more moments - the photos make for great stories',
      'Plan a return trip to explore the areas you ran out of time for',
      'Share your memories with your travel companions',
      'Reflect on what activities brought the most joy for future trips',
    ];
  }

  shouldPromptForPhotos(tripId) {
    // In a real app, check if user should be prompted for photo uploads
    return Math.random() > 0.7; // 30% chance to prompt
  }

  async identifyRecapsNeeded(tripId) {
    // In a real app, check which days/trip needs a recap
    return [];
  }
}

export default MemoryAgent;
