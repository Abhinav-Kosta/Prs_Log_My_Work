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