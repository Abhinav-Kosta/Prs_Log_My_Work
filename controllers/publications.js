const Publication = require("../models/publish");
const User = require("../models/user");
const ExcelJS = require("exceljs");
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

//Exporting to Excel for individual
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

  const publications = await Publication.find(filter).sort({ publicationDate: -1 });

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
  const worksheetName = `${req.user.fullname}'s Publication Stats`;
  const sheet = workbook.addWorksheet(worksheetName);

  // Add filter header in row 1 (NEW)
  sheet.mergeCells('A1', 'M1');
  sheet.getCell('A1').value = `${filterText}`;
  sheet.getCell('A1').alignment = { horizontal: 'center' };
  sheet.getCell('A1').font = { bold: true, size: 20 };
  sheet.getCell('A1').fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFF2CC' }  // Light Yellow
  };

  // 👉 Add university name in row 2 (previously row 1)
  sheet.mergeCells('A2', 'M2');
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
  sheet.mergeCells('A3', 'M3');
  sheet.getCell('A3').value = "Details about Papers Published ";
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
      { key: "coAuthors", width: 30},
      { key: 'title', width: 40 },
      { key: 'nameOfJournal', width: 30 },
      { key: 'date', width: 40 },
      { key: 'volume', width: 30 },
      { key: 'pageNo', width: 10},
      { key: 'indexed', width: 50},
      { key: 'link', width: 30},
      { key: 'impact', width: 5}

  ];

  // 👉 Manually add headers in row 4 (previously row 3)
  const headerRow = sheet.getRow(4);
  headerRow.values = [
      "S. No.",
      'Department',
      "Name",
      "Designation",
      "Co Authors, Name (s) (IF ANY)",
      "Title of the Paper",
      "Name of Journal with ISSN Number",
      "Year & Month of Publication",
      "Volume",
      "Page No.",
      "If indexed in Scopus (yes/no) or (in other databases like Pubmed/Medline or Other databases of Repute",
      "Link/PDF Website/ any other related link",
      "Impact Factor",
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

  publications.forEach((pub, index) => {
    const row = sheet.addRow({
      serial_number: index + 1,
      department: departmentName,
      name: req.user.fullname,
      designation: req.user.designation || '',
      coAuthors: pub.coAuthors || '',
      title: pub.title,
      nameOfJournal: pub.journalName,
      indexed: pub.indexedIn,
      volume: pub.volume || '',
      pageNo: pub.pageNumber || '',
      date: pub.publicationDate.toLocaleDateString('en-IN'),
      impact: pub.impactFactor || '',
      link: pub.proof.url || 'none'
    });

    // Set alignment for the entire row
    row.alignment = { vertical: 'middle', horizontal: 'center' };

    // Add borders to the entire row
    row.eachCell({ includeEmpty: true }, (cell) => {
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

  // Normalize the title: remove spaces and convert to lowercase
  const normalizedRegex = new RegExp(
    `^\\s*${title.trim().replace(/\s+/g, '\\s*')}\\s*$`,
    'i'
  );

  // Check for duplicates in the DB (case & space-insensitive)
  const existing = await Publication.findOne({
    user: req.user._id,
    title: { $regex: normalizedRegex }
  });

  if (existing) {
    req.flash("error", "A project with this title already exists.");
    return res.redirect(`/${req.user.role}/publications/new`);
  }

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