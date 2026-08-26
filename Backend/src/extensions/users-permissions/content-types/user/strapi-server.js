module.exports = (plugin) => {
  plugin.controllers.user.me = async (ctx) => {
    if (!ctx.state.user) {
      return ctx.unauthorized();
    }

    // Fetch the user with the role populated from the database
    const user = await strapi.db.query("plugin::users-permissions.user").findOne({
      where: { id: ctx.state.user.id },
      populate: { role: true },
    });

    return user;
  };

  return plugin;
};