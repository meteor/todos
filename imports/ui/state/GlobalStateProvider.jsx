import React from 'react';
import PropTypes from 'prop-types';

import { LocaleProvider } from './LocaleState.jsx';
import { MenuOpenProvider } from './MenuOpenState.jsx';

export const GlobalStateProvider = ({ menuOpen }) => (
  <LocaleProvider>
    <MenuOpenProvider menuOpen={menuOpen} />
  </LocaleProvider>
);

GlobalStateProvider.propTypes = {
  menuOpen: PropTypes.bool,
};

GlobalStateProvider.defaultProps = {
  menuOpen: false,
};
