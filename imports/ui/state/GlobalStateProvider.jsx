import React from 'react';
import PropTypes from 'prop-types';

import { LocaleProvider } from './LocaleState.jsx';
import { MenuOpenProvider } from './MenuOpenState.jsx';

export const GlobalStateProvider = ({
  menuOpen,
  children,
}) => (
  <LocaleProvider>
    <MenuOpenProvider menuOpen={menuOpen}>
      {children}
    </MenuOpenProvider>
  </LocaleProvider>
);

GlobalStateProvider.propTypes = {
  menuOpen: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

GlobalStateProvider.defaultProps = {
  menuOpen: false,
};
