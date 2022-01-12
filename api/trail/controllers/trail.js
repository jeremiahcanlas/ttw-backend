"use strict";
const { parseMultipartData, sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async create(ctx) {
    let entity;

    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized(`No authorization header found`);
    }

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
  async update(ctx) {
    let entity;
    const { id } = ctx.params;
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized(`No authorization header found`);
    }

    const [trail] = await strapi.services.trail.find({
      id,
      user: user,
    });

    if (!trail) {
      return ctx.unauthorized(`You can't update this entry`);
    }

    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.trail.update({ id }, data, {
        files,
      });
    } else {
      entity = await strapi.services.trail.update({ id }, ctx.request.body);
    }

    return sanitizeEntity(entity, { model: strapi.models.trail });
  },
  async delete(ctx) {
    const { id } = ctx.params;
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized(`No authorization header found`);
    }

    const [trail] = await strapi.services.trail.find({
      id,
      user: user,
    });

    //if trail isnt found, send unauthorized response
    if (!trail) {
      return ctx.unauthorized(`You can't delete this entry`);
    }

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
