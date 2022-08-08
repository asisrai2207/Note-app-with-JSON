// This file contains the logic to read and write from our JSON file so that information persists between logins.
// Create a class with methods that can be invoked
/**********************************************
 * Editing the Notes
 * ==================================
 ***********************************************/
/*

 */
// You will be using promises - remember...
// Promises are essentially task queues that “promise” a value will at some point be returned from asynchronous code.

const res = require("express/lib/response");

// Create a new NoteService class which takes a file as a dependency, this means whenever we are creating new instances of the noteService, we need to pass in a path to a file (this is the file that we will read, write and edit etc.)
class NoteService {
  constructor(file, fs) {
    this.file = file;
    this.fs = fs;
    this.init(); // Call the init() method.
    this.notes = {};
  }

  /** # Initialize class   #
/*  ====================== */
  // 1) Initialize class
  // The init promise only needs to run once.
  // When it runs, when it runs, this.read resolves with this.notes (the notes from our json file) as a globally available variable.
  // the init promise is not concerned with resolving data - it just needs to run once to ensure persistence of the notes within our JSON file.

  init() {
    new Promise((resolve, reject) => {
      // wait until the read method finishes before sending a "done" promise
      // a promise is an object that returns the state (indicates whether or not its done)
      // this.read().then(resolve)
      this.read().then((notes)=>{
        this.notes = notes;
        resolve();
      })
    });
  }

  /** # Read method  #
/*  ====================== */
  // 2) Create promise that reads file

  // The purpose of this method is to read out notes from our json file, once we have the data from the file, we store the parsed notes in an instance variable called this.notes the read method then resolves with this.notes

  /*
  Example: 
    let readFilePromise = new Promise((resolve, reject) => {
      this.fs.readFile("data.txt", "utf-8", (err, data) => {
        if (err) {
          reject(err);
        } else {
        // You will also have to parse this.notes
          resolve(data);
        }
      });
    });
  */

  read() {
    return new Promise((resolve, reject) => {
      this.fs.readFile(this.file, "utf-8", (err,data)=>{
        if(err){
          reject(err)
        }else {
          // this.notes = JSON.parse(data)
          // return resolve(this.notes)
          resolve(JSON.parse(data));
        }
      })
    });
  }

  /** # Write method  #
  /*  ====================== */
  // 3) Create promise that writes file
  // The write method is used to update our JSON file.
  // Promises (and Node.js style callbacks) are very useful for single-result functions
  // For instance, this.fs.writeFile fires the callback when all of the given contents have been written to the file.

  /*
    Example:
          let writeFilePromise = new Promise((resolve, reject) => {
            this.fs.writeFile("data.txt", data, (err) => {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            });
          });
    */
  write() {
    return new Promise((resolve, reject) => {
      this.fs.writeFile(this.file,JSON.stringify(this.notes),(err)=>{
        if(err){
          return reject(err);
          
        } else {
         resolve();
        }

      })
    });
  }
  /** # List method  #
  /*  ====================== */
  // 4) Get the notes for a specific user
  // The user is accessed via req.auth.user within our router.
  // The user is a parameter here (you can play with the user variable here )
  list(user) {
    // call the readfile method
    return this.read().then(() => {
      if(typeof this.notes[user] === "undefined"){
        return []; //if a user does not have a note than it will return empty array
      } else {
        return this.notes[user];    
      }
      // get the notes of that user
      // this.notes is an object - make sure you only get the notes of that user
      // HINT: grab the key
      // if note is not defined, return empty array
    });
  }
  /** # Add method  #
  /*  ====================== */
  // 5) Adds a note for the user
  // This method add notes updates the users notes, by adding the new note to this.notes,
  // it then calls this.write, to update our JSON file with the newest notes.
  add(note, user) {
    console.log("ADD METHOD");
    console.log("Note: " + note);
    console.log("User: " + user);
    if (typeof this.notes[user] === "undefined"){
      this.notes[user]= [];
    }this.notes[user].push(note);
    return this.write();
    // if user has not been created then add the user into this.notes object as key and the value as an empty array
    // get the list of notes, and then push the new note into that array
  }

  /** # Update method  #
  /*  ====================== */
  // 6) Updates a note
  // This method will be used to update a specific note in our application,
  // it also handles some errors for our application. Then it calls this.write to update the JSON file.
  update(index, note, user) {
    // if there is no user throw an error
    // if note does not exist throw an error
    if(typeof this.notes[user] === "undefined"){
      throw new Error("Cannot update a note, if the user doesnt exist")
    };
    if(this.notes[user].length <= index){
      throw new Error("Cannot update a note that doesnt exist");
    }
    this.notes[user][index] = note;
    return this.write();
  }

  /** # Remove method  #
  /*  ====================== */
  // 7) Removes a note
  // This method will remove a particular note from our this.notes. Then it calls this.write to update our JSON file.
  remove(index, user) {
    // if there is no user throw an error
    if(typeof this.notes[user] === "undefined"){
      throw new Error("Cannot delete a note, if the user doesnt exist")
    };
    // if note does not exist throw an error
    if(this.notes[user].length <= index){
      throw new Error("Cannot delete a note that doesnt exist");
    }
    // if we delete the note, we want to pass in the index position
    // so you would want to rewrite the notes for that user
      this.notes[user].splice(index,1);
      console.log("Note is deleted")
      return this.write();
    }
  }

module.exports = NoteService;
