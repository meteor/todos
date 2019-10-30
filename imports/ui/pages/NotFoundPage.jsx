import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import BaseComponent from '../components/BaseComponent.jsx';
import MobileMenu from '../components/MobileMenu.jsx';
import Message from '../components/Message.jsx';
import { useMenuOpen } from '../state/MenuOpenState.jsx';

const NotFoundPage = () => {
  const [menuOpen, setMenuOpen] = useMenuOpen();
  const transitionMenuOpen = {
    get: () => menuOpen,
    set: (newMenuOpen) => setMenuOpen(newMenuOpen),
  };
  return (
    <div className="page not-found">
      <nav>
        <MobileMenu menuOpen={transitionMenuOpen} />
      </nav>
      <div className="content-scrollable">
        <Message title={i18n.__('pages.notFoundPage.pageNotFound')} />
      </div>
    </div>
  );
};

export default NotFoundPage;
