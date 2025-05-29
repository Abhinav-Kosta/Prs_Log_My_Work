const { getUserStats } = require("./stats.js");

module .exports.dashboard = async (req, res) => {
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