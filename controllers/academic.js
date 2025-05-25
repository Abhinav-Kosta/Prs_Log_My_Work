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