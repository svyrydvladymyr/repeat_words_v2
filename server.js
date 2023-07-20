const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const logRoute = require("./modules/service").errorLog;

// dotenv
// const dotenv = require("dotenv");
// dotenv.config({ path: `.${process.env.NODE_ENV}.env` });

// creating DB tables
const DB = require('./modules/db-models/createDB');
// DB.table('users');
// DB.table('settings');
// DB.table('words');
// DB.table('wordsettings');
// DB.table('lists');
// DB.table('wordinlist');
// DB.table('useractions');
// DB.rule('admin');

//routs
const renderPage = require("./modules/pages/pagesController");
const settings = require("./modules/settings/routers");

//oaugh
const oaugh = require("./modules/oauth/oauthController.js");
oaugh.initialize(app);
oaugh.autorisation(app, "google");
oaugh.autorisation(app, "facebook");
oaugh.autorisation(app, "linkedin");

//telegram bot
// const telegram = require("./modules/bot/botController");
// telegram.botCreating();

//template engineer
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

//static files
app.use(express.static(__dirname + "/public"));
// app.use('/blog', express.static(__dirname + "/public"));

//parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json({limit: "20mb"}));
// app.use(bodyParser.urlencoded({limit: "20mb", extended: true, parameterLimit:20000}));
app.use(cookieParser());

//console logs
app.use((req, res, next) => {
    logRoute(req.url, 'route', `-URL-REQUEST:-(${req.method})---`, req);
    next();
});

//routs
app.use("/settings", settings);

app.use((req, res, next) => {
    (req.url.slice(-1) === '/' && req.url.length > 1 && !/\?[^]*\//.test(req.url))
        ? res.redirect(301, req.url.slice(0, -1))
        : next();
});

//pages
app.get("/", renderPage.userData);
app.get("/home", renderPage.userData);
app.get("/profile", renderPage.userData);
app.get("/settings", renderPage.userData);
app.get("/about", renderPage.userData);
app.get("/contacts", renderPage.userData);
app.get("/notification", renderPage.userData);
app.get("/friends", renderPage.userData);
app.get("/privacy-policy", renderPage.userData);

//redirect to home page
app.get("/$", (req, res, next) => { res.redirect("/home") });
app.get("*", (req, res) => { res.redirect("/home") });

//creating server
const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
    error
        ? console.log("\u001b[31mServer ERROR:\u001b[0m", error)
        : console.log(`\u001b[36mServer is running at \u001b[33m${PORT}\u001b[0m \u001b[36mport!\u001b[0m`);
});