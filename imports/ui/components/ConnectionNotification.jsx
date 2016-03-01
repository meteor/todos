import React from 'react';

const ConnectionNotification = () => (
  <div className="notifications">
    <div className="notification">
      <span className="icon-sync"></span>
      <div className="meta">
        <div className="title-notification">Trying to connect</div>
        <div className="description">There seems to be a connection issue</div>
      </div>
    </div>
  </div>
);

export default ConnectionNotification;
