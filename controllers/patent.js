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