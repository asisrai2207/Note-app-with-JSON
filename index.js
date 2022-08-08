/**********************************************
 * Notetaking Application Challenge
 * ==================================
 ***********************************************/

/** # Import all libraries  #
/*  ====================== */
// 1) Import all required modules

// In-built Node Modules (filesystem and path)
const fs = require("fs");
const path = require("path");

// NPM installed modules
// Set up your application, import the required packages
const express = require("express");
const { engine } = require("express-handlebars");
const basicAuth = require("express-basic-auth");
const port = 3000;

//Local Modules (Example: NoteRouter.js, AuthChallener.js)
// Capitalize the variable name if the file you're importing is a class
//Example
// const NoteRouter = require("./Routers/NoteRouter");
const NoteRouter = require("./Routers/NoteRouter");
const NoteService = require("./Services/NoteService")
const AuthChallenger = require("./AuthChallenger");

/** # Configure Express #
/*  ====================== */
// 2) Configure Express
// Set up handlebars (set up engine and register handlebars with express)
// Look at the example from the lecture: https://xccelerate.talentlms.com/unit/view/id:2002
// Set up Express
const app = express();

app.use(express.static("public"));
app.engine("handlebars", engine());
app.set("view engine", "handlebars");

// Set up any middleware required, like express.json() and express.urlencoded()
app.use(express.urlencoded({ extended: false }))
app.use(express.json()); 

// DON'T SET UP BASIC AUTH UNTIL NEXT WEEK
/*  ====================== */
// 5) Set up authentication
// Set up express-basic-auth using the AuthChallenger

app.use(
  basicAuth({
    authorizer: AuthChallenger(
      JSON.parse(fs.readFileSync(__dirname + "/Stores/users.json")) // JSON.parse to view the users in readable format
    ),
    challenge: true,
    realm: "Note Application",
  })
)

/** # Set up NoteService  #
/*  ====================== */
// 6) Create a new instance of noteService and pass 1) file path/to/the/file where you want the service to read from and write to and 2) fs module.
const noteService = new NoteService(__dirname + "/Stores/notes.json",fs )
/** # Set up basic express server  #
/*  ====================== */
// DON'T DO STEP FOUR UNTIL NEXT WEEK
// 4) Set up basic express server
// Set up your route handler for '/' and send index.handlebars page to the users

app.get("/", (req, res) => {
  // call noteService list method to list out all the notes from the user
  // You need a .then to wait for the list method to finish getting the notes and then pass the notes in the index.handlebars
  noteService.list(req.auth.user).then((notes) => {
    res.render("index", {
      user: req.auth.user,
      notes,
    });
  });
});

/** #  Set up Note Router  #
/*  ====================== */
// 7) Set up the NoteRouter - handle the requests and responses in the note, read from a file and return the actual data, get the note from your JSON file and return to the clients browser.
// any notes that go to api/routes will go to noterouter
// /api/notes/:id
app.use("/api/notes", new NoteRouter(noteService,express).router()); //pass in noteService and express as argument

// Set up the port that we are going to run the application on, therefore the port that we can view the application from our browser.
app.listen(port, () => {
  console.log("Listening on 3000");
});
