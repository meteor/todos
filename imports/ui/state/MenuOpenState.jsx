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

const MenuOpenProvider = ({
  menuOpen: initMenuOpen,
  children,
}) => {
  const value = useState(initMenuOpen);

  return (
    <MenuOpenContext.Provider value={value}>
      {children}
    </MenuOpenContext.Provider>
  );
};

MenuOpenProvider.propTypes = {
  menuOpen: PropTypes.bool.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export { MenuOpenProvider, useMenuOpen };
