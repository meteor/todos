import React from 'react';
import PropTypes from 'prop-types';
import MobileMenu from '../components/MobileMenu.jsx';
import { useMenuOpen } from '../state/MenuOpenState.jsx';

// a common layout wrapper for auth pages
const AuthPage = ({ content, link }) => {
  const [menuOpen] = useMenuOpen();

  return (
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
}
AuthPage.propTypes = {
  content: PropTypes.element.isRequired,
  link: PropTypes.element.isRequired,
};

export default AuthPage;
