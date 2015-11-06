Template.registerHelper('instance', () => {
  return Template.instance();
});

Template.registerHelper('log', (data) => {
  console.log(data);
});
