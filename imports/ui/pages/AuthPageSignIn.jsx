import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import i18n from 'meteor/universe:i18n';

import AuthPage from './AuthPage.jsx';

const SignInPage = () => {
  const history = useHistory();
  const [errors, setErrors] = useState({});

  const onSubmit = (event) => {
    event.preventDefault();

    const email = this.email.value;
    const password = this.password.value;
    const newErrors = {};

    if (!email) {
      newErrors.email = i18n.__('pages.authPageSignIn.emailRequired');
    }
    if (!password) {
      newErrors.password = i18n.__('pages.authPageSignIn.passwordRequired');
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length) {
      return;
    }

    Meteor.loginWithPassword(email, password, (err) => {
      if (err) {
        if (err) {
          setErrors({ none: err.reason });
        }
      } else {
        history.replace('/');
      }
    });
  };

  const errorMessages = Object.values(errors);
  const errorClass = (key) => errors[key] && 'error';

  const link = (
    <Link to="/join" className="link-auth-alt">
      {i18n.__('pages.authPageSignIn.needAccount')}
    </Link>
  );

  return (
    <AuthPage link={link}>
      <div className="wrapper-auth">
        <h1 className="title-auth">
          {i18n.__('pages.authPageSignIn.signIn')}
        </h1>
        <p className="subtitle-auth">
          {i18n.__('pages.authPageSignIn.signInReason')}
        </p>
        <form onSubmit={onSubmit}>
          <div className="list-errors">
            {errorMessages.map((msg) => (
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
    </AuthPage>
  );
};

export default SignInPage;
