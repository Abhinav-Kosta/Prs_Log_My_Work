const { getUserStats } = require("./stats.js");
const User = require("../models/user.js");
const ExcelJS = require('exceljs');

module.exports.editProfile = async (req, res) => {
  const updatedData = { ...req.body };

  // Find and update the user
  await User.findByIdAndUpdate(req.user._id, updatedData, { new: true });

  req.flash("success", "Profile edited successfully");
  res.redirect(`/${req.user.role}/dashboard`);
}

module.exports.dashboard = async (req, res) => {
    // const range = req.query.range || 'all';
    // const month = parseInt(req.query.month);
    // const year = parseInt(req.query.year); 
    // const quarter = parseInt(req.query.quarter);
    // const half = parseInt(req.query.half);

    const rangePersonal = req.query["range-personal"] || "all";
    const yearPersonal = parseInt(req.query["year-personal"]);
    const monthPersonal = parseInt(req.query["month-personal"]);
    const quarterPersonal = parseInt(req.query["quarter-personal"]);
    const halfPersonal = parseInt(req.query["half-personal"]);

    const stats = await getUserStats(
        req.user._id,
        rangePersonal,
        yearPersonal,
        monthPersonal,
        quarterPersonal,
        halfPersonal
    );

    res.render("faculty/dashboard.ejs", { 
        user: req.user,
        counts: stats,
        range: rangePersonal, 
        year: yearPersonal, 
        month: monthPersonal, 
        quarter: quarterPersonal, 
        half: halfPersonal,
    });
};

module.exports.exportFacultySummary = async (req, res) => {
    const userId = req.user._id;
    
    let departmentName;

    if(req.user.role === "hoi"){
      departmentName = req.user.school?.toUpperCase() || 'UNKNOWN';
    }
    else{
      departmentName = req.user.department?.toUpperCase() || 'UNKNOWN';
    }

    const rangePersonal = req.query["range-personal"] || "all";
    const yearPersonal = parseInt(req.query["year-personal"]);
    const monthPersonal = parseInt(req.query["month-personal"]);
    const quarterPersonal = parseInt(req.query["quarter-personal"]);
    const halfPersonal = parseInt(req.query["half-personal"]);

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

    const filterText = getFilterDisplayText(rangePersonal, yearPersonal, monthPersonal, quarterPersonal, halfPersonal);

    const stats = await getUserStats(
        userId,
        rangePersonal,
        yearPersonal,
        monthPersonal,
        quarterPersonal,
        halfPersonal
    );

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Summary Stats');

    // Add filter header in row 1 (NEW)
    sheet.mergeCells('A1', 'I1');
    sheet.getCell('A1').value = `${filterText}`;
    sheet.getCell('A1').alignment = { horizontal: 'center' };
    sheet.getCell('A1').font = { bold: true, size: 20 };
    sheet.getCell('A1').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF2CC' }  // Light Yellow
    };

    // Add university name in row 2 (previously row 1)
    sheet.mergeCells('A2', 'I2');
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
    sheet.mergeCells('A3', 'I3');
    sheet.getCell('A3').value = `${departmentName}`;
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
        { key: 'name', width: 20 },
        { key: 'patents', width: 30 },
        { key: 'publications', width: 30 },
        { key: "scopusPublications", width: 30},
        { key: 'academicEvents', width: 40 },
        { key: 'projects', width: 30 },
        { key: 'bookChapters', width: 40 },
        { key: 'awards', width: 30 },
    ];

    // 👉 Manually add headers in row 4 (previously row 3)
    const headerRow = sheet.getRow(4);
    headerRow.values = [
        "S. No.",
        'Faculty Name',
        "No. of Patents /Copyright",
        "No. of Paper Publications",
        "No. of Papers indexed in SCOPUS",
        "No. of Conferences / Workshops/ Symposia/ FDP ",
        "No. of Projects",
        "No. of Book/ book chapters  authored",
        "No. of Awards/ Achievements"
    ];

    // Style the header row (row 4, previously row 3)
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

    // Add data row with center alignment (now row 5)
    const dataRow = sheet.addRow({
        serial_number: 1,
        name: req.user.fullname,
        patents: stats.patents,
        publications: stats.publications,
        scopusPublications: stats.scopusPublications,
        academicEvents: stats.academicEvents,
        projects: stats.projects,
        bookChapters: stats.bookChapters,
        awards: stats.awards,
    });

    // Center align the data row
    dataRow.alignment = { horizontal: 'center' };
    dataRow.eachCell(cell => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=faculty-summary-${Date.now()}.xlsx`);
    await workbook.xlsx.write(res);
    res.end();
};