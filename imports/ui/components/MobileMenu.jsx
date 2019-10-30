import React from 'react';
import i18n from 'meteor/universe:i18n';
import { useMenuOpen } from '../state/MenuOpenState.jsx';

const MobileMenu = () => {
  const [menuOpen, setMenuOpen] = useMenuOpen();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="nav-group">
      <a href="#toggle-menu" className="nav-item" onClick={toggleMenu}>
        <span
          className="icon-list-unordered"
          title={i18n.__('components.mobileMenu.showMenu')}
        />
      </a>
    </div>
  );
};

export default MobileMenu;
