
const res = require("express/lib/response");

class NoteService {
  constructor(knex) {
   this.knex = knex;
  }

  list(user) {
    return this.knex("users")
    .select("notes.content", "notes.id")
    .join("notes", "users.id", "notes.user_id")
    .where("username", user)
    .orderBy("notes.id", "asc");
  }

  add(note, user) {
   return this.knex("users")
   .select("id")
   .where("username", user)
   .first()
   .then((data)=>{
     return this.knex("notes").insert({user_id: data.id, content: note});
   });

  }


  update(id, note, user) {
 return this.knex("notes").update({content: note}).where({id : id});
  }

 
  remove(id, note) {
    return this.knex("notes").delete().where({id : id});
  }
}
module.exports = NoteService;
