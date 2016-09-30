import React from 'react';
import i18n from 'meteor/universe:i18n';
import BaseComponent from './BaseComponent.jsx';
import getLanguages from '../../api/languages/methods';

class LanguageToggle extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = Object.assign(this.state, { languages: [] });
  }

  componentDidMount() {
    getLanguages.call((error, languages) => {
      if (!error) {
        this.setState({
          languages,
        });
      }
    });
  }

  setLocale(event, language) {
    event.preventDefault();
    if (language) {
      i18n.setLocale(language);
    }
  }

  renderLanguages() {
    return this.state.languages.map((language) => {
      let content;
      if (language === this.state.locale) {
        content = (
          <span key={language} className="language active">{language}</span>
        );
      } else {
        content = (
          <a
            key={language}
            href="#toggle-language"
            className="language"
            onClick={event => this.setLocale(event, language)}
          >
            {language}
          </a>
        );
      }
      return content;
    });
  }

  render() {
    return (
      <div className="language-toggle">
        {this.renderLanguages()}
      </div>
    );
  }
}

export default LanguageToggle;
