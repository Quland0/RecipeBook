import { factories } from '@strapi/strapi';

export default factories.createCoreController(
    'api::recipe.recipe',
    ({ strapi }) => ({
        async create(ctx) {
            const user = ctx.state.user;

            if (!user) {
                return ctx.unauthorized('unauthorized');
            }

            const { data } = ctx.request.body;

            const entity = await strapi.entityService.create(
                'api::recipe.recipe',
                {
                    data: {
                        ...data,
                        author: user.id,
                    },
                }
            );

            return { data: entity };
        },
    })
);