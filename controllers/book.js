const Book = require("../models/bookChapter");
const User = require("../models/user");

module.exports.index = async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    req.flash("error", "User not found.");
    return res.redirect("/");
  }

  const books = await Book.find({ user: userId }).sort({ date: -1 });

  res.render("books/index.ejs", {
    user,
    books
  });
};

module.exports.show = async (req, res) => {
  const { userId, bookId } = req.params;

  const book = await Book.findOne({ _id: bookId, user: userId });
  if (!book) {
    req.flash("error", "Books not found.");
    return res.redirect("/");
  }

  const user = await User.findById(userId);

  res.render("books/show.ejs", {
    user,
    book
  });
};