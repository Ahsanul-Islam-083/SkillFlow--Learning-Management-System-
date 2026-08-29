'use strict';

/**
 * quiz-submission controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

const getAuthUserWithRole = async (strapi, ctx) => {
    const authUser = ctx.state.user;
    if (!authUser) return null;
    if (authUser.role) return authUser;

    return await strapi.db.query('plugin::users-permissions.user').findOne({
        where: { id: authUser.id },
        populate: ['role'],
    });
};

module.exports = createCoreController('api::quiz-submission.quiz-submission', ({ strapi }) => ({
    async find(ctx) {
        const user = await getAuthUserWithRole(strapi, ctx);
        if (!user) return ctx.unauthorized();

        const roleName = (user?.role?.name || user?.role?.type || '').toLowerCase();
        const isAdmin = roleName === 'admin';
        const isManager = roleName.includes('manager') || roleName.includes('content');
        const isInstructor = roleName.includes('instructor') || roleName.includes('teacher');

        // 1. Admin and Content Manager can see all quiz submissions
        if (isAdmin || isManager) {
            return await super.find(ctx);
        }

        // 2. Instructor can only see submissions from students in their own courses
        if (isInstructor) {
            ctx.query = {
                ...ctx.query,
                filters: {
                    ...(ctx.query?.filters || {}),
                    quiz: {
                        course: {
                            instructor: {
                                id: { $eq: user.id },
                            },
                        },
                    },
                },
            };
            return await super.find(ctx);
        }

        // 3. Student can only see their own submissions
        ctx.query = {
            ...ctx.query,
            filters: {
                ...(ctx.query?.filters || {}),
                student: {
                    id: { $eq: user.id },
                },
            },
        };
        return await super.find(ctx);
    },
}));
