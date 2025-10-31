const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs-extra");

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "supersecretkey",
    resave: false,
    saveUninitialized: true,
  })
);

// Handlebars setup
app.engine(
  "hbs",
  exphbs.engine({
    extname: ".hbs",
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views/layouts"),
    partialsDir: path.join(__dirname, "views/partials"),
  })
);
app.set("view engine", "hbs");

// Simulated Database
const USERS_FILE = path.join(__dirname, "data/users.json");
if (!fs.existsSync(USERS_FILE)) fs.writeJsonSync(USERS_FILE, []);

// Utility to read/write users
const getUsers = async () => fs.readJson(USERS_FILE);
const saveUsers = async (users) => fs.writeJson(USERS_FILE, users, { spaces: 2 });

// Middleware for auth protection
function requireAuth(req, res, next) {
  if (req.session.user) return next();
  res.redirect("/login");
}

// Routes
app.get("/", (req, res) => {
  if (req.session.user) return res.redirect("/dashboard");
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  res.render("login", { message: req.session.message });
  req.session.message = null;
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const users = await getUsers();
  const user = users.find((u) => u.email === email);

  if (!user) {
    req.session.message = "No account found with that email.";
    return res.redirect("/login");
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    req.session.message = "Incorrect password.";
    return res.redirect("/login");
  }

  req.session.user = { name: user.name, email: user.email };
  res.redirect("/dashboard");
});

app.get("/signup", (req, res) => {
  res.render("signup", { message: req.session.message });
  req.session.message = null;
});

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const users = await getUsers();

  if (users.find((u) => u.email === email)) {
    req.session.message = "Email already registered.";
    return res.redirect("/signup");
  }

  const hash = await bcrypt.hash(password, 10);
  users.push({ name, email, password: hash });
  await saveUsers(users);

  req.session.message = "Account created! Please login.";
  res.redirect("/login");
});

app.get("/dashboard", requireAuth, (req, res) => {
  res.render("dashboard", { user: req.session.user });
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/login"));
});

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`✅ Server running at http://localhost:${PORT}`)
);
