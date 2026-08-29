
'use strict';

/**
 * blog controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::blog.blog', ({ strapi }) => ({
    // 1. Return all articles for dashboards with their REAL publishedAt status
    async find(ctx) {
        const isDraftQuery = ctx.query.status === 'draft';

        // If it's a standard public request without status=draft, use default behavior
        if (!isDraftQuery) {
            return await super.find(ctx);
        }

        // Fetch all draft records
        const drafts = await strapi.documents('api::blog.blog').findMany({
            status: 'draft',
            populate: '*',
            sort: 'createdAt:desc',
        });

        // Fetch all currently published records to know which ones are truly live
        const published = await strapi.documents('api::blog.blog').findMany({
            status: 'published',
            fields: ['documentId', 'publishedAt'],
        });

        const publishedMap = new Map(published.map((p) => [p.documentId, p.publishedAt]));

        // Map true publishedAt timestamp to each document
        const formatted = drafts.map((draft) => ({
            ...draft,
            publishedAt: publishedMap.get(draft.documentId) || null,
        }));

        return { data: formatted };
    },

    // 2. Create article as draft or published
    async create(ctx) {
        const { data } = ctx.request.body;
        const shouldPublish = ctx.query.status === 'published' || Boolean(data?.publishedAt);

        const { publishedAt, ...cleanData } = data || {};

        const document = await strapi.documents('api::blog.blog').create({
            data: cleanData,
            status: shouldPublish ? 'published' : 'draft',
        });

        return { data: document };
    },

    // 3. Update existing article and publish/unpublish cleanly
    async update(ctx) {
        const { id } = ctx.params;
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
                // Document was already in draft state
            }

            return { data: { ...document, publishedAt: null } };
        }
    },
}));
