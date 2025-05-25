const Project = require("../models/projectSubmission");
const User = require("../models/user");
const getDateRange = require("../utils/dateRange"); //For filter purpose

module.exports.index = async (req, res) => {
  const { userId } = req.params;
  const { range = 'all', year, month, quarter, half } = req.query;

  const user = await User.findById(userId);
  if (!user) {
    req.flash("error", "User not found.");
    return res.redirect("/");
  }

  const dateFilter = getDateRange(range, parseInt(year), parseInt(month), parseInt(quarter), parseInt(half));
  const filter = dateFilter.$gte ? { user: userId, dateOfSubmission: dateFilter } : { user: userId };

  const projects = await Project.find(filter).sort({ dateOfSubmission: -1 });

  res.render("projects/index.ejs", {
    user,
    projects,
    range,
    year,
    month,
    quarter,
    half
  });
};

module.exports.show = async (req, res) => {
  const { userId, pjtId } = req.params;
  const { range, year, month, quarter, half } = req.query;

  const project = await Project.findOne({ _id: pjtId, user: userId });
  if (!project) {
    req.flash("error", "Projects not found.");
    return res.redirect("/");
  }

  const user = await User.findById(userId);

  res.render("projects/show.ejs", {
    user,
    project,
    range,
    year,
    month,
    quarter,
    half
  });
};