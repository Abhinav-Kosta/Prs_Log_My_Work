const { getUserStats } = require("./stats.js");

module.exports.dashboard = async (req, res) => {
    const range = req.query.range || 'all';
    const month = parseInt(req.query.month);
    const year = parseInt(req.query.year);
    const quarter = parseInt(req.query.quarter);
    const half = parseInt(req.query.half);

    const stats = await getUserStats(req.user._id, range, year, month, quarter, half);
    res.render("hoi/dashboard.ejs", { 
        user: req.user,
        counts: stats,
        range,
        year,
        month,
        quarter,
        half
    });
};