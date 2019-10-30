import React from 'react';
import i18n from 'meteor/universe:i18n';
import MobileMenu from '../components/MobileMenu.jsx';
import Message from '../components/Message.jsx';

const NotFoundPage = () => (
  <div className="page not-found">
    <nav>
      <MobileMenu />
    </nav>
    <div className="content-scrollable">
      <Message title={i18n.__('pages.notFoundPage.pageNotFound')} />
    </div>
  </div>
);

export default NotFoundPage;
