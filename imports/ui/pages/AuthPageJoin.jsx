import React from 'react';
import { Link } from 'react-router';
import { Accounts } from 'meteor/accounts-base';

import AuthPage from './AuthPage.jsx';

export default class JoinPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { errors: {} };
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(event) {
    event.preventDefault();
    const email = this.email.value;
    const password = this.password.value;
    const confirm = this.confirm.value;
    const errors = {};

    if (!email) {
      errors.email = 'Email required';
    }
    if (!password) {
      errors.password = 'Password required';
    }
    if (confirm !== password) {
      errors.confirm = 'Please confirm your password';
    }

    this.setState({ errors });
    if (Object.keys(errors).length) {
      return;
    }

    Accounts.createUser({
      email,
      password,
    }, (err) => {
      if (err) {
        this.setState({
          errors: { none: err.reason },
        });
      }
      this.context.router.push('/');
    });
  }

  render() {
    const { errors } = this.state;
    const errorMessages = Object.keys(errors).map(key => errors[key]);
    const errorClass = key => errors[key] && 'error';

    const content = (
      <div className="wrapper-auth">
        <h1 className="title-auth">Join.</h1>
        <p className="subtitle-auth" >Joining allows you to make private lists</p>
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
              placeholder="Your Email"
            />
            <span className="icon-email" title="Your Email" />
          </div>
          <div className={`input-symbol ${errorClass('password')}`}>
            <input
              type="password"
              name="password"
              ref={(c) => { this.password = c; }}
              placeholder="Password"
            />
            <span className="icon-lock" title="Password" />
          </div>
          <div className={`input-symbol ${errorClass('confirm')}`}>
            <input
              type="password"
              name="confirm"
              ref={(c) => { this.confirm = c; }}
              placeholder="Confirm Password"
            />
            <span className="icon-lock" title="Confirm Password" />
          </div>
          <button type="submit" className="btn-primary">Join Now</button>
        </form>
      </div>
    );

    const link = <Link to="/signin" className="link-auth-alt">Have an account? Sign in</Link>;

    return <AuthPage content={content} link={link} />;
  }
}

JoinPage.contextTypes = {
  router: React.PropTypes.object,
};
