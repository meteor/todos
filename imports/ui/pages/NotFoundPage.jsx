import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import BaseComponent from '../components/BaseComponent.jsx';
import MobileMenu from '../components/MobileMenu.jsx';
import Message from '../components/Message.jsx';

class NotFoundPage extends BaseComponent {
  render() {
    return (
      <div className="page not-found">
        <nav>
          <MobileMenu menuOpen={this.props.menuOpen} />
        </nav>
        <div className="content-scrollable">
          <Message title={i18n.__('pages.notFoundPage.pageNotFound')} />
        </div>
      </div>
    );
  }
}

NotFoundPage.propTypes = {
  menuOpen: PropTypes.object.isRequired,
};

export default NotFoundPage;
