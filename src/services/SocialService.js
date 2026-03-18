
import pb from '@/lib/pocketbaseClient';

/**
 * Service for social features: following, sharing, community posts.
 */
export const SocialService = {
  async getFollowers(userId) {
    return await pb.collection('SocialFollows').getFullList({
      filter: `following_id = "${userId}"`,
      expand: 'follower_id',
      $autoCancel: false
    });
  },

  async getFollowing(userId) {
    return await pb.collection('SocialFollows').getFullList({
      filter: `follower_id = "${userId}"`,
      expand: 'following_id',
      $autoCancel: false
    });
  },

  async followUser(followerId, followingId) {
    return await pb.collection('SocialFollows').create({
      follower_id: followerId,
      following_id: followingId
    }, { $autoCancel: false });
  },

  async unfollowUser(followRecordId) {
    return await pb.collection('SocialFollows').delete(followRecordId, { $autoCancel: false });
  },

  async getCommunityFeed(page = 1, perPage = 20) {
    return await pb.collection('CommunityPosts').getList(page, perPage, {
      sort: '-created',
      expand: 'user_id',
      $autoCancel: false
    });
  },

  async createPost(userId, content, media = []) {
    return await pb.collection('CommunityPosts').create({
      user_id: userId,
      content,
      media
    }, { $autoCancel: false });
  }
};
