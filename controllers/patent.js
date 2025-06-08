const Patent = require("../models/patent");
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

module.exports.indexExport = async (req, res) => {
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
  const worksheetName = `${req.user.fullname}'s Details of Filed Patents`;
  const sheet = workbook.addWorksheet(worksheetName);

  // Add filter header in row 1 (NEW)
  sheet.mergeCells('A1', 'K1');
  sheet.getCell('A1').value = `${filterText}`;
  sheet.getCell('A1').alignment = { horizontal: 'center' };
  sheet.getCell('A1').font = { bold: true, size: 20 };
  sheet.getCell('A1').fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFF2CC' }  // Light Yellow
  };

  // 👉 Add university name in row 2 (previously row 1)
  sheet.mergeCells('A2', 'K2');
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
  sheet.mergeCells('A3', 'K3');
  sheet.getCell('A3').value = "Details of Filed Patents";
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
      { key: 'title', width: 40 },
      { key: 'type', width: 20 },
      { key: 'fileNo', width: 15},
      { key: 'number', width: 18 },
      { key: 'date', width: 18 },
      { key: 'status', width: 30},
      { key: 'remark', width: 60}
  ];

  // Manually add headers in row 4 (previously row 3)
  const headerRow = sheet.getRow(4);
  headerRow.values = [
      "S. No.",
      'Department',
      "Name",
      "Designation",
      "Title",
      "National/ International",
      "Patent File No.",
      "Application No.",
      "Date of Filing Patent",
      "Provisional/ Complete Specifications",
      "Remarks (Applied/ Awarded/ Published/ Under Examination) "
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

  patents.forEach((pat, index) => {
    const row = sheet.addRow({
      serial_number: index + 1,
      department: departmentName,
      name: req.user.fullname,
      designation: req.user.designation || '',
      title: pat.title,
      type: pat.type,
      fileNo: pat.patentFileNo,
      number: pat.applicationNo,
      date: pat.dateOfFiling.toLocaleDateString('en-IN'),
      status: pat.specificationType,
      remark: pat.remarks || '',
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

module.exports.summaryIndex = async (req, res) => {
  const { userId, department } = req.params;
  const { range = "all", year, month, quarter, half } = req.query;

  const dateFilter = getDateRange(range, parseInt(year), parseInt(month), parseInt(quarter), parseInt(half));
  let filter = dateFilter.$gte ? { dateOfFiling: dateFilter } : {};

  let user = null;
  let patents = [];

  // Faculty-specific
  if (userId && userId !== "school" && userId !== "department") {
    user = await User.findById(userId);
    if (!user) {
      req.flash("error", "User not found.");
      return res.redirect("/");
    }
    filter.user = userId;
    patents = await Patent.find(filter).sort({ dateOfFiling: -1 });
  }

  // Department-wide
  else if (department) {
    const usersInDept = await User.find({ department }).select("_id name");
    const userIds = usersInDept.map(u => u._id);
    filter.user = { $in: userIds };
    patents = await Patent.find(filter).sort({ dateOfFiling: -1 });
  }

  // School-wide
  else {
    const hoiSchool = req.user.school;
    const usersInSchool = await User.find({ school: hoiSchool }).select("_id name");
    const userIds = usersInSchool.map(u => u._id);
    filter.user = { $in: userIds };
    patents = await Patent.find(filter).sort({ dateOfFiling: -1 });
  }

  res.render("patents/index.ejs", {
    user,
    patents,
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
  let filter = dateFilter.$gte ? { dateOfFiling: dateFilter } : {};

  let user = null;
  let patents = [];
  let departmentName = '';

  // Faculty-specific
  if (userId && userId !== "school" && userId !== "department") {
    user = await User.findById(userId);
    if (!user) {
      req.flash("error", "User not found.");
      return res.redirect("/");
    }
    filter.user = userId;
    patents = await Patent.find(filter).populate('user').sort({ dateOfFiling: -1 });
    departmentName = user.department?.toUpperCase() || 'UNKNOWN';
  }

  // Department-wide
  else if (department) {
    const usersInDept = await User.find({ department }).select("_id name");
    const userIds = usersInDept.map(u => u._id);
    filter.user = { $in: userIds };
    patents = await Patent.find(filter).populate('user').sort({ dateOfFiling: -1 });
    departmentName = department.toUpperCase();
  }

  // School-wide
  else {
    const hoiSchool = req.user.school;
    const usersInSchool = await User.find({ school: hoiSchool }).select("_id name");
    const userIds = usersInSchool.map(u => u._id);
    filter.user = { $in: userIds };
    patents = await Patent.find(filter).populate('user').sort({ dateOfFiling: -1 });
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
  const sheet = workbook.addWorksheet("Patents Summary");

  // Add filter header in row 1 (NEW)
  sheet.mergeCells('A1', 'K1');
  sheet.getCell('A1').value = `${filterText}`;
  sheet.getCell('A1').alignment = { horizontal: 'center' };
  sheet.getCell('A1').font = { bold: true, size: 20 };
  sheet.getCell('A1').fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFF2CC' }  // Light Yellow
  };

  // 👉 Add university name in row 2 (previously row 1)
  sheet.mergeCells('A2', 'K2');
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
  sheet.mergeCells('A3', 'K3');
  sheet.getCell('A3').value = "Details of Filed Patents";
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
      { key: 'title', width: 40 },
      { key: 'type', width: 20 },
      { key: 'fileNo', width: 15},
      { key: 'number', width: 18 },
      { key: 'date', width: 18 },
      { key: 'status', width: 30},
      { key: 'remark', width: 60}
  ];

  // Manually add headers in row 4 (previously row 3)
  const headerRow = sheet.getRow(4);
  headerRow.values = [
      "S. No.",
      'Department',
      "Name",
      "Designation",
      "Title",
      "National/ International",
      "Patent File No.",
      "Application No.",
      "Date of Filing Patent",
      "Provisional/ Complete Specifications",
      "Remarks (Applied/ Awarded/ Published/ Under Examination) "
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

  patents.forEach((pat, index) => {
    const row = sheet.addRow({
      serial_number: index + 1,
      department: userId ? departmentName : (pat.user?.department?.toUpperCase() || pat.user?.school?.toUpperCase() || 'UNKNOWN'),
      name: userId ? user.fullname : (pat.user?.fullname || 'Unknown'),
      designation: userId ? (user.designation || '') : (pat.user?.designation || ''),
      title: pat.title,
      type: pat.type,
      fileNo: pat.patentFileNo,
      number: pat.applicationNo,
      date: pat.dateOfFiling.toLocaleDateString('en-IN'),
      status: pat.specificationType,
      remark: pat.remarks || '',
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
  res.render("./patents/new.ejs");
}

module.exports.create = async (req, res) => {
    const { title, type, patentFileNo, applicationNo, dateOfFiling, specificationType, remarks } = req.body;

    // Normalize the title: remove spaces and convert to lowercase
    const normalizedRegex = new RegExp(
      `^\\s*${title.trim().replace(/\s+/g, '\\s*')}\\s*$`,
      'i'
    );
  
    // Check for duplicates in the DB (case & space-insensitive)
    const existing = await Patent.findOne({
      user: req.user._id,
      title: { $regex: normalizedRegex }
    });
  
    if (existing) {
      req.flash("error", "A patent with this title already exists.");
      return res.redirect(`/${req.user.role}/patents/new`);
    }    

    const newPatent = new Patent({
        user: req.user._id,
        title,
        type,
        patentFileNo,
        applicationNo,
        dateOfFiling,
        specificationType,
        remarks
    });

    // Handle Cloudinary file upload (PDF)
    if (req.file) {
        let url = req.file.path;
        if (!url.endsWith('.pdf')) {
            url += '.pdf';
        }

        newPatent.proof = {
            url: url,
            filename: req.file.filename
        };
    }

    await newPatent.save();

    console.log("Cloudinary Upload File Info:", req.file);
    req.flash("success", "New Patent Entry Created!");
    res.redirect(`/${req.user.role}/patents/${req.user._id }`);
};

module.exports.renderEdit = async (req, res) => {
  let { patentId } = req.params;
  const patent = await Patent.findById(patentId);

  if(!patent){
    req.flash("error", "Patent you requested for does not exists!");
    return res.redirect(`/${req.user.role}/patents/${req.user._id }`);
  }

  res.render("patents/edit.ejs", { patent });
}

module.exports.update = async (req, res) => {
  const { patentId } = req.params;
  const updatedData = { ...req.body };

  // Find and update the patent
  let patent = await Patent.findByIdAndUpdate(patentId, updatedData, { new: true });

  // If file uploaded, update the proof
  if (req.file) {
    patent.proof = {
      url: req.file.path,
      filename: req.file.filename
    };
    await patent.save(); // Save the updated proof
  }

  req.flash("success", "Patent updated successfully");
  res.redirect(`/${req.user.role}/patents/${req.user._id }`);
}

module.exports.destroy = async (req, res) => {
  const { patId } = req.params;
  const { password } = req.body;


  const user = await User.findById(req.user._id);
  const isMatch = await user.authenticate(password);
  console.log(isMatch);

  if(!isMatch.user){
    req.flash("error", "incorrect password, deletion cancelled!");
    return res.redirect(`/${req.user.role}/patents/${req.user._id}`);
  }

  await Patent.findByIdAndDelete(patId);

  req.flash("success", "Patent deleted successfully!");
  res.redirect(`/${req.user.role}/patents/${req.user._id}`);
}