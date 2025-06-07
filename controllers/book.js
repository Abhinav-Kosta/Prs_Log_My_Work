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

module.exports.summaryIndex = async (req, res) => {
  const { userId, department } = req.params;
  const { range = "all", year, month, quarter, half } = req.query;

  const dateFilter = getDateRange(range, parseInt(year), parseInt(month), parseInt(quarter), parseInt(half));
  let filter = dateFilter.$gte ? { publicationDate: dateFilter } : {};

  let user = null;
  let books = [];

  // Faculty-specific
  if (userId && userId !== "school" && userId !== "department") {
    user = await User.findById(userId);
    if (!user) {
      req.flash("error", "User not found.");
      return res.redirect("/");
    }
    filter.user = userId;
    books = await Book.find(filter).sort({ publicationDate: -1 });
  }

  // Department-wide
  else if (department) {
    const usersInDept = await User.find({ department }).select("_id name");
    const userIds = usersInDept.map(u => u._id);
    filter.user = { $in: userIds };
    books = await Book.find(filter).sort({ publicationDate: -1 });
  }

  // School-wide
  else {
    const hoiSchool = req.user.school;
    const usersInSchool = await User.find({ school: hoiSchool }).select("_id name");
    const userIds = usersInSchool.map(u => u._id);
    filter.user = { $in: userIds };
    books = await Book.find(filter).sort({ publicationDate: -1 });
  }

  res.render("books/index.ejs", {
    user,
    books,
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
  res.render("./books/new.ejs");
}

module.exports.create = async (req, res) => {
    const { title, isbn, publisher, publicationDate } = req.body;

    // Normalize the title: remove spaces and convert to lowercase
    const normalizedRegex = new RegExp(
      `^\\s*${title.trim().replace(/\s+/g, '\\s*')}\\s*$`,
      'i'
    );
  
    // Check for duplicates in the DB (case & space-insensitive)
    const existing = await Book.findOne({
      user: req.user._id,
      title: { $regex: normalizedRegex }
    });
  
    if (existing) {
      req.flash("error", "A book chapter with this title already exists.");
      return res.redirect(`/${req.user.role}/books/new`);
    }

    const newBook = new Book({
      user: req.user._id,
      title,
      isbn,
      publisher,
      publicationDate
    });

    // Handle Cloudinary file upload (PDF)
    if (req.file) {
      let url = req.file.path;
      if (!url.endsWith('.pdf')) {
          url += '.pdf';
      }
      newBook.proof = {
          url: url,
          filename: req.file.filename
      };
    }

    await newBook.save();

    console.log("Cloudinary Upload File Info:", req.file);
    req.flash("success", "New Book Chapter Created!");
    res.redirect(`/${req.user.role}/books/${req.user._id }`);
};

module.exports.renderEdit = async (req, res) => {
  const { bookId } = req.params;
  const book = await Book.findById(bookId);

  if(!book){
    req.flash("error", "Book Chapter you requested for does not exists!");
    return res.redirect(`${req.user.role}/books/${req.user._id}`);
  }

  res.render("books/edit.ejs", {book});
}

module.exports.update = async (req, res) => {
  const { bookId } = req.params;
  const updatedData = { ...req.body };

  const book = await Book.findByIdAndUpdate( bookId, updatedData, { new : true });

  if(req.file){
    book.proof = {
      url : req.file.path,
      filename : req.file.filename,
    };
    await book.save();
  }

  req.flash("success", "Book Chapter Updated successfully!");
  res.redirect(`/${req.user.role}/books/${req.user._id}`);
}

module.exports.destroy = async (req, res) => {
  const { bookId } = req.params;
  const { password } = req.body;

  const user = await User.findById(req.user._id);
  const isMatch = await user.authenticate(password);

  if(!isMatch.user){
    req.flash("error", "incorrect password, deletion cancelled!");
    return res.redirect(`/${req.user.role}/books/${req.user._id}`);
  }

  await Book.findByIdAndDelete(bookId);
  
  req.flash("success", "Book Chapter deleted successfully!");
  res.redirect(`/${req.user.role}/books/${req.user._id}`);
}