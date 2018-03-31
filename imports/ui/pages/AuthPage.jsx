import React from 'react';
import PropTypes from 'prop-types';
import MobileMenu from '../components/MobileMenu.jsx';

// a common layout wrapper for auth pages
const AuthPage = ({ content, link }) => (
  <div className="page auth">
    <nav>
      <MobileMenu />
    </nav>
    <div className="content-scrollable">
      {content}
      {link}
    </div>
  </div>
);

AuthPage.propTypes = {
  content: PropTypes.element,
  link: PropTypes.element,
};

export default AuthPage;
