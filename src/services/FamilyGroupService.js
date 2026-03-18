
import pb from '@/lib/pocketbaseClient';

export const FamilyGroupService = {
  /**
   * Creates a new family group
   */
  createGroup: async (userId, groupName, description = '') => {
    const inviteToken = crypto.randomUUID();
    const group = await pb.collection('family_groups').create({
      user_id: userId,
      group_name: groupName,
      description,
      invite_token: inviteToken
    }, { $autoCancel: false });

    // Add creator as owner
    await pb.collection('family_members').create({
      family_group_id: group.id,
      user_id: userId,
      role: 'owner',
      status: 'active'
    }, { $autoCancel: false });

    return group;
  },

  /**
   * Gets all family groups for the current user
   */
  getUserGroups: async (userId) => {
    const members = await pb.collection('family_members').getFullList({
      filter: `user_id = "${userId}" && status = "active"`,
      expand: 'family_group_id',
      $autoCancel: false
    });
    return members.map(m => m.expand.family_group_id);
  },

  /**
   * Invites a member via email (creates pending record)
   */
  inviteMember: async (groupId, email, role = 'viewer') => {
    const token = crypto.randomUUID();
    return await pb.collection('family_members').create({
      family_group_id: groupId,
      email: email,
      role: role,
      status: 'pending',
      invitation_token: token
    }, { $autoCancel: false });
  }
};
