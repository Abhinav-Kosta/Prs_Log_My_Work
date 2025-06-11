const Book = require("../models/bookChapter");
const User = require("../models/user");
const ExcelJS = require("exceljs");
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

module.exports.indexExport = async (req, res) => {
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

  let departmentName;
      
  if(req.user.role === "hoi"){
    departmentName = req.user.school?.toUpperCase() || 'UNKNOWN';
  }
  else{
    departmentName = req.user.department?.toUpperCase() || 'UNKNOWN';
  }

  // Function to generate filter display text
  const getFilterDisplayText = (range, year, month, quarter, half) => {
    switch (range) {
      case 'all':
          return 'All Time';
      case 'yearly':
          return `Yearly - ${year}`;
      case 'monthly':
          const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
          ];
        return `Monthly - ${monthNames[month - 1]} ${year}`;
      case 'quarterly':
          const quarters = {
              0: '(Jan - Mar)',
              1: '(Apr - Jun)', 
              2: '(Jul - Sep)',
              3: '(Oct - Dec)'
          };
          return `Quarterly - ${quarters[quarter]} - ${year}`;
      case 'half':
          const halves = {
              0: '(Jan - Jun)',
              1: '(Jul - Dec)'
          };
          return `Half Yearly - ${halves[half]} - ${year}`;
      default:
          return 'All Time';
    }
  };

  const filterText = getFilterDisplayText(range, year, month, quarter, half);

  const workbook = new ExcelJS.Workbook();
  const worksheetName = `${req.user.fullname}'s Details of Books or Book Chapters Authored`;
  const sheet = workbook.addWorksheet(worksheetName);

  // Add filter header in row 1 (NEW)
  sheet.mergeCells('A1', 'H1');
  sheet.getCell('A1').value = `${filterText}`;
  sheet.getCell('A1').alignment = { horizontal: 'center' };
  sheet.getCell('A1').font = { bold: true, size: 20 };
  sheet.getCell('A1').fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFF2CC' }  // Light Yellow
  };

  // 👉 Add university name in row 2 (previously row 1)
  sheet.mergeCells('A2', 'H2');
  sheet.getCell('A2').value = "AMITY UNIVERSITY, MADHYA PRADESH, GWALIOR CAMPUS";
  sheet.getCell('A2').alignment = { horizontal: 'center' };
  sheet.getCell('A2').font = { bold: true, size: 14 };
  sheet.getCell('A2').fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'A52A2A' }  // Maroon
  };

  sheet.getCell('A2').font = { color: { argb: 'FFFFFFFF' }, bold: true, size: 14 }; // White text
  // Add department name in row 3 (previously row 2)
  sheet.mergeCells('A3', 'H3');
  sheet.getCell('A3').value = "Details of Books or Book Chapters Authored";
  sheet.getCell('A3').alignment = { horizontal: 'center' };
  sheet.getCell('A3').font = { bold: true, size: 14 };
  sheet.getCell('A3').fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'D9E1F2' }  // Light Dirty Blue
  };

  // Define columns structure (without adding headers yet)
  sheet.columns = [
      { key: "serial_number", width: 5},
      { key: 'department', width: 40 },
      { key: 'name', width: 30 },
      { key: 'designation', width: 30 },
      { key: 'title', width: 25 },
      { key: 'date', width: 25 },
      { key: 'isbn', width: 25},
      { key: 'publisher', width: 25}
  ];

  // Manually add headers in row 4 (previously row 3)
  const headerRow = sheet.getRow(4);
  headerRow.values = [
      "S. No.",
      'Department',
      "Name",
      "Designation",
      "Title of Book/Book chapter",
      "Date / Year of Publication",
      "ISBN Number",
      "Name of the Publisher/Place"
  ];

  // Style the header row (row 4)
  headerRow.font = { bold: true };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'D9D9D9' }  // Light Grey
  };
  headerRow.alignment = { horizontal: 'center' };
  headerRow.eachCell(cell => {
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  });

  books.forEach((book, index) => {
    const row = sheet.addRow({
      serial_number: index + 1,
      department: departmentName,
      name: req.user.fullname,
      designation: req.user.designation || '',
      title: book.title,
      date: book.publicationDate.toLocaleDateString('en-IN'),
      isbn: book.isbn,
      publisher: book.publisher,
    });

    // Wrap text and center-align all cells
    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
  });


  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename=faculty-summary-${Date.now()}.xlsx`);
  await workbook.xlsx.write(res);
  res.end();
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

module.exports.summaryIndexExport = async (req, res) => {
  const { userId, department } = req.params;
  const { range = "all", year, month, quarter, half } = req.query;

  const dateFilter = getDateRange(range, parseInt(year), parseInt(month), parseInt(quarter), parseInt(half));
  let filter = dateFilter.$gte ? { publicationDate: dateFilter } : {};

  let user = null;
  let books = [];
  let departmentName = '';

  // Faculty-specific
  if (userId && userId !== "school" && userId !== "department") {
    user = await User.findById(userId);
    if (!user) {
      req.flash("error", "User not found.");
      return res.redirect("/");
    }
    filter.user = userId;
    books = await Book.find(filter).populate('user').sort({ publicationDate: -1 });
    departmentName = user.department?.toUpperCase() || 'UNKNOWN';
  }

  // Department-wide
  else if (department) {
    const usersInDept = await User.find({ department }).select("_id name");
    const userIds = usersInDept.map(u => u._id);
    filter.user = { $in: userIds };
    books = await Book.find(filter).populate('user').sort({ publicationDate: -1 });
    departmentName = department.toUpperCase();
  }

  // School-wide
  else {
    const hoiSchool = req.user.school;
    const usersInSchool = await User.find({ school: hoiSchool }).select("_id name");
    const userIds = usersInSchool.map(u => u._id);
    filter.user = { $in: userIds };
    books = await Book.find(filter).populate('user').sort({ publicationDate: -1 });
    departmentName = 'ALL DEPARTMENTS';
  }

  // Function to generate filter display text
  const getFilterDisplayText = (range, year, month, quarter, half) => {
    switch (range) {
      case 'all':
          return 'All Time';
      case 'yearly':
          return `Yearly - ${year}`;
      case 'monthly':
          const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
          ];
        return `Monthly - ${monthNames[month - 1]} ${year}`;
      case 'quarterly':
          const quarters = {
              0: '(Jan - Mar)',
              1: '(Apr - Jun)', 
              2: '(Jul - Sep)',
              3: '(Oct - Dec)'
          };
          return `Quarterly - ${quarters[quarter]} - ${year}`;
      case 'half':
          const halves = {
              0: '(Jan - Jun)',
              1: '(Jul - Dec)'
          };
          return `Half Yearly - ${halves[half]} - ${year}`;
      default:
          return 'All Time';
    }
  };

  const filterText = getFilterDisplayText(range, year, month, quarter, half);

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Book Chapters Summary");

  // Add filter header in row 1 (NEW)
  sheet.mergeCells('A1', 'H1');
  sheet.getCell('A1').value = `${filterText}`;
  sheet.getCell('A1').alignment = { horizontal: 'center' };
  sheet.getCell('A1').font = { bold: true, size: 20 };
  sheet.getCell('A1').fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFF2CC' }  // Light Yellow
  };

  // 👉 Add university name in row 2 (previously row 1)
  sheet.mergeCells('A2', 'H2');
  sheet.getCell('A2').value = "AMITY UNIVERSITY, MADHYA PRADESH, GWALIOR CAMPUS";
  sheet.getCell('A2').alignment = { horizontal: 'center' };
  sheet.getCell('A2').font = { bold: true, size: 14 };
  sheet.getCell('A2').fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'A52A2A' }  // Maroon
  };

  sheet.getCell('A2').font = { color: { argb: 'FFFFFFFF' }, bold: true, size: 14 }; // White text
  // Add department name in row 3 (previously row 2)
  sheet.mergeCells('A3', 'H3');
  sheet.getCell('A3').value = "Details of Books or Book Chapters Authored";
  sheet.getCell('A3').alignment = { horizontal: 'center' };
  sheet.getCell('A3').font = { bold: true, size: 14 };
  sheet.getCell('A3').fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'D9E1F2' }  // Light Dirty Blue
  };

  // Define columns structure (without adding headers yet)
  sheet.columns = [
      { key: "serial_number", width: 5},
      { key: 'department', width: 40 },
      { key: 'name', width: 30 },
      { key: 'designation', width: 30 },
      { key: 'title', width: 25 },
      { key: 'date', width: 25 },
      { key: 'isbn', width: 25},
      { key: 'publisher', width: 25}
  ];

  // Manually add headers in row 4 (previously row 3)
  const headerRow = sheet.getRow(4);
  headerRow.values = [
      "S. No.",
      'Department',
      "Name",
      "Designation",
      "Title of Book/Book chapter",
      "Date / Year of Publication",
      "ISBN Number",
      "Name of the Publisher/Place"
  ];

  // Style the header row (row 4)
  headerRow.font = { bold: true };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'D9D9D9' }  // Light Grey
  };
  headerRow.alignment = { horizontal: 'center' };
  headerRow.eachCell(cell => {
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  });

  books.forEach((book, index) => {
    const row = sheet.addRow({
      serial_number: index + 1,
      department: userId ? departmentName : (book.user?.department?.toUpperCase() || book.user?.school?.toUpperCase() || 'UNKNOWN'),
      name: userId ? user.fullname : (book.user?.fullname || 'Unknown'),
      designation: userId ? (user.designation || '') : (book.user?.designation || ''),
      title: book.title,
      date: book.publicationDate.toLocaleDateString('en-IN'),
      isbn: book.isbn,
      publisher: book.publisher,
    });

    // Wrap text and center-align all cells
    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
  });

  const scope = userId ? 'faculty' : department ? 'department' : 'school';
  const fileName = `publications-summary-${scope}-${Date.now()}.xlsx`;

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
  await workbook.xlsx.write(res);
  res.end();
};

module.exports.renderNew = async (req, res) => {
  res.render("./books/new.ejs");
}

module.exports.create = async (req, res) => {
    const { type, title, isbn, publisher, publicationDate } = req.body;

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
      type,
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