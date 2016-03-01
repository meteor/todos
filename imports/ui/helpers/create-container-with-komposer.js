/**
 * Helper method for easier creation of meteor data containers
 * with react-komposer. WIP. There are some currently some weird
 * subscription issues for the initial render.
 */

import { composeWithTracker } from 'react-komposer';

export function createContainer(options = {}, Component) {
  if (typeof options === 'function') {
    options = {
      getMeteorData: options
    }
  }

  const {
    getMeteorData,
    loadingComponent = null,
    errorComponent = null,
    pure = true
  } = options;

  const compose = (props, onData) => onData(null, getMeteorData(props));

  return composeWithTracker(
    compose,
    loadingComponent,
    errorComponent,
    { pure }
  )(Component);
}
