const { getUserStats } = require("./stats.js");

module .exports.dashboard = async (req, res) => {
    const stats = await getUserStats(req.user._id);
    res.render("faculty/dashboard.ejs", { 
        user: req.user,
        counts: stats
    });
};