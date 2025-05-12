const Publication = require("../models/publish");
const User = require("../models/user");

module.exports.index = async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    req.flash("error", "User not found.");
    return res.redirect("/");
  }

  const publications = await Publication.find({ user: userId }).sort({ publicationDate: -1 });

  res.render("publications/index.ejs", {
    user,
    publications
  });
};

module.exports.show = async (req, res) => {
  const { userId, pubId } = req.params;

  const publication = await Publication.findOne({ _id: pubId, user: userId });
  if (!publication) {
    req.flash("error", "Publication not found.");
    return res.redirect("/");
  }

  const user = await User.findById(userId);

  res.render("publications/show.ejs", {
    user,
    publication
  });
};