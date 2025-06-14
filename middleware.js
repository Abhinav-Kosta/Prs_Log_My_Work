const ExpressError = require("./utils/ExpressError");
const Patent = require("./models/patent");
const Publication = require("./models/publish");
const Academic = require("./models/academicEvent");
const Book = require("./models/bookChapter");
const Award = require("./models/award");
const Project = require("./models/projectSubmission");
const {
    editUserSchema,
    patentSchema, 
    publicationSchema, 
    academicSchema, 
    bookSchema, 
    awardSchema, 
    projectSchema, 
    } = require("./schema");

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

module.exports.isHOIOrAdmin = (req, res, next) => {
  if (req.isAuthenticated() && (req.user.role === "hoi" || req.user.role === "admin")) {
    return next();
  }
  req.flash("error", "Unauthorized access.");
  res.redirect("/");
};

module.exports.validateUser = (req, res, next) => {
    let { error } = editUserSchema.validate(req.body);

    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
}

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

module.exports.isPatentOwner = async (req, res, next) => {
    const { patId } = req.params;
    let patent = await Patent.findById(patId);

    if(!patent.user.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of this Patent.");
        return res.redirect(`/${req.user.role}/patents/${req.user._id }`);
    }
    next();
};

module.exports.isPublicationOwner = async (req, res, next) => {
    const { pubId } = req.params;
    let publication = await Publication.findById(pubId);

    if(!publication.user.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of this Publication.");
        return res.redirect(`/${req.user.role}/publications/${req.user._id }`);
    }
    next();
};

module.exports.isAcademicOwner = async (req, res, next) => {
    const { acdId } = req.params;
    let academic = await Academic.findById(acdId);

    if(!academic.user.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of this Academic.");
        return res.redirect(`/${req.user.role}/academic-events/${req.user._id }`);
    }
    next();
};

module.exports.isBookOwner = async (req, res, next) => {
    const { bookId } = req.params;
    let book = await Book.findById(bookId);

    if(!book.user.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of this Book Chapter.");
        return res.redirect(`/${req.user.role}/books/${req.user._id }`);
    }
    next();
};

module.exports.isAwardOwner = async (req, res, next) => {
    const { awdId } = req.params;
    let award = await Award.findById(awdId);

    if(!award.user.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of this Award.");
        return res.redirect(`/${req.user.role}/awards/${req.user._id }`);
    }
    next();
};

module.exports.isProjectOwner = async (req, res, next) => {
    const { pjtId } = req.params;
    let project = await Project.findById(pjtId);

    if(!project.user.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of this Project.");
        return res.redirect(`/${req.user.role}/projects/${req.user._id}`);
    }
    next();
}