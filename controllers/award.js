const Award = require("../models/award");
const User = require("../models/user");
const getDateRange = require("../utils/dateRange");

module.exports.index = async (req, res) => {
  const { userId } = req.params;
  const { range = 'all', year, month, quarter, half } = req.query;

  const user = await User.findById(userId);
  if (!user) {
    req.flash("error", "User not found.");
    return res.redirect("/");
  }

  const dateFilter = getDateRange(range, parseInt(year), parseInt(month), parseInt(quarter), parseInt(half));
  const filter = dateFilter.$gte ? { user: userId, date: dateFilter } : { user: userId };

  const awards = await Award.find(filter).sort({ date: -1 });

  res.render("awards/index.ejs", {
    user,
    awards,
    range,
    year,
    month,
    quarter,
    half
  });
};

module.exports.show = async (req, res) => {
  const { userId, awdId } = req.params;
  const { range, year, month, quarter, half } = req.query;

  const award = await Award.findOne({ _id: awdId, user: userId });
  if (!award) {
    req.flash("error", "Awards not found.");
    return res.redirect("/");
  }

  const user = await User.findById(userId);

  res.render("awards/show.ejs", {
    user,
    award,
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
  let filter = dateFilter.$gte ? { date: dateFilter } : {};

  let user = null;
  let awards = [];

  // Faculty-specific
  if (userId && userId !== "school" && userId !== "department") {
    user = await User.findById(userId);
    if (!user) {
      req.flash("error", "User not found.");
      return res.redirect("/");
    }
    filter.user = userId;
    awards = await Award.find(filter).sort({ date: -1 });
  }

  // Department-wide
  else if (department) {
    const usersInDept = await User.find({ department }).select("_id name");
    const userIds = usersInDept.map(u => u._id);
    filter.user = { $in: userIds };
    awards = await Award.find(filter).sort({ date: -1 });
  }

  // School-wide
  else {
    const hoiSchool = req.user.school;
    const usersInSchool = await User.find({ school: hoiSchool }).select("_id name");
    const userIds = usersInSchool.map(u => u._id);
    filter.user = { $in: userIds };
    awards = await Award.find(filter).sort({ date: -1 });
  }

  res.render("awards/index.ejs", {
    user,
    awards,
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
  res.render("./awards/new.ejs");
}

module.exports.create = async (req, res) => {
  const {
      awardTitle,
      awardingAgency,
      awardDetails,
      date,
  } = req.body;

  const normalizedRegex = new RegExp(
    `^\\s*${awardTitle.trim().replace(/\s+/g, '\\s*')}\\s*$`,
    'i'
  );

  // Check for duplicates in the DB (case & space-insensitive)
  const existing = await Award.findOne({
    user: req.user._id,
    awardTitle: { $regex: normalizedRegex }
  });

  if (existing) {
    req.flash("error", "An award with this title already exists.");
    return res.redirect(`/${req.user.role}/awards/new`);
  }

  const newAward = new Award({
      user: req.user._id,
      awardTitle,
      awardingAgency,
      awardDetails,
      date,
  });

  if (req.file) {
    let url = req.file.path;
    if (!url.endsWith('.pdf')) {
      url += '.pdf';
    }
    newAward.proof = {
      url: url,
      filename: req.file.filename
    };
  }

  await newAward.save();

  console.log("Cloudinary Upload File Info:", req.file);
  req.flash("success", "New Award Entry Created!");
  res.redirect(`/${req.user.role}/awards/${req.user._id}`);
}

module.exports.renderEdit = async (req, res) => {
  const { awdId } = req.params;
  const award = await Award.findById(awdId);

  if(!award){
    req.flash("error", "Award you are trying to access doesn't exists");
    return res.redirect(`/${req.user.role}/awards/${req.user._id}`);
  }

  res.render("awards/edit.ejs", { award });
}

module.exports.update = async (req, res) => {
  const { awdId } = req.params;
  const updatedData = { ...req.body };
  const award = await Award.findByIdAndUpdate(awdId, updatedData, { new : true });

  if(req.file){ 
    award.proof = {
      url : req.file.path,
      filename : req.file.filename
    }
    await award.save();
  }

  req.flash("success", "Award updated successfully!");
  res.redirect(`/${req.user.role}/awards/${req.user._id}`);
}

module.exports.destroy = async (req, res) => {
  const { awdId } = req.params;
  const { password } = req.body;

  const user = await User.findById(req.user._id);
  const isMatch = await user.authenticate(password);

  if(!isMatch.user){
    req.flash("error", "Incorrect Password! Deletion Cancelled.");
    return res.redirect(`/${req.user.role}/awards/${req.user._id}`);
  }

  await Award.findByIdAndDelete(awdId);

  req.flash("success", "Award deleted successfully!");
  res.redirect(`/${req.user.role}/awards/${req.user._id}`);
}