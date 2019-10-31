import React from 'react';
import i18n from 'meteor/universe:i18n';

const Loading = () => (
  <img
    src="/logo-todos.svg"
    className="loading-app"
    alt={i18n.__('components.loading.loading')}
  />
);

export default Loading;
