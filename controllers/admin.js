module.exports.dashboard = async (req, res) => {
    res.render("admin/dashboard.ejs", { 
        user: req.user,
        // You might want to add admin-specific stats here
    });
};