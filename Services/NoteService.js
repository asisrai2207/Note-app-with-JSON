
const res = require("express/lib/response");

class NoteService {
  constructor(file, fs) {
    this.file = file;
    this.fs = fs;
    this.init(); // Call the init() method.
    this.notes = {};
  }


  init() {
    new Promise((resolve, reject) => {
      this.read().then((notes)=>{
        this.notes = notes;
        resolve();
      })
    });
  }

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

  list(user) {
    // call the readfile method
    return this.read().then(() => {
      if(typeof this.notes[user] === "undefined"){
        return []; //if a user does not have a note than it will return empty array
      } else {
        return this.notes[user];    
      }

    });
  }

  add(note, user) {
    console.log("ADD METHOD");
    console.log("Note: " + note);
    console.log("User: " + user);
    if (typeof this.notes[user] === "undefined"){
      this.notes[user]= [];
    }this.notes[user].push(note);
    return this.write();

  }


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

 
  remove(index, user) {
    // if there is no user throw an error
    if(typeof this.notes[user] === "undefined"){
      throw new Error("Cannot delete a note, if the user doesnt exist")
    };
    if(this.notes[user].length <= index){
      throw new Error("Cannot delete a note that doesnt exist");
    }
      this.notes[user].splice(index,1);
      console.log("Note is deleted")
      return this.write();
    }
  }

module.exports = NoteService;
