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

module.exports.summaryIndex = async (req, res) => {
  const { userId, department } = req.params;
  const { range = "all", year, month, quarter, half } = req.query;

  const dateFilter = getDateRange(range, parseInt(year), parseInt(month), parseInt(quarter), parseInt(half));
  let filter = dateFilter.$gte ? { dateOfSubmission: dateFilter } : {};

  let user = null;
  let projects = [];

  // Faculty-specific
  if (userId && userId !== "school" && userId !== "department") {
    user = await User.findById(userId);
    if (!user) {
      req.flash("error", "User not found.");
      return res.redirect("/");
    }
    filter.user = userId;
    projects = await Project.find(filter).sort({ dateOfSubmission: -1 });
  }

  // Department-wide
  else if (department) {
    const usersInDept = await User.find({ department }).select("_id name");
    const userIds = usersInDept.map(u => u._id);
    filter.user = { $in: userIds };
    projects = await Project.find(filter).sort({ dateOfSubmission: -1 });
  }

  // School-wide
  else {
    const hoiSchool = req.user.school;
    const usersInSchool = await User.find({ school: hoiSchool }).select("_id name");
    const userIds = usersInSchool.map(u => u._id);
    filter.user = { $in: userIds };
    projects = await Project.find(filter).sort({ dateOfSubmission: -1 });
  }

  res.render("projects/index.ejs", {
    user,
    projects,
    range,
    year,
    month,
    quarter,
    half,
    department,
    scope: userId ? "faculty" : department ? "department" : "school"
  });
};