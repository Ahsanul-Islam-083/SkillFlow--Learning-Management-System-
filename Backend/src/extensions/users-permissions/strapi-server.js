'use strict';

module.exports = (plugin) => {
  plugin.controllers.user.me = async (ctx) => {
    const authUser = ctx.state.user;
    if (!authUser) {
      return ctx.unauthorized();
    }

    // Strapi DB query দিয়ে ইউজারের সাথে তার রোল সঠিকভাবে পপুলেট করা
    const user = await strapi.db.query('plugin::users-permissions.user').findOne({
      where: { id: authUser.id },
      populate: ['role'],
    });

    if (!user) {
      return ctx.notFound();
    }

    // পাসওয়ার্ড ও সিক্রেট টোকেন রিমুভ করে ক্লিন অবজেক্ট রিটার্ন করা
    const {
      password,
      resetPasswordToken,
      confirmationToken,
      ...cleanUser
    } = user;

    ctx.body = cleanUser;
  };

  return plugin;
};
