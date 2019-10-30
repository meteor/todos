import React, {
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';
import i18n from 'meteor/universe:i18n';

const LocaleContext = createContext(undefined);

const useLocale = () => {
  const context = useContext(localeContext);

  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }

  return context;
};

const LocaleProvider = (props) => {
  const [locale, setLocale] = useState(i18n.getLocale());
  const value = useMemo(() => [locale, setLocale], [locale]);

  return <LocaleContext.Provider value={value} {...props} />;
};

export { LocaleProvider, useLocale };
