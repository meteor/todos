import React from 'react';
import PropTypes from 'prop-types';
import MobileMenu from '../components/MobileMenu.jsx';

// a common layout wrapper for auth pages
const AuthPage = ({ content, link, menuOpen }) => (
  <div className="page auth">
    <nav>
      <MobileMenu menuOpen={menuOpen} />
    </nav>
    <div className="content-scrollable">
      {content}
      {link}
    </div>
  </div>
);

AuthPage.propTypes = {
  content: PropTypes.element.isRequired,
  link: PropTypes.element.isRequired,
  menuOpen: PropTypes.object.isRequired,
};

export default AuthPage;
