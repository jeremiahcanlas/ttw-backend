"use strict";
const { parseMultipartData, sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async create(ctx) {
    let entity;
    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      data.user = ctx.state.user.id;
      entity = await strapi.services.trail.create(data, { files });
    } else {
      ctx.request.body.user = ctx.state.user.id;
      entity = await strapi.services.trail.create(ctx.request.body);
    }
    return sanitizeEntity(entity, { model: strapi.models.trail });
  },
  async delete(ctx) {
    const { id } = ctx.params;
    const entity = await strapi.services.trail.delete({ id });

    // with strapi multiple media
    if (entity) {
      if (entity.images.length >= 1) {
        entity.images.forEach((image) => {
          strapi.plugins.upload.services.upload.remove(image);
        });
      }
    }

    return sanitizeEntity(entity, { model: strapi.models.trail });
  },
};
