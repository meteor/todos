import React from 'react';
// XXX: no session!
import { Session } from 'meteor/session';
import i18n from 'meteor/universe:i18n';
import BaseComponent from './BaseComponent.jsx';

class MobileMenu extends BaseComponent {
  constructor(props) {
    super(props);
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  toggleMenu() {
    Session.set('menuOpen', !Session.get('menuOpen'));
  }

  render() {
    return (
      <div className="nav-group">
        <a href="#toggle-menu" className="nav-item" onClick={this.toggleMenu}>
          <span
            className="icon-list-unordered"
            title={i18n.__('components.mobileMenu.showMenu')}
          />
        </a>
      </div>
    );
  }
}

export default MobileMenu;
