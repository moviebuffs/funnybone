const express = require('express');
const helpers = require('../../database-mysql/db-helpers');
// const bodyParser = require('body-parser');
const router = express.Router();
// app.use(bodyParser.json());

/**
 * This route gets all users from the database
 */
router.get('/', (req, res) => {
  helpers
    .getUsers(req.user)
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      res.send(err);
    });
});

/**
 * This route post the saved user and checks verify the user and
 * if theres an error, sends one. else redirects
 */
router.post('/', (req, res) => {
  // res.send('POST handler for /api/user route.');
  const user = req.body;
  const { displayName, username, email, bio, password, profilePicURL, interests } = req.body;

  Promise.all(interests.map(int => helpers.storeInterests(int))) // store interests in database
    .then(intArr => helpers.findUserId(email)
      .then(userDbId => { // pull id from user passed in to req.body via email
        const intIds = intArr.map(interest => interest[0].id) // map id's from each interest stored and stores interests in join table by interest id and user id
        console.log(intIds, userDbId)
        intIds.forEach(intDbId => helpers.storeUsersInterests(userDbId, intDbId).catch(error => console.error("Could not store data in the join table", error)))
      })
    )

  helpers.saveUser({
    displayName,
    username,
    email,
    bio,
    password,
    profilePicURL,
  })
  .then(savedUser => {
    console.log(savedUser);
    req.login(savedUser, (err) => {
      if (err) res.sendStatus(404);
      else res.redirect('/');
    });
  })
  .catch(() => res.redirect('/login'));
});

module.exports = router;
