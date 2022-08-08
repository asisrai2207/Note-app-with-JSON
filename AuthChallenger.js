// Declare the function Auth Challenger that takes in one parameter, the users

const AuthChallenger = (users) => {
  // This will return True or False
  console.log(users);
  return (username, password) => {
    // This is the password and username that we receive when prompted by our HTML file.
    // code here
    // Logic to see if we can match the username given to a username stored in our JSON file, and if the password matches
    return users[username]!== undefined && users[username]===password
  };
};
// This code exports the function we hae just defined.
module.exports = AuthChallenger;
