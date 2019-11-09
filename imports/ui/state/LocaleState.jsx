import React, {
  createContext,
  useContext,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';

const defaultLocale = i18n.getLocale().substr(0, 2);

const LocaleContext = createContext(undefined);

const useLocale = () => {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }

  return context;
};

const LocaleProvider = ({ children }) => {
  const value = useState(defaultLocale);

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
};

LocaleProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export { LocaleProvider, useLocale };
