
const fs = require("fs");
const path = require("path");

const express = require("express");
const { engine } = require("express-handlebars");
const basicAuth = require("express-basic-auth");
const port = 3000;


const NoteRouter = require("./Routers/NoteRouter");
const NoteService = require("./Services/NoteService")
const AuthChallenger = require("./AuthChallenger");

const app = express();

app.use(express.static("public"));
app.engine("handlebars", engine());
app.set("view engine", "handlebars");


app.use(express.urlencoded({ extended: false }))
app.use(express.json()); 


app.use(
  basicAuth({
    authorizer: AuthChallenger(
      JSON.parse(fs.readFileSync(__dirname + "/Stores/users.json")) // JSON.parse to view the users in readable format
    ),
    challenge: true,
    realm: "Note Application",
  })
)

const noteService = new NoteService(__dirname + "/Stores/notes.json",fs )

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
  console.log("Listening on 3000");
});
