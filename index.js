
require("dotenv").config();
const express = require("express");
const { engine } = require("express-handlebars");
const basicAuth = require("express-basic-auth");
const knexFile = require("./knexfile").development; //for PostgresSQL
const knex = require("knex")(knexFile);
const port = 3000;

//Local Modules (Example: NoteRouter.js, AuthChallener.js)
const NoteRouter = require("./Routers/NoteRouter");
const NoteService = require("./Services/NoteService")
const AuthChallenger = require("./AuthChallenger");

// Set up Express
const app = express();
app.use(express.json()); 

app.use(express.static("public"));
app.engine("handlebars", engine());
app.set("view engine", "handlebars");


app.use(
  basicAuth({
    authorizer: AuthChallenger(knex),
    challenge: true,
    realm: "Note Application with knex",
  })
)
const noteService = new NoteService(knex);


app.get("/", (req, res) => {
  noteService.list(req.auth.user).then((notes) => {
    res.render("index", {
      user: req.auth.user,
      notes,
    });
  });
});


app.use("/api/notes", new NoteRouter(noteService,express).router()); //pass in noteService and express as argument

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
