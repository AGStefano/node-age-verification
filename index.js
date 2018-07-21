const express = require("express");
const nunjucks = require("nunjucks");
const path = require("path");
const bodyParser = require("body-parser");
const moment = require("moment");

const app = express();

nunjucks.configure("views", {
  autoescape: true,
  express: app
});

app.set("view engine", "njk");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({ extended: false }));

// Verifica se o campo nome foi preenchido
const verificationUsername = (req, res, next) => {
  if (req.query.nome) {
    next();
  } else {
    res.redirect("/"); // Caso negativo redireciona para o main
  }
};

app.get("/", (req, res) => {
  res.render("main");
});

app.post("/check", (req, res) => {
  const data_nascimento = req.body.idade;
  const idade = moment().diff(moment(data_nascimento, "YYYY/MM/DD"), "years");
  if (idade > 18) {
    res.redirect(`/major?nome=${req.body.nome}`); // redireciona para major caso a idade seja superior a 18
  }
  res.redirect(`/minor?nome=${req.body.nome}`); // redireciona para minor caso a idade seja inferior a 18
});

app.get("/major", verificationUsername, (req, res) => {
  res.render("major", { nome: req.query.nome });
});

app.get("/minor", verificationUsername, (req, res) => {
  res.render("minor", { nome: req.query.nome });
});

app.listen(3000);
