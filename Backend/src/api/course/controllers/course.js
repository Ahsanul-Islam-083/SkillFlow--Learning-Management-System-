'use strict';

/**
 * course controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::course.course', ({ strapi }) => ({
  async find(ctx) {
    const user = ctx.state.user;

    // public user can access all courses
    if (!user) {
      return await super.find(ctx);
    }

    // role checking if the user is an instructor
    const roleName = (user.role?.name || user.role?.type || '').toLowerCase();

    if (roleName === 'instructor') {
      // backend query will automatically filter for this instructor's ID
      ctx.query = {
        ...ctx.query,
        filters: {
          ...(ctx.query?.filters || {}),
          instructor: {
            id: {
              $eq: user.id,
            },
          },
        },
      };
    }

    // for other roles, we can just return all courses without filtering
    return await super.find(ctx);
  },
}));