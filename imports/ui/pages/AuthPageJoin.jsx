import React, { useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Accounts } from 'meteor/accounts-base';
import i18n from 'meteor/universe:i18n';

import { useUnmountedRef } from '../hooks/useUnmountedRef.jsx';
import AuthPage from './AuthPage.jsx';

const JoinPage = () => {
  const history = useHistory();
  const [errors, setErrors] = useState({});
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmRef = useRef();
  const unmountedRef = useUnmountedRef();

  const onSubmit = (event) => {
    event.preventDefault();

    const email = emailRef.current ? emailRef.current.value : '';
    const password = passwordRef.current ? passwordRef.current.value : '';
    const confirmPassword = confirmRef.current ? confirmRef.current.value : '';
    const newErrors = {};

    if (!email) {
      newErrors.email = i18n.__('pages.authPageJoin.emailRequired');
    }
    if (!password) {
      newErrors.password = i18n.__('pages.authPageJoin.passwordRequired');
    }
    if (confirmPassword !== password) {
      newErrors.confirmPassword = i18n.__('pages.authPageJoin.passwordConfirm');
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length) {
      return;
    }

    Accounts.createUser({
      email,
      password,
    }, (err) => {
      if (unmountedRef.current) {
        // Return to avoid the setState calls
        return;
      }

      if (err) {
        setErrors({ none: err.reason });
      } else {
        history.replace('/');
      }
    });
  };

  const errorMessages = Object.values(errors);
  const errorClass = (key) => errors[key] && 'error';

  const link = (
    <Link to="/signin" className="link-auth-alt">
      {i18n.__('pages.authPageJoin.haveAccountSignIn')}
    </Link>
  );

  return (
    <AuthPage link={link}>
      <div className="wrapper-auth">
        <h1 className="title-auth">
          {i18n.__('pages.authPageJoin.join')}
        </h1>
        <p className="subtitle-auth">
          {i18n.__('pages.authPageJoin.joinReason')}
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
              ref={emailRef}
              placeholder={i18n.__('pages.authPageJoin.yourEmail')}
            />
            <span
              className="icon-email"
              title={i18n.__('pages.authPageJoin.yourEmail')}
            />
          </div>
          <div className={`input-symbol ${errorClass('password')}`}>
            <input
              type="password"
              name="password"
              ref={passwordRef}
              placeholder={i18n.__('pages.authPageJoin.password')}
            />
            <span
              className="icon-lock"
              title={i18n.__('pages.authPageJoin.password')}
            />
          </div>
          <div className={`input-symbol ${errorClass('confirmPassword')}`}>
            <input
              type="password"
              name="confirmPassword"
              ref={confirmRef}
              placeholder={i18n.__('pages.authPageJoin.confirmPassword')}
            />
            <span
              className="icon-lock"
              title={i18n.__('pages.authPageJoin.confirmPassword')}
            />
          </div>
          <button type="submit" className="btn-primary">
            {i18n.__('pages.authPageJoin.joinNow')}
          </button>
        </form>
      </div>
    </AuthPage>
  );
};

export default JoinPage;
