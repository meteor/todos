import React from 'react';
import i18n from 'meteor/universe:i18n';
import BaseComponent from './BaseComponent.jsx';

class Loading extends BaseComponent {
  render() {
    return (
      <img
        src="/logo-todos.svg"
        className="loading-app"
        alt={i18n.__('components.loading.loading')}
      />
    );
  }
}

export default Loading;
