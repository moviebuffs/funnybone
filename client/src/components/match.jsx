import React, { useState, useEffect } from 'react';
import UserThumbPreview from './user-thumb-preview.jsx';

function Match(props) {
  const { user, userMatches, changeView, interests } = props;
  const { displayName, profilePicURL, bio } = user;

  const [match, setMatch] = useState(userMatches[0]);

  function handleClick(e) {
    changeView(e.target.dataset.target, match);
  }

  function nextMatch(e) {
    const index = userMatches.indexOf(match);
    if (index + 1 < userMatches.length) {
      setMatch(userMatches[index + 1]);
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
              <li>interest</li>
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