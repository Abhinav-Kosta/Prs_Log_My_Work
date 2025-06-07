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

module.exports.renderNew = async (req, res) => {
  res.render("./projects/new.ejs");
}

module.exports.create = async (req, res) => {
  const {
      title,
      piOrCoPi,
      fundingAgency,
      dateOfSubmission,
      fundRequestedLacs,
      durationYears,
      remarks
  } = req.body;

  // Normalize the title: remove spaces and convert to lowercase
  const normalizedRegex = new RegExp(
    `^\\s*${title.trim().replace(/\s+/g, '\\s*')}\\s*$`,
    'i'
  );

  // Check for duplicates in the DB (case & space-insensitive)
  const existing = await Project.findOne({
    user: req.user._id,
    title: { $regex: normalizedRegex }
  });

  if (existing) {
    req.flash("error", "A project with this title already exists.");
    return res.redirect(`/${req.user.role}/projects/new`);
  }

  const newProject = new Project({
      user: req.user._id,
      title,
      piOrCoPi,
      fundingAgency,
      dateOfSubmission,
      fundRequestedLacs,
      durationYears,
      remarks
  });

  if (req.file) {
    let url = req.file.path;
    if (!url.endsWith('.pdf')) {
      url += '.pdf';
    }
    newProject.proof = {
      url: url,
      filename: req.file.filename
    };
  }

  await newProject.save();

  console.log("Cloudinary Upload File Info:", req.file);
  req.flash("success", "New Project Entry Created!");
  res.redirect(`/${req.user.role}/projects/${req.user._id}`);
}

module.exports.renderEdit = async (req, res) => {
  const { pjtId } = req.params;
  const project = await Project.findById(pjtId);

  if(!project){
    req.flash("error", "Project you requested does not exists.");
    return res.redirect(`${req.user.role}/projects/${req.user._id}`);
  }

  res.render("projects/edit.ejs", { project });
}

module.exports.update = async (req, res) => {
  const { pjtId } = req.params;
  const updatedData = { ...req.body };
  const project = await Project.findByIdAndUpdate(pjtId, updatedData, { new : true });

  if(req.file){
    project.proof = {
      url : req.file.path,
      filename : req.file.filename
    }
    await project.save();
  }

  req.flash("success", "Project updated successfully");
  res.redirect(`/${req.user.role}/projects/${req.user._id}`);
}

module.exports.destroy = async (req, res) => {
  const { pjtId } = req.params;
  const { password } = req.body;

  const user = await User.findById(req.user._id);
  const isMatch = await user.authenticate(password);

  if(!isMatch.user){
    req.flash("error", "incorrect password, deletion cancelled!");
    return res.redirect(`/${req.user.role}/projects/${req.user._id}`);
  }

  await Project.findByIdAndDelete(pjtId);

  req.flash("success", "Project deleted successfully!");
  res.redirect(`/${req.user.role}/projects/${req.user._id}`);
}