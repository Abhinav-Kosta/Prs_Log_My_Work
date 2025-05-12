const Award = require("../models/award");
const User = require("../models/user");

module.exports.index = async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    req.flash("error", "User not found.");
    return res.redirect("/");
  }

  const awards = await Award.find({ user: userId }).sort({ date: -1 });

  res.render("awards/index.ejs", {
    user,
    awards
  });
};

module.exports.show = async (req, res) => {
  const { userId, awdId } = req.params;

  const award = await Award.findOne({ _id: awdId, user: userId });
  if (!award) {
    req.flash("error", "Awards not found.");
    return res.redirect("/");
  }

  const user = await User.findById(userId);

  res.render("awards/show.ejs", {
    user,
    award
  });
};