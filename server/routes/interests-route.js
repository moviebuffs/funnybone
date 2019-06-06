const express = require('express');
const router = express.Router();
const { findAllUsers, pullUsersFromInterests, storeUsersInterests, findUserId, storeInterests, findInterestsId } = require('../../database-mysql/db-helpers');

router.post('/store', (req, res) => {
  const { interests, email } = req.body;
  
  Promise.all(interests.map(int => storeInterests(int))) // store interests in database
    .then(intArr => { // 
      findUserId(email).then(userDbId => { // pull id from user passed in to req.body via email
        const intIds = intArr.map(interest => interest[0].id) // map id's from each interest stored and stores interests in join table by interest id and user id
        console.log(intIds, userDbId)
        intIds.forEach(intDbId => storeUsersInterests(userDbId, intDbId).catch(error => console.error("Could not store data in the join table", error))) 
      }) 
    })
    .then(() => res.send(201))
    .catch(error => console.error(error, "Something went wrong"));
})

router.post('/pull', (req, res) => {
  const { interests } = req.body;
  Promise.all(interests.map(int => findInterestsId(int))) // find interest ids that match names
    .then(intIdArr => Promise.all(intIdArr.map(intId => pullUsersFromInterests(intId))))
    .then(userIdData => {
      const userIds = userIdData[0].map(userModel => userModel.userId).filter((id, ind, arr) => arr.indexOf(id) >= ind) // filter unique userIds
      return findAllUsers(userIds)
    })
    .then(userNameData => res.send(userNameData))
    .catch(error => console.log("Could not store data in the join table", error));
})
    
module.exports = router;
