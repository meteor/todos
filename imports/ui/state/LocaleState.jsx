import React, {
  createContext,
  useContext,
  useState,
} from 'react';
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

const LocaleProvider = (props) => {
  const value = useState(defaultLocale);

  return <LocaleContext.Provider value={value} {...props} />;
};

export { LocaleProvider, useLocale };
