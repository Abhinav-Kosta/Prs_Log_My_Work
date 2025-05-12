const Patent = require("../models/patent");
const User = require("../models/user");

module.exports.index = async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    req.flash("error", "User not found.");
    return res.redirect("/");
  }

  const patents = await Patent.find({ user: userId }).sort({ date: -1 });

  res.render("patents/index.ejs", {
    user,
    patents
  });
};

module.exports.show = async (req, res) => {
  const { userId, patId } = req.params;

  const patent = await Patent.findOne({ _id: patId, user: userId });
  if (!patent) {
    req.flash("error", "Patents not found.");
    return res.redirect("/");
  }

  const user = await User.findById(userId);

  res.render("patents/show.ejs", {
    user,
    patent
  });
};