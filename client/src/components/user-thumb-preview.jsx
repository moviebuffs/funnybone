import React from 'react';


function UserThumbPreview(props) {
  const { user, changeView, onlineUsers } = props;
  const { displayName, profilePicURL } = user;

  function handleClick(e) {
    changeView(e.target.dataset.target, user);
  }

  if (onlineUsers.includes(user.email)) {
    console.log(`${user.email} is online`);
    return (
      <div className="mx-2 mb-3">
        <div className="d-flex flex-column">
          <div data-target="profile" onClick={handleClick}>{displayName}</div>
          {/* <span class="border border-warning"> */}
            <img data-target="profile" className="img-thumbnail img-sm border border-warning" src={profilePicURL} onClick={handleClick} />
          {/* </span> */}
          <ul>
            <li className="text-warning font-weight-bold online-user">Online Now!</li>
          </ul>
          <button data-target="dm" type="button" className="btn btn-sm btn-success" onClick={handleClick}>slide into their DM </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="mx-2 mb-3">
        <div className="d-flex flex-column">
          <div data-target="profile" onClick={handleClick}>{displayName}</div>
          <img data-target="profile" className="img-thumbnail img-sm" src={profilePicURL} onClick={handleClick} />
          <button data-target="dm" type="button" className="btn btn-sm btn-success" onClick={handleClick}>slide into their DM </button>
        </div>
      </div>
    );
  }

}

export default UserThumbPreview;
