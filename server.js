// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT       = process.env.PORT || 8080;
const ENV        = process.env.ENV || "development";
const PHONE_OWNER = process.env.PHONE_OWNER || '+15555555555';
const express    = require("express");
const bodyParser = require("body-parser");
const sass       = require("node-sass-middleware");
const app        = express();
const morgan     = require('morgan');

// PG database client/connection setup
const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);

// Cookie Handling
const KEY_ONE = process.env.KEY_ONE;
const KEY_TWO = process.env.KEY_TWO;
const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'userSession',
  keys: [KEY_ONE, KEY_TWO]
}));

// Key for Font Awesome
const iconsKey = process.env.FONT_AWESOME;

// bcrypt - used for hashing passwords - Not In Use (conflict with bcrypt 3.0.6 and Node prior to 12)
const saltRounds = process.env.SALT_ROUNDS;

// Helper Functions
const { generateEmptyUser, getUserInfo } = require('./lib/helpers');

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const cartRoutes      = require("./routes/cart");
const loginRoutes     = require("./routes/login");
const logoutRoute     = require("./routes/logout");
const ordersRoutes    = require("./routes/orders");
const ownersRoutes    = require("./routes/owners");
const profileRoutes    = require("./routes/profile");
const registerRoutes  = require("./routes/register");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own

// APP
app.use("/cart",     cartRoutes(db, iconsKey));
app.use("/login",    loginRoutes(db, iconsKey));
app.use("/logout",   logoutRoute());
app.use("/orders",   ordersRoutes(db, iconsKey, PHONE_OWNER));
app.use("/owners",   ownersRoutes(db, iconsKey));
app.use("/profile",   profileRoutes(db, iconsKey));
app.use("/register", registerRoutes(db, iconsKey, saltRounds));
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get("/", (req, res) => {
  const userId = req.session.userId || '';

  const foodListQuery = `SELECT * FROM foods;`;

  db.query(foodListQuery)
    .then(foodData => {
      const foods = foodData.rows;
      getUserInfo(userId, db)
        .then(userInfo => {
          const user = userInfo;
          const params = {user, foods, iconsKey};
          res.render("index", params);

        })
        .catch(err => {
          res
            .status(500)
            .json({ error: err.message });
        });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });

});

// Sets the cookie to the cart value
app.post("/", (req, res) => {
  const userId = req.session.userId || '';

  if (userId) {
    const cartValue = req.body.cart;
    req.session.cart = cartValue;
    res.redirect('/cart');

  } else {
    const user = generateEmptyUser();
    const params = {user, iconsKey};
    res.render("404", params);
  }
});

// Default error page, when all else fails
app.use((req, res) => {
  const userId = req.session.userId || '';

  getUserInfo(userId, db)
    .then(userInfo => {
      const user = userInfo;
      const params = {user, iconsKey};
      res.render("404", params);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

module.exports = { db };
