const User = require("../models/user");

module.exports.renderEdit = async (req, res) => {
    const role = req.user.role;
    let faculties = [];
    let hois = [];

    if (role === "hoi") {
      // HOI can fetch faculties from their school
      faculties = await User.find({ role: "faculty", school: req.user.school });
    }

    if (role === "admin") {
      // Admin can fetch all faculties and all HOIs
      faculties = await User.find({ role: "faculty" });
      hois = await User.find({ role: "hoi" });
    }

    res.render("password/individual", {
      user: req.user,
      faculties,
      hois
    });
}

module.exports.updateIndividual = async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if( newPassword !== confirmPassword){
        req.flash("error", "'Confirm Password' should be same as 'New Password'!");
        return res.redirect("/changePassword");
    }

    const user = await User.findById(req.user._id);
    const isMatch = await user.authenticate(currentPassword);

    if(!isMatch.user){
        req.flash("error", "Your current password is incorrect!");
        return res.redirect("/changePassword");
    }

    await user.setPassword(newPassword);
    await user.save();

    req.flash("success", "Password updated successfully!");
    res.redirect(`/${req.user.role}/dashboard`);
}

module.exports.updateFaculty = async (req, res) => {
    const { facultyId, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      req.flash("error", "'Confirm Password' should be same as 'New Password'!");
      return res.redirect("/changePassword");
    }

    // Find the faculty user
    const facultyUser = await User.findById(facultyId);

    if (req.user.role === "hoi" && facultyUser.school !== req.user.school) {
      req.flash("error", "You are not authorized to change this faculty’s password.");
      return res.redirect("/changePassword");
    }

    await facultyUser.setPassword(newPassword);
    await facultyUser.save();

    req.flash("success", "Faculty password updated successfully!");
    return res.redirect(`/${req.user.role}/dashboard`);
}

module.exports.updateHoi = async (req, res) => {
    const { hoiId, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      req.flash("error", "'Confirm Password' should be same as 'New Password'!");
      return res.redirect("/changePassword");
    }

    // Find the faculty user
    const hoiUser = await User.findById(hoiId);

    await hoiUser.setPassword(newPassword);
    await hoiUser.save();

    req.flash("success", "Faculty password updated successfully!");
    return res.redirect(`/${req.user.role}/dashboard`);
}