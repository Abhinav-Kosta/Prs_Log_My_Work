const { patentSchema, publicationSchema, academicSchema, bookSchema, awardSchema, projectSchema } = require("./schema");
const ExpressError = require("./utils/ExpressError");

module.exports.isAdmin = (req, res, next) => {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
        req.flash("error", "You must be logged in as an admin to perform this action.");
        return res.redirect("/login/admin");
    }
    next();
};

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        // req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must logged in for this action!");
        return res.redirect("/login");
    }
    next();
};

module.exports.validatePatent = (req, res, next) => {
    let { error } = patentSchema.validate(req.body);

    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
}

module.exports.validatePublication = (req, res, next) => {
    let { error } = publicationSchema.validate(req.body);

    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
}

module.exports.validateAcademic = (req, res, next) => {
    let { error } = academicSchema.validate(req.body);

    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
}

module.exports.validateBook = (req, res, next) => {
    let { error } = bookSchema.validate(req.body);

    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
}

module.exports.validateAward = (req, res, next) => {
    let { error } = awardSchema.validate(req.body);

    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
}

module.exports.validateProject = (req, res, next) => {
    let { error } = projectSchema.validate(req.body);

    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
}

// module.exports.isOwner = async (req, res, next) => {
//     const { id } = req.params;
//     let listing = await Listing.findById(id);

//     if(!listing.owner.equals(res.locals.currUser._id)){
//         req.flash("error", "You do not have permission to edit this listing.");
//         return res.redirect("/listings" + id);
//     }
//     next();
// };