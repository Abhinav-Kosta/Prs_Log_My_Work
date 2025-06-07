const Publication = require("../models/publish");
const User = require("../models/user");
const getDateRange = require("../utils/dateRange");

module.exports.renderNew = async (req, res) => {
  res.render("./publications/new.ejs");
}

module.exports.index = async (req, res) => {
  const { userId } = req.params;
  const { range = 'all', year, month, quarter, half } = req.query;

  const user = await User.findById(userId);
  if (!user) {
    req.flash("error", "User not found.");
    return res.redirect("/");
  }

  const dateFilter = getDateRange(range, parseInt(year), parseInt(month), parseInt(quarter), parseInt(half));
  const filter = dateFilter.$gte ? { user: userId, publicationDate: dateFilter } : { user: userId };

  const publications = await Publication.find(filter).sort({ publicationDate: -1 });

  res.render("publications/index.ejs", {
    user,
    publications,
    range,
    year,
    month,
    quarter,
    half
  });
};

module.exports.show = async (req, res) => {
  const { userId, pubId } = req.params;
  const { range, year, month, quarter, half } = req.query;

  const publication = await Publication.findOne({ _id: pubId, user: userId });
  if (!publication) {
    req.flash("error", "Publication not found.");
    return res.redirect("/");
  }

  const user = await User.findById(userId);

  res.render("publications/show.ejs", {
    user,
    publication,
    range,
    year,
    month,
    quarter,
    half
  });
};

module.exports.summaryIndex = async (req, res) => {
  const { userId, department } = req.params;
  const { range = 'all', year, month, quarter, half } = req.query;

  const dateFilter = getDateRange(range, parseInt(year), parseInt(month), parseInt(quarter), parseInt(half));
  let filter = dateFilter.$gte ? { publicationDate: dateFilter } : {};

  let user = null;
  let publications = [];

  // Faculty-specific
  if (userId) {
    user = await User.findById(userId);
    if (!user) {
      req.flash("error", "User not found.");
      return res.redirect("/");
    }
    filter.user = userId;
    publications = await Publication.find(filter).sort({ publicationDate: -1 });
  }

  // Department-wide
  else if (department) {
    const usersInDept = await User.find({ department }).select("_id name");
    const userIds = usersInDept.map(u => u._id);
    filter.user = { $in: userIds };
    publications = await Publication.find(filter).sort({ publicationDate: -1 });
  }

  // School-wide
  else {
    // Assuming HOI session contains school info
    const hoiSchool = req.user.school; // or wherever your session stores this
    const usersInSchool = await User.find({ school: hoiSchool }).select("_id name");
    const userIds = usersInSchool.map(u => u._id);
    filter.user = { $in: userIds };
    publications = await Publication.find(filter).sort({ publicationDate: -1 });
  }

  res.render("publications/index.ejs", {
    user,
    publications,
    range,
    year,
    month,
    quarter,
    half,
    department,
    scope: userId ? 'faculty' : department ? 'department' : 'school'
  });
};

module.exports.create = async (req, res) => {
    const {
        title,
        coAuthors,
        journalName,
        issnNumber,
        publicationDate,
        volume,
        pageNumber,
        indexedIn,
        link,
        impactFactor
    } = req.body;

    const newPublication = new Publication({
        user: req.user._id,
        title,
        coAuthors,
        journalName,
        issnNumber,
        publicationDate,
        volume,
        pageNumber,
        indexedIn,
        link,
        impactFactor
    });

    if (req.file) {
      let url = req.file.path;
      if (!url.endsWith('.pdf')) {
        url += '.pdf';
      }

      newPublication.proof = {
        url: url,
        filename: req.file.filename
      };
    }

    await newPublication.save();

    console.log("Cloudinary Upload File Info:", req.file);
    req.flash("success", "New Publication Entry Created!");
    res.redirect(`/${req.user.role}/publications/${req.user._id}`);
};

module.exports.renderEdit = async (req, res) => {
  let { pubId } = req.params;
  const publication = await Publication.findById(pubId);

  if(!publication){
    req.flash("error", "publication you requested for does not exists!");
    return res.redirect(`/${req.user.role}/publications/${req.user._id }`);
  }

  res.render("publications/edit.ejs", { publication });
}

module.exports.update = async (req, res) => {
  let { pubId } = req.params;
  const updatedData = { ...req.body };

  const publication = await Publication.findByIdAndUpdate(pubId, updatedData, { new: true });

  if (req.file) {
    publication.proof = {
      url: req.file.path,
      filename: req.file.filename
    };
    await publication.save();
  }

  req.flash("success", "Publication updated successfully");
  res.redirect(`/${req.user.role}/publications/${req.user._id }`);
}

module.exports.destroy = async (req, res) => {
  const { pubId } = req.params;
  const { password } = req.body;

  const user = await User.findById(req.user._id);
  const isMatch = await user.authenticate(password);

  if(!isMatch.user){
    req.flash("error", "Incorrect Password! Deletion Cancelled.");
    return res.redirect(`/${req.user.role}/publications/${req.user._id}`);
  }

  // const deletedPublication = await Publication.findByIdAndDelete(pubId);
  // console.log(deletedPublication);

  await Publication.findByIdAndDelete(pubId);
  
  req.flash("success", "Publication deleted successfully.");
  res.redirect(`/${req.user.role}/publications/${req.user._id}`);
}