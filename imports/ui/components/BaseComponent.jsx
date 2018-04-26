/* eslint-disable react/no-unused-state */

import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import i18n from 'meteor/universe:i18n';

class BaseComponent extends Component {
  static getDerivedStateFromProps() {
    return { redirectTo: null };
  }

  constructor(props) {
    super(props);
    this.state = {
      locale: i18n.getLocale(),
      redirectTo: null,
    };
    this.handleLocaleChange = this.handleLocaleChange.bind(this);
  }

  componentDidMount() {
    i18n.onChangeLocale(this.handleLocaleChange);
  }

  componentWillUnmount() {
    i18n.offChangeLocale(this.handleLocaleChange);
  }

  handleLocaleChange(locale) {
    this.setState({ locale });
  }

  redirectTo(path) {
    this.setState({ redirectTo: path });
  }

  renderRedirect() {
    return this.state.redirectTo
      ? <Redirect to={this.state.redirectTo} />
      : null;
  }
}

export default BaseComponent;
