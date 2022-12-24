const fs = require("fs");
const path = require("path");
const express = require("express");
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "/public")));
app.use(bodyParser.urlencoded({ extended: true }))

const accountData = fs.readFileSync("src/json/accounts.json", "utf8");
const accounts = JSON.parse(accountData);
const userData = fs.readFileSync("src/json/users.json", "utf8");
const users = JSON.parse(userData);

app.get("/", (req, res) => {
    res.render("index", { "title": "Account Summary", "accounts": accounts });
})

app.get("/savings", (req, res) => {
    res.render("account", { "title": "Savings", "account": accounts.savings });
})

app.get("/checking", (req, res) => {
    res.render("account", { "title": "Checking", "account": accounts.checking });
})

app.get("/credit", (req, res) => {
    res.render("account", { "title": "Credit", "account": accounts.credit });
})

app.get("/profile", (req, res) => {
    res.render("profile", { "title": "Profile", "user": users[0] });
})

app.get("/payment", (req, res) => {
    res.render("payment", { "title": "Payment", "account": accounts.credit });
})

app.post("/payment", (req, res) => {
    const amt = parseInt(req.body.amount);
    accounts["credit"].balance -= amt
    accounts["credit"].available += amt
    const accountsJSON = JSON.stringify(accounts);
    fs.writeFileSync(path.join(__dirname, "json/accounts.json"), accountsJSON, "utf8");
    res.render("payment", { "message": "Payment Completed", "account": accounts.credit });
})

app.get("/transfer", (req, res) => {
    res.render("transfer", { "title": "Transfer" });
})

app.post("/transfer", (req, res, next) => {
    const fromAcct = req.body.from;
    const amt = parseInt(req.body.amount);
    console.log(`transfering from ${fromAcct}`);

    if (req.body.from === "checking") {
        accounts["checking"].balance -= amt
        accounts["savings"].balance += amt
    }
    else {
        accounts["savings"].balance -= amt
        accounts["checking"].balance += amt
    }
    accountsJSON = JSON.stringify(accounts);
    fs.writeFileSync(path.join(__dirname, "json/accounts.json"), accountsJSON, "utf8");
    res.render("transfer", { "message": "Transfer Completed" });
})

app.listen(PORT, () => console.log(`PS Project Running on port ${PORT}!`));
