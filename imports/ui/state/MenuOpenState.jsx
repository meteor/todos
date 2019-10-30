import React, {
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';
import PropTypes from 'prop-types';

const MenuOpenContext = createContext(undefined);

const useMenuOpen = () => {
  const context = useContext(menuOpenContext);

  if (!context) {
    throw new Error('useMenuOpen must be used within a MenuOpenProvider');
  }

  return context;
};

const MenuOpenProvider = ({
  menuOpen: initMenuOpen,
  ...props,
}) => {
  const [menuOpen, setMenuOpen] = useState(initMenuOpen);
  const value = useMemo(() => [menuOpen, setMenuOpen], [menuOpen]);

  return <MenuOpenContext.Provider value={value} {...props} />;
};

MenuOpenProvider.propTypes = {
  menuOpen: PropTypes.bool.isRequired,
};

export { MenuOpenProvider, useMenuOpen };
