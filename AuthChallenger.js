// Declare the function Auth Challenger that takes in one parameter, the users

const AuthChallenger = (knex) => {
  return async (username, password) => {
    const data = await knex("users").where({username, password}).first();
    return data ? true : false; //if true return data
  }

};
// This code exports the function we hae just defined.
module.exports = AuthChallenger;
