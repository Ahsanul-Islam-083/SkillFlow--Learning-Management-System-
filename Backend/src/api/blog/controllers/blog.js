'use strict';

/**
 * blog controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

// Helper to fetch user along with their role
const getAuthUserWithRole = async (strapi, ctx) => {
    const authUser = ctx.state.user;
    if (!authUser) return null;

    if (authUser.role) return authUser;

    return await strapi.db.query('plugin::users-permissions.user').findOne({
        where: { id: authUser.id },
        populate: ['role'],
    });
};

module.exports = createCoreController('api::blog.blog', ({ strapi }) => ({
    // 1. Content managers see ONLY their own blogs; Admins see ALL
    async find(ctx) {
        const isDraftQuery = ctx.query.status === 'draft';

        // For public visitor queries (not studio dashboard)
        if (!isDraftQuery && !ctx.state.user) {
            return await super.find(ctx);
        }

        const user = await getAuthUserWithRole(strapi, ctx);
        const roleName = (user?.role?.name || user?.role?.type || '').toLowerCase();
        const isAdmin = roleName === 'admin';

        // Content manager filter: only their own blogs
        const authorFilter = (!isAdmin && user)
            ? { author: { id: { $eq: user.id } } }
            : {};

        // Fetch drafts matching author filter
        const drafts = await strapi.documents('api::blog.blog').findMany({
            status: 'draft',
            populate: '*',
            sort: 'createdAt:desc',
            filters: authorFilter,
        });

        // Fetch published to match real published status
        const published = await strapi.documents('api::blog.blog').findMany({
            status: 'published',
            fields: ['documentId', 'publishedAt'],
            filters: authorFilter,
        });

        const publishedMap = new Map(published.map((p) => [p.documentId, p.publishedAt]));

        const formatted = drafts.map((draft) => ({
            ...draft,
            publishedAt: publishedMap.get(draft.documentId) || null,
        }));

        return { data: formatted };
    },

    // 2. Automatically bind logged-in user as author
    async create(ctx) {
        const user = ctx.state.user;
        if (!user) return ctx.unauthorized();

        const { data } = ctx.request.body;
        const shouldPublish = ctx.query.status === 'published' || Boolean(data?.publishedAt);

        const { publishedAt, ...cleanData } = data || {};

        const document = await strapi.documents('api::blog.blog').create({
            data: {
                ...cleanData,
                author: user.id, // Enforce author ownership
            },
            status: shouldPublish ? 'published' : 'draft',
        });

        return { data: document };
    },

    // 3. Prevent editing other users' blogs
    async update(ctx) {
        const { id } = ctx.params;
        const user = await getAuthUserWithRole(strapi, ctx);
        if (!user) return ctx.unauthorized();

        const roleName = (user?.role?.name || user?.role?.type || '').toLowerCase();
        const isAdmin = roleName === 'admin';

        // Fetch target article to check ownership
        const existing = await strapi.documents('api::blog.blog').findOne({
            documentId: id,
            populate: ['author'],
        });

        if (!existing) return ctx.notFound('Article not found.');

        // Check ownership: non-admins cannot edit someone else's blog
        if (!isAdmin && existing.author?.id !== user.id) {
            return ctx.forbidden('You do not have permission to edit this article.');
        }

        const { data } = ctx.request.body;
        const shouldPublish = ctx.query.status === 'published' || Boolean(data?.publishedAt);
        const { publishedAt, ...cleanData } = data || {};

        if (shouldPublish) {
            const document = await strapi.documents('api::blog.blog').update({
                documentId: id,
                data: cleanData,
                status: 'published',
            });
            return { data: document };
        } else {
            const document = await strapi.documents('api::blog.blog').update({
                documentId: id,
                data: cleanData,
                status: 'draft',
            });

            try {
                await strapi.documents('api::blog.blog').unpublish({
                    documentId: id,
                });
            } catch (err) {
                // Already a draft
            }

            return { data: { ...document, publishedAt: null } };
        }
    },

    // 4. Prevent deleting other users' blogs
    async delete(ctx) {
        const { id } = ctx.params;
        const user = await getAuthUserWithRole(strapi, ctx);
        if (!user) return ctx.unauthorized();

        const roleName = (user?.role?.name || user?.role?.type || '').toLowerCase();
        const isAdmin = roleName === 'admin';

        // Fetch target article to check ownership
        const existing = await strapi.documents('api::blog.blog').findOne({
            documentId: id,
            populate: ['author'],
        });

        if (!existing) return ctx.notFound('Article not found.');

        // Check ownership: non-admins cannot delete someone else's blog
        if (!isAdmin && existing.author?.id !== user.id) {
            return ctx.forbidden('You do not have permission to delete this article.');
        }

        const document = await strapi.documents('api::blog.blog').delete({
            documentId: id,
        });

        return { data: document };
    },
}));
