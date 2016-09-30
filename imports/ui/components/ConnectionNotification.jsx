import React from 'react';
import i18n from 'meteor/universe:i18n';

const T = i18n.createComponent();

const ConnectionNotification = () => (
  <div className="notifications">
    <div className="notification">
      <span className="icon-sync" />
      <div className="meta">
        <div className="title-notification">
          <T>components.connectionNotification.tryingToConnect</T>
        </div>
        <div className="description">
          <T>components.connectionNotification.connectionIssue</T>
        </div>
      </div>
    </div>
  </div>
);

export default ConnectionNotification;
