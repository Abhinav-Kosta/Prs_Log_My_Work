const User = require("../models/user.js");
const { getUserStats, getHOIStats } = require("./stats.js");
const ExcelJS = require("exceljs");

module.exports.dashboard = async (req, res) => {
    const user = req.user;

    // PERSONAL filter (for HOI's own data)
    const rangePersonal = req.query["range-personal"] || "all";
    const yearPersonal = parseInt(req.query["year-personal"]);
    const monthPersonal = parseInt(req.query["month-personal"]);
    const quarterPersonal = parseInt(req.query["quarter-personal"]);
    const halfPersonal = parseInt(req.query["half-personal"]);

    // SCHOOL-WIDE filter
    const rangeSchool = req.query["range-school"] || "all";
    const yearSchool = parseInt(req.query["year-school"]);
    const monthSchool = parseInt(req.query["month-school"]);
    const quarterSchool = parseInt(req.query["quarter-school"]);
    const halfSchool = parseInt(req.query["half-school"]);
    const scope = req.query.scope || "school";
    const department = req.query.department || "";
    const facultyId = req.query.facultyId || "";

    // 1. Get HOI's own data stats (personal)
    const stats = await getUserStats(user._id, rangePersonal, yearPersonal, monthPersonal, quarterPersonal, halfPersonal);

    // 2. Get filtered school-wide stats
    const filteredCounts = await getHOIStats({
        school: user.school,
        scope,
        department,
        facultyId,
        range: rangeSchool,
        year: yearSchool,
        month: monthSchool,
        quarter: quarterSchool,
        half: halfSchool
    });

    // 3. Get dropdown data for school filter
    const departments = await User.distinct("department", {
        school: user.school,
        role: "faculty"
    });

    const allFaculty = await User.find({
        school: user.school,
        role: "faculty"
    });

    res.render("hoi/dashboard.ejs", { 
        user,
        counts: stats,              // HOI's personal stats
        filteredCounts,             // School-wide stats
        // personal filter values
        range: rangePersonal, 
        year: yearPersonal, 
        month: monthPersonal, 
        quarter: quarterPersonal, 
        half: halfPersonal,
        // school-wide filter values
        rangeSchool, 
        yearSchool, 
        monthSchool, 
        quarterSchool, 
        halfSchool,
        scope, department, facultyId,
        departments, allFaculty
    });
};

module.exports.export = async (req, res) => {
    const user = req.user;

    let departmentName;

    if(req.user.role === "hoi"){
      departmentName = req.user.school?.toUpperCase() || 'UNKNOWN';
    }
    else{
      departmentName = req.user.department?.toUpperCase() || 'UNKNOWN';
    }

    const rangeSchool = req.query["range-school"] || "all";
    const yearSchool = parseInt(req.query["year-school"]);
    const monthSchool = parseInt(req.query["month-school"]);
    const quarterSchool = parseInt(req.query["quarter-school"]);
    const halfSchool = parseInt(req.query["half-school"]);
    const scope = req.query.scope || "school";
    const department = req.query.department || "";
    const facultyId = req.query.facultyId || "";

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

    const filterText = getFilterDisplayText(rangeSchool, yearSchool, monthSchool, quarterSchool, halfSchool);

    const filteredCounts = await getHOIStats({
        school: user.school,
        scope,
        department,
        facultyId,
        range: rangeSchool,
        year: yearSchool,
        month: monthSchool,
        quarter: quarterSchool,
        half: halfSchool
    });

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
        { key: 'department', width: 20 },
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
        'Department',
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
        department: req.user.school.toUpperCase(),
        patents: filteredCounts.patents,
        publications: filteredCounts.publications,
        scopusPublications: filteredCounts.scopusPublications,
        academicEvents: filteredCounts.academicEvents,
        projects: filteredCounts.projects,
        bookChapters: filteredCounts.bookChapters,
        awards: filteredCounts.awards,
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
    res.setHeader('Content-Disposition', `attachment; filename=department-summary-${Date.now()}.xlsx`);
    await workbook.xlsx.write(res);
    res.end();
}