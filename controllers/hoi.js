const User = require("../models/user.js");
const { getUserStats, getHOIStats } = require("./stats.js");

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