const Publication = require("../models/publish");
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