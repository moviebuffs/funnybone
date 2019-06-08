/* eslint-disable import/extensions */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserThumbPreview from './user-thumb-preview.jsx';
import Profile from './profile.jsx';
import Inbox from './inbox.jsx';
import MessageComposer from './message-composer.jsx';
import Match from './match.jsx';
import _ from 'lodash';
// import { useInflection } from 'sequelize/types';

//See MainViewHeader and MainViewBody below
export function MainView(props) {
  const {
    view, changeView, mainViewUser, user
  } = props;

  function getViewTarget(target) {
    changeView(target, mainViewUser);
  }

  return (
    <div className="card text-white bg-secondary mb-3">

      <MainViewHeader getViewTarget={getViewTarget} view={view} />

      <div className="card-body">
        <MainViewBody parentProps={props} />
      </div>

    </div>
  );
}


export function MainViewHeader(props) {
  const { getViewTarget, view } = props;

  function handleClick(e) {
    getViewTarget(e.target.dataset.target);
  }


  return (
    <div className="card-header d-flex flex-row justify-content-around">
      {/* <button id="text" type="button" className="btn btn-secondary">Text</button> */}
      <button className="btn btn-sm btn-primary" data-target="browse" onClick={handleClick}>browse</button>
      <h4>{view}</h4>
      <button className="btn btn-sm btn-primary" data-target="inbox" onClick={handleClick}>inbox</button>
      <button className="btn btn-sm btn-primary" data-target="match" onClick={handleClick}>Find a Match!</button>
    </div>
  );
}

// handles Switching between profile, dm, inbox, browse
export function MainViewBody(props) {
  const { parentProps } = props;
  const {
    view, changeView, user, mainViewUser, allUsers, selectedContent, setSelectedContent,
  } = parentProps;

  const [userMatches, setUserMatches] = useState([]);
  const [interests, setInterests] = useState([]);

  useEffect(() => {
    axios.post('/interests/user', { email: user.email })
      .then((res) => {
        const interests = res.data.map(dbObj => dbObj.name);
        setInterests(interests);
        axios.post('/interests/pull', { interests: interests })
          .then((response) => {
            const matches = response.data.filter(match => match.email !== user.email)
            setUserMatches(_.shuffle(matches));
          })
          .catch(err => console.error(err));
      })
      .catch(err => console.error(err));
  }, [ user ]);

  if (view === 'profile') {
    return (
      <Profile interests={interests} mainViewUser={mainViewUser} changeView={changeView} />
    );
  }
  if (view === 'dm') {
    return (
      <MessageComposer user={user} mainViewUser={mainViewUser} changeView={changeView} selectedContent={selectedContent} setSelectedContent={setSelectedContent} />
    );
  }
  if (view === 'inbox') {
    return (
      <Inbox user={user} allUsers={allUsers} changeView={changeView} />
    );
  }
  if (view === 'match') {
    return (
      <Match user={user} userMatches={userMatches} interests={interests} changeView={changeView} />
    );
  }
  // Browse
  return (

    <div className="d-flex flex-row justify-content-between flex-wrap">
      { allUsers.filter(u => u.username !== user.username)
        .map(u => <UserThumbPreview key={u.username} user={u} changeView={changeView} />) }
    </div>

  );
}



// export default MainView;
