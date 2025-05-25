const Book = require("../models/bookChapter");
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

  const books = await Book.find(filter).sort({ publicationDate: -1 });

  res.render("books/index.ejs", {
    user,
    books,
    range,
    year,
    month,
    quarter,
    half
  });
};

module.exports.show = async (req, res) => {
  const { userId, bookId } = req.params;
  const { range, year, month, quarter, half } = req.query;

  const book = await Book.findOne({ _id: bookId, user: userId });
  if (!book) {
    req.flash("error", "Books not found.");
    return res.redirect("/");
  }

  const user = await User.findById(userId);

  res.render("books/show.ejs", {
    user,
    book,
    range,
    year,
    month,
    quarter,
    half
  });
};