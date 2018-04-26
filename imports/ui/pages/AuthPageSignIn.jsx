import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import i18n from 'meteor/universe:i18n';
import BaseComponent from '../components/BaseComponent.jsx';

import AuthPage from './AuthPage.jsx';

class SignInPage extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = Object.assign(this.state, { errors: {} });
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(event) {
    event.preventDefault();
    const email = this.email.value;
    const password = this.password.value;
    const errors = {};

    if (!email) {
      errors.email = i18n.__('pages.authPageSignIn.emailRequired');
    }
    if (!password) {
      errors.password = i18n.__('pages.authPageSignIn.passwordRequired');
    }

    this.setState({ errors });
    if (Object.keys(errors).length) {
      return;
    }

    Meteor.loginWithPassword(email, password, (err) => {
      if (err) {
        this.setState({
          errors: { none: err.reason },
        });
      } else {
        this.redirectTo('/');
      }
    });
  }

  render() {
    const { errors } = this.state;
    const errorMessages = Object.keys(errors).map(key => errors[key]);
    const errorClass = key => errors[key] && 'error';

    const content = (
      <div className="wrapper-auth">
        <h1 className="title-auth">
          {i18n.__('pages.authPageSignIn.signIn')}
        </h1>
        <p className="subtitle-auth">
          {i18n.__('pages.authPageSignIn.signInReason')}
        </p>
        <form onSubmit={this.onSubmit}>
          <div className="list-errors">
            {errorMessages.map(msg => (
              <div className="list-item" key={msg}>{msg}</div>
            ))}
          </div>
          <div className={`input-symbol ${errorClass('email')}`}>
            <input
              type="email"
              name="email"
              ref={(c) => { this.email = c; }}
              placeholder={i18n.__('pages.authPageSignIn.yourEmail')}
            />
            <span
              className="icon-email"
              title={i18n.__('pages.authPageSignIn.yourEmail')}
            />
          </div>
          <div className={`input-symbol ${errorClass('password')}`}>
            <input
              type="password"
              name="password"
              ref={(c) => { this.password = c; }}
              placeholder={i18n.__('pages.authPageSignIn.password')}
            />
            <span
              className="icon-lock"
              title={i18n.__('pages.authPageSignIn.password')}
            />
          </div>
          <button type="submit" className="btn-primary">
            {i18n.__('pages.authPageSignIn.signInButton')}
          </button>
        </form>
      </div>
    );

    const link = (
      <Link to="/join" className="link-auth-alt">
        {i18n.__('pages.authPageSignIn.needAccount')}
      </Link>
    );

    return this.renderRedirect() ||
      <AuthPage content={content} link={link} menuOpen={this.props.menuOpen} />;
  }
}

SignInPage.propTypes = {
  menuOpen: PropTypes.object.isRequired,
};

export default SignInPage;
