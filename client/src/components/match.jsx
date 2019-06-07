import React from 'react';
import UserThumbPreview from './user-thumb-preview.jsx';


function Match(props) {
  const { user, allUsers, handleClick, changeView } = props;
  // const { name, profilePicURL } = user;

  // function handleClick(e) {
  //   changeView(e.target.dataset.target, user);
  // }

  // useEffect(() => {
  //   fetchConvo();
  //   lastMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
  // }, [conversation.length]);

  function fetchMatch() {
    axios.get(`api/message/${user.id},${mainViewUser.id}`).then((response) => {
      setConversation(response.data);
    }).catch(() => {
      // console.error(err);
    });
  }

  return (
    <div className="d-flex flex-row justify-content-between flex-wrap">
      {allUsers.filter(u => u.username !== user.username)
        .map(u => <UserThumbPreview key={u.username} user={u} changeView={changeView} />)}
    </div>
    // <div className="mx-2 mb-3">
    //   <div className="d-flex flex-column">
    //     <div data-target="profile" onClick={handleClick}>{name}</div>
    //     <img data-target="profile" className="img-thumbnail img-sm" src={profilePicURL} onClick={handleClick} />
    //     <button data-target="dm" type="button" className="btn btn-sm btn-success" onClick={handleClick}>slide into their DM </button>
    //   </div>
    // </div>
  );
}

export default Match;