const Academic = require("../models/academicEvent");
const User = require("../models/user");

module.exports.index = async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    req.flash("error", "User not found.");
    return res.redirect("/");
  }

  const academics = await Academic.find({ user: userId }).sort({ date: -1 });

  res.render("academics/index.ejs", {
    user,
    academics
  });
};

module.exports.show = async (req, res) => {
  const { userId, acdId } = req.params;

  const academic = await Academic.findOne({ _id: acdId, user: userId });
  if (!academic) {
    req.flash("error", "Academics not found.");
    return res.redirect("/");
  }

  const user = await User.findById(userId);

  res.render("academics/show.ejs", {
    user,
    academic
  });
};