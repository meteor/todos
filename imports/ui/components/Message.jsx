import React from 'react';
import PropTypes from 'prop-types';

const Message = ({ title, subtitle }) => (
  <div className="wrapper-message">
    {title ? <div className="title-message">{title}</div> : null}
    {subtitle ? <div className="subtitle-message">{subtitle}</div> : null}
  </div>
);

Message.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
};

export default Message;
