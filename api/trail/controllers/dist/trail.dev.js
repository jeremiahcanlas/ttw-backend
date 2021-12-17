"use strict";

var _require = require("strapi-utils"),
    parseMultipartData = _require.parseMultipartData,
    sanitizeEntity = _require.sanitizeEntity;
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */


module.exports = {
  create: function create(ctx) {
    var entity, _parseMultipartData, data, files;

    return regeneratorRuntime.async(function create$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!ctx.is("multipart")) {
              _context.next = 8;
              break;
            }

            _parseMultipartData = parseMultipartData(ctx), data = _parseMultipartData.data, files = _parseMultipartData.files;
            data.user = ctx.state.user.id;
            _context.next = 5;
            return regeneratorRuntime.awrap(strapi.services.trail.create(data, {
              files: files
            }));

          case 5:
            entity = _context.sent;
            _context.next = 12;
            break;

          case 8:
            ctx.request.body.user = ctx.state.user.id;
            _context.next = 11;
            return regeneratorRuntime.awrap(strapi.services.trail.create(ctx.request.body));

          case 11:
            entity = _context.sent;

          case 12:
            return _context.abrupt("return", sanitizeEntity(entity, {
              model: strapi.models.trail
            }));

          case 13:
          case "end":
            return _context.stop();
        }
      }
    });
  }
};