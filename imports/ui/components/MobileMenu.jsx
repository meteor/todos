import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import BaseComponent from './BaseComponent.jsx';

class MobileMenu extends BaseComponent {
  constructor(props) {
    super(props);
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  toggleMenu() {
    this.props.menuOpen.set(!this.props.menuOpen.get());
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

MobileMenu.propTypes = {
  menuOpen: PropTypes.object.isRequired,
};

export default MobileMenu;
