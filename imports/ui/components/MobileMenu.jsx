import React from 'react';
// XXX: no session!
import { Session } from 'meteor/session';

function toggleMenu() {
  Session.set('menuOpen', !Session.get('menuOpen'));
}

const MobileMenu = () => (
  <div className="nav-group">
    <a href="#toggle-menu" className="nav-item" onClick={toggleMenu}>
      <span className="icon-list-unordered" title="Show menu" />
    </a>
  </div>
);

export default MobileMenu;
