const User = require("../models/user");
const passport = require("passport");

const validSchoolDepartments = {
  ASET: ["Computer Science", "Information Technology", "Mechanical", "Electronics and Communication", "Civil", "Physics", "Chemistry", "Mathematics"],
  ALS: ["Civil Law", "Criminal Law"],
};

module.exports.dashboard = async (req, res) => {
    res.render("admin/dashboard.ejs", { 
        user: req.user,
        // You might want to add admin-specific stats here
    });
};

module.exports.renderSignup = async (req, res) => {
    res.render("admin/signup.ejs");
}

module.exports.signUp = async (req, res) => {
    try {
        const { facultyId, fullname, designation, role, school, department, password, dateOfJoining } = req.body;

        const existingUser = await User.findOne({ facultyId });
        if (existingUser) {
          req.flash("error", "Faculty ID already exists. Please use a different ID.");
          return res.redirect("/admin/signup");
        }
        
        // Role-specific validation
        if (!["faculty", "hoi", "admin"].includes(role)) {
          req.flash("error", "Invalid role.");
          return res.redirect("/admin/signup");
        }

        // School is required for faculty and hoi
        if ((role === "faculty" || role === "hoi") && !school) {
          req.flash("error", "School is required for this role.");
          return res.redirect("/admin/signup");
        }

        // Department is required only for faculty
        if (role === "faculty" && !department) {
          req.flash("error", "Department is required for faculty.");
          return res.redirect("/admin/signup");
        }

        // Validate department against school
        if (role === "faculty" && (!validSchoolDepartments[school] || !validSchoolDepartments[school].includes(department))) {
          req.flash("error", `Invalid department selected for school ${school}.`);
          return res.redirect("/admin/signup");
        }

        const newUser = new User({
          facultyId,
          fullname,
          designation,
          role,
          school: (role === "faculty" || role === "hoi") ? school : undefined,
          department: role === "faculty" ? department : undefined,
          dateOfJoining
        });

        const registeredUser = await User.register(newUser, password);
        console.log("Registered user saved to DB:", registeredUser);

        req.flash("success", `Successfully created ${role} user!`);
        res.redirect("/admin/dashboard");        
    } 
    catch (err) {
        req.flash("error", err.message);
        res.redirect("/admin/signup");
    }
}