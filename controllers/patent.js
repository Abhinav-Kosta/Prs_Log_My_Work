const Patent = require("../models/patent");
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
  const filter = dateFilter.$gte ? { user: userId, dateOfFiling: dateFilter } : { user: userId };

  const patents = await Patent.find(filter).sort({ dateOfFiling: -1 });

  res.render("patents/index.ejs", {
    user,
    patents,
    range,
    year,
    month,
    quarter,
    half
  });
};

module.exports.show = async (req, res) => {
  const { userId, patId } = req.params;
  const { range, year, month, quarter, half } = req.query;

  const patent = await Patent.findOne({ _id: patId, user: userId });
  if (!patent) {
    req.flash("error", "Patents not found.");
    return res.redirect("/");
  }

  const user = await User.findById(userId);

  res.render("patents/show.ejs", {
    user,
    patent,
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
  let filter = dateFilter.$gte ? { dateOfFiling: dateFilter } : {};

  let user = null;
  let patents = [];

  // Faculty-specific
  if (userId && userId !== "school" && userId !== "department") {
    user = await User.findById(userId);
    if (!user) {
      req.flash("error", "User not found.");
      return res.redirect("/");
    }
    filter.user = userId;
    patents = await Patent.find(filter).sort({ dateOfFiling: -1 });
  }

  // Department-wide
  else if (department) {
    const usersInDept = await User.find({ department }).select("_id name");
    const userIds = usersInDept.map(u => u._id);
    filter.user = { $in: userIds };
    patents = await Patent.find(filter).sort({ dateOfFiling: -1 });
  }

  // School-wide
  else {
    const hoiSchool = req.user.school;
    const usersInSchool = await User.find({ school: hoiSchool }).select("_id name");
    const userIds = usersInSchool.map(u => u._id);
    filter.user = { $in: userIds };
    patents = await Patent.find(filter).sort({ dateOfFiling: -1 });
  }

  res.render("patents/index.ejs", {
    user,
    patents,
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
  res.render("./patents/new.ejs");
}

module.exports.create = async (req, res) => {
    const { title, type, patentFileNo, applicationNo, dateOfFiling, specificationType, remarks } = req.body;

    // Normalize the title: remove spaces and convert to lowercase
    const normalizedRegex = new RegExp(
      `^\\s*${title.trim().replace(/\s+/g, '\\s*')}\\s*$`,
      'i'
    );
  
    // Check for duplicates in the DB (case & space-insensitive)
    const existing = await Patent.findOne({
      user: req.user._id,
      title: { $regex: normalizedRegex }
    });
  
    if (existing) {
      req.flash("error", "A patent with this title already exists.");
      return res.redirect(`/${req.user.role}/patents/new`);
    }    

    const newPatent = new Patent({
        user: req.user._id,
        title,
        type,
        patentFileNo,
        applicationNo,
        dateOfFiling,
        specificationType,
        remarks
    });

    // Handle Cloudinary file upload (PDF)
    if (req.file) {
        let url = req.file.path;
        if (!url.endsWith('.pdf')) {
            url += '.pdf';
        }

        newPatent.proof = {
            url: url,
            filename: req.file.filename
        };
    }

    await newPatent.save();

    console.log("Cloudinary Upload File Info:", req.file);
    req.flash("success", "New Patent Entry Created!");
    res.redirect(`/${req.user.role}/patents/${req.user._id }`);
};

module.exports.renderEdit = async (req, res) => {
  let { patentId } = req.params;
  const patent = await Patent.findById(patentId);

  if(!patent){
    req.flash("error", "Patent you requested for does not exists!");
    return res.redirect(`/${req.user.role}/patents/${req.user._id }`);
  }

  res.render("patents/edit.ejs", { patent });
}

module.exports.update = async (req, res) => {
  const { patentId } = req.params;
  const updatedData = { ...req.body };

  // Find and update the patent
  let patent = await Patent.findByIdAndUpdate(patentId, updatedData, { new: true });

  // If file uploaded, update the proof
  if (req.file) {
    patent.proof = {
      url: req.file.path,
      filename: req.file.filename
    };
    await patent.save(); // Save the updated proof
  }

  req.flash("success", "Patent updated successfully");
  res.redirect(`/${req.user.role}/patents/${req.user._id }`);
}

module.exports.destroy = async (req, res) => {
  const { patId } = req.params;
  const { password } = req.body;


  const user = await User.findById(req.user._id);
  const isMatch = await user.authenticate(password);
  console.log(isMatch);

  if(!isMatch.user){
    req.flash("error", "incorrect password, deletion cancelled!");
    return res.redirect(`/${req.user.role}/patents/${req.user._id}`);
  }

  await Patent.findByIdAndDelete(patId);

  req.flash("success", "Patent deleted successfully!");
  res.redirect(`/${req.user.role}/patents/${req.user._id}`);
}