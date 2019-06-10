import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserThumbPreview from './user-thumb-preview.jsx';

function Match(props) {
  const { user, userMatches, changeView} = props;
  const { displayName, profilePicURL, bio } = user;

  const [match, setMatch] = useState(userMatches[0]);
  const [interests, setInterests] = useState([]);

  function handleClick(e) {
    changeView(e.target.dataset.target, match);
  }

  useEffect(() => {
    axios.post('/interests/user', { email: match.email })
      .then((res) => {
        console.log(user, match);
        console.log(res);
        const interests = res.data.map(dbObj => dbObj.name);
        setInterests(interests);
      })
      .catch(err => console.error(err));
  }, [ match ]);

  function nextMatch(e) {
    const index = userMatches.indexOf(match);
    if (index + 1 < userMatches.length) {
      setMatch(userMatches[index + 1]);
      console.log(interests);
    }
  }

  return (
    <div className="mx-2 mb-3">
      <div className="d-flex flex-column">
        <div data-target="profile" onClick={handleClick}>{match.displayName}</div>
        <img data-target="profile" className="img-thumbnail img-sm" src={match.profilePicURL} onClick={handleClick} />
        <div className="d-flex flex-row">
          <button data-target="dm" type="button" className="btn btn-sm btn-success" onClick={handleClick}>slide into their DM </button>
          <button data-target="profile" type="button" className="btn btn-sm btn-success" onClick={nextMatch}>Show me another</button>
        </div>
        <div>
          <p>{match.bio}</p>
          <ul>
            {interests.map((interest) => {
              return <li>{interest}</li>
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

  // return (
  //   <div className="d-flex flex-row justify-content-between flex-wrap">
  //     {allUsers.filter(u => u.username !== user.username)
  //       .map(u => <UserThumbPreview key={u.username} user={u} changeView={changeView} />)}
  //   </div>
  // );
// }

export default Match;