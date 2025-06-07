const Academic = require("../models/academicEvent");
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

  const academics = await Academic.find(filter).sort({ date: -1 });

  res.render("academics/index.ejs", {
    user,
    academics,
    range,
    year,
    month,
    quarter,
    half
  });
};

module.exports.show = async (req, res) => {
  const { userId, acdId } = req.params;
  const { range, year, month, quarter, half } = req.query;

  const academic = await Academic.findOne({ _id: acdId, user: userId });
  if (!academic) {
    req.flash("error", "Academics not found.");
    return res.redirect("/");
  }

  const user = await User.findById(userId);

  res.render("academics/show.ejs", {
    user,
    academic,
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
  let academics = [];

  // Faculty-specific
  if (userId && userId !== "school" && userId !== "department") {
    user = await User.findById(userId);
    if (!user) {
      req.flash("error", "User not found.");
      return res.redirect("/");
    }
    filter.user = userId;
    academics = await Academic.find(filter).sort({ date: -1 });
  }

  // Department-wide
  else if (department) {
    const usersInDept = await User.find({ department }).select("_id name");
    const userIds = usersInDept.map(u => u._id);
    filter.user = { $in: userIds };
    academics = await Academic.find(filter).sort({ date: -1 });
  }

  // School-wide
  else {
    const hoiSchool = req.user.school;
    const usersInSchool = await User.find({ school: hoiSchool }).select("_id name");
    const userIds = usersInSchool.map(u => u._id);
    filter.user = { $in: userIds };
    academics = await Academic.find(filter).sort({ date: -1 });
  }

  res.render("academics/index.ejs", {
    user,
    academics,
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
  res.render("./academics/new.ejs");
}

module.exports.create = async (req, res) => {
  const {
      type,
      titleOfPaperPresented,
      eventName,
      sponsoredBy,
      date,
      venue,
      participationType,
  } = req.body;

  // Normalize the title: remove spaces and convert to lowercase
  const normalizedRegex = new RegExp(
    `^\\s*${titleOfPaperPresented.trim().replace(/\s+/g, '\\s*')}\\s*$`,
    'i'
  );

  // Check for duplicates in the DB (case & space-insensitive)
  const existing = await Academic.findOne({
    user: req.user._id,
    titleOfPaperPresented: { $regex: normalizedRegex }
  });

  if (existing) {
    req.flash("error", "An academic event with this title already exists.");
    return res.redirect(`/${req.user.role}/academic-events/new`);
  }
  
  const newAcademic = new Academic({
      user: req.user._id,
      type,
      titleOfPaperPresented,
      eventName,
      sponsoredBy,
      date,
      venue,
      participationType,
  });

  if (req.file) {
    let url = req.file.path;
    if (!url.endsWith('.pdf')) {
      url += '.pdf';
    }
    newAcademic.proof = {
      url: url,
      filename: req.file.filename
    };
  }

  await newAcademic.save();

  console.log("Cloudinary Upload File Info:", req.file);
  req.flash("success", "New Academic Entry Created!");
  res.redirect(`/${req.user.role}/academic-events/${req.user._id}`);
}

module.exports.renderEdit = async (req, res) => {
  let { acdId } = req.params;

  let academic = await Academic.findById(acdId);

  if(!academic){
    req.flash("error", "Academic Event you requested for does not exists!");
    return res.redirect(`/${req.user.role}/academic-events/${req.user._id }`);
  }

  res.render("academics/edit.ejs", { academic });
}

module.exports.update = async (req, res) => {
  let { acdId } = req.params;
  let updatedData = { ...req.body };

  let academic = await Academic.findByIdAndUpdate(acdId, updatedData, { new : true });

  if(req.file){
    academic.proof = {
      url : req.file.path,
      filename: req.file.filename,
    };
    await academic.save();
  }

  req.flash("Academic Event updated successfully!");
  res.redirect(`/${req.user.role}/academic-events/${req.user._id}`);
}

module.exports.destroy = async (req, res) => {
  const { acdId } = req.params;
  const { password } = req.body;

  const user = await User.findById(req.user._id);
  const isMatch = await user.authenticate(password);

  if(!isMatch.user){
    req.flash("error", "Incorrect Password! Deletion Cancelled");
    return res.redirect(`/${req.user.role}/academic-events/${req.user._id}`);
  }

  await Academic.findByIdAndDelete(acdId);

  req.flash("success", "Academic Record deleted successfully!");
  res.redirect(`/${req.user.role}/academic-events/${req.user._id}`);
}