const express = require("express");
const app = express();
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require('express-flash');
const port = 8080;

// const ExpressError = require("./utils/ExpressError.js");

//For Authentication
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "/views"));

app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended : true }));
app.use(express.json());

const MONGO_URL = "mongodb://127.0.0.1:27017/faculty2";

// const dbUrl = process.env.ATLASDB_URL;

main()
    .then(() => {
        console.log("DB connected successfully");
    })
    .catch((err) => {
        console.log(err);
    })

async function main(){
    // await mongoose.connect(dbUrl);
    await mongoose.connect(MONGO_URL);
}

//Session Implementation
const sessionOptions = {
    // store: store,
    secret : "mysupersecretkey",
    // secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie: {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash-message compatible middleware
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

const userRouter = require("./routes/user.js");//User routes of authenticate

app.use("/", userRouter);

app.get("/faculty/dashboard", (req, res) => {
    res.render("faculty/dashboard.ejs");
})

app.get("/hoi/dashboard", (req, res) => {
    res.send("HOI Dashboard");
})

app.get("/admin/dashboard", (req, res) => {
    res.send("Admin Dashboard");
})

app.listen(port, () => {
    console.log(`Server is listning on port ${port}`);
})