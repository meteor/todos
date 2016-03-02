/**
 * Helper method for easier creation of meteor data containers
 * with react-komposer. WIP. There are some currently some weird
 * subscription issues for the initial render.
 */

import { composeWithTracker } from 'react-komposer';

export function createContainer(options = {}, Component) {
  let expandedOptions = options;
  if (typeof options === 'function') {
    expandedOptions = {
      getMeteorData: options,
    };
  }

  const {
    getMeteorData,
    loadingComponent = null,
    errorComponent = null,
    pure = true,
  } = expandedOptions;

  const compose = (props, onData) => onData(null, getMeteorData(props));

  return composeWithTracker(
    compose,
    loadingComponent,
    errorComponent,
    { pure }
  )(Component);
}
