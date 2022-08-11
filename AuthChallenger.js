const AuthChallenger = (users) => {
  // This will return True or False
  console.log(users);
  return (username, password) => {
    return users[username]!== undefined && users[username]===password
  };
};
// This code exports the function we hae just defined.
module.exports = AuthChallenger;
