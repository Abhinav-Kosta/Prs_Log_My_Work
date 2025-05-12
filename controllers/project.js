const Project = require("../models/projectSubmission");
const User = require("../models/user");

module.exports.index = async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    req.flash("error", "User not found.");
    return res.redirect("/");
  }

  const projects = await Project.find({ user: userId }).sort({ date: -1 });

  res.render("projects/index.ejs", {
    user,
    projects
  });
};

module.exports.show = async (req, res) => {
  const { userId, pjtId } = req.params;

  const project = await Project.findOne({ _id: pjtId, user: userId });
  if (!project) {
    req.flash("error", "Projects not found.");
    return res.redirect("/");
  }

  const user = await User.findById(userId);

  res.render("projects/show.ejs", {
    user,
    project
  });
};