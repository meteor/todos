import React, { useEffect, useState } from 'react';
import i18n from 'meteor/universe:i18n';
import getLanguages from '../../api/languages/methods.js';
import { useLocale } from '../state/LocaleState.jsx';

const LanguageToggle = () => {
  const [languages, setLanguages] = useState([]);
  const [locale] = useLocale();

  useEffect(() => {
    getLanguages.call((error, newLanguages) => {
      if (!error) {
        setLanguages(newLanguages);
      }
    });
  }, []);

  const setI18nLocale = (event, language) => {
    event.preventDefault();
    if (language) {
      i18n.setLocale(language);
    }
  };

  return (
    <div className="language-toggle">
      {languages.map((language) => {
        let content;
        if (language === locale) {
          content = (
            <span key={language} className="language active">{language}</span>
          );
        } else {
          content = (
            <a
              key={language}
              href="#toggle-language"
              className="language"
              onClick={(event) => setI18nLocale(event, language)}
            >
              {language}
            </a>
          );
        }
        return content;
      })}
    </div>
  );
};

export default LanguageToggle;
