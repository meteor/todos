import React, {
  createContext,
  useContext,
  useState,
} from 'react';
import PropTypes from 'prop-types';

const MenuOpenContext = createContext(undefined);

const useMenuOpen = () => {
  const context = useContext(MenuOpenContext);

  if (!context) {
    throw new Error('useMenuOpen must be used within a MenuOpenProvider');
  }

  return context;
};

const MenuOpenProvider = ({ menuOpen: initMenuOpen }) => {
  const value = useState(initMenuOpen);

  return <MenuOpenContext.Provider value={value} />;
};

MenuOpenProvider.propTypes = {
  menuOpen: PropTypes.bool.isRequired,
};

export { MenuOpenProvider, useMenuOpen };
