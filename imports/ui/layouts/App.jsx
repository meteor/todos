import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import { GlobalStateProvider } from '../state/GlobalStateProvider.jsx';
import AppContent from './AppContent.jsx';

const CONNECTION_ISSUE_TIMEOUT = 5000;

const App = ({
  // current meteor user
  user,
  // server connection status
  connected,
  // subscription status
  loading,
  // all lists visible to the current user
  lists,
}) => {
  const [showConnectionIssue, setShowConnectionIssue] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowConnectionIssue(true);
    }, CONNECTION_ISSUE_TIMEOUT);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <GlobalStateProvider>
      <BrowserRouter>
        <AppContent
          connectionNotification={showConnectionIssue && !connected}
          lists={lists}
          loading={loading}
          user={user}
        />
      </BrowserRouter>
    </GlobalStateProvider>
  );
};

App.propTypes = {
  user: PropTypes.object,
  connected: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  lists: PropTypes.array,
};

App.defaultProps = {
  user: null,
  lists: [],
};

export default App;
