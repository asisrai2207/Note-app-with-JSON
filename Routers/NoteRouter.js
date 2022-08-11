class NoteRouter {
  constructor(noteService, express) {
    this.noteService = noteService;
    this.express = express;
  }
  
  router() {
    let router = this.express.Router();
    router.get("/", this.get.bind(this));   //With the bind() method, an object can borrow a method from another object
    router.post("/", this.post.bind(this));
    router.put("/:id", this.put.bind(this));
    router.delete("/:id", this.delete.bind(this));
    return router;
  }

  get(req, res) {
    let user = req.auth.user; //gives you username and password after verifying 
    return (
      this.noteService
        .list(user)
        .then((notes) => {
          console.log(notes);
          res.json(notes)
        })
        // This .catch is to handle any errors that may befall our project.
        .catch((err) => { 
          res.status(500).json(err);
          // Catch error
        })
    );
  }

  post(req, res) {
    let note = req.body.note;
    let user = req.auth.user;
    return (
      this.noteService
      .add(note, user)
        // call the add method here and pass note and user
        .then(() => {
          // list the notes of the user
          return this.noteService.list(user);
        })
        .then((notes) => {
          // make the notes into json format
          res.json(notes);
        })
        .catch((err) => {
          // Catch error
          res.status(500).json(err);
        })
    );
  }

  put(req, res) {
    let id = req.params.id;
    let note = req.body.note;
    let user = req.auth.user;
    //return this.noteService;
    return (
      this.noteService
      .update(id,note,user)
        // The noteService fires the update command, this will update our note (and our JSON file). Pass id, note and user as argument
        .then(() => {
          // Then we fire list note from the same noteService which returns the array of notes for that user.
          return this.noteService.list(user);
        })
        .then((notes) => {
          res.json(notes)
          // Then we respond to the request with all of our notes in the JSON format back to our clients browser.
        })
        .catch((err) => {
          // Catch error
          res.status(500).json(err);
        })
    );
  }

  delete(req, res) {
    let id = req.params.id;
    let user = req.auth.user;
    return (
      this.noteService
      .remove(id, user) // first remove the note. Pass id and user as argument
        .then(() => { 
          return this.noteService.list(user);
          // list it out
        })
        .then((notes) => {
          // format it into json
          res.json(notes);
        })
        .catch((err) => {
          // Catch error
          res.status(500).json(err);
        })
    );
  }
}

module.exports = NoteRouter;
