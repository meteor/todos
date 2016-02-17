// TODO -- this should probably be some kind of test package that people use

const withDiv = function(callback) {
  const el = document.createElement('div');
  document.body.appendChild(el);
  try {
    callback(el);
  } finally {
    document.body.removeChild(el);
  }
};

export const withRenderedTemplate = function(template, data, callback) {
  withDiv((el) => {
    template = _.isString(template) ? Template[template] : template;
    Blaze.renderWithData(template, data, el);
    Tracker.flush();
    callback(el);
  });
};

// XXX: Work around issues with the tap:i18n build plugin not working correctly in unit test mode
if (Meteor.isClient) {
  Template.registerHelper('_', (str) => str);  
}
