import { Accounts } from 'meteor/accounts-base';


Accounts.emailTemplates.siteName = 'Meteor Guide Todos Example';
Accounts.emailTemplates.from = 'Meteor Todos Accounts <accounts@example.com>';

Accounts.emailTemplates.resetPassword = {
  subject() {
    return 'Reset your password on Meteor Todos';
  },
  text(user, url) {
    return `Hello!

Click the link below to reset your password on Meteor Todos.

${url}

If you didn't request this email, please ignore it.

Thanks,
The Meteor Todos team
`;
  },
//   html(user, url) {
//     return `
//       XXX Generating HTML emails that work across different email clients is a very complicated
//       business that we're not going to solve in this particular example app.
//
//       A good starting point for making an HTML email could be this responsive email boilerplate:
//       https://github.com/leemunroe/responsive-html-email-template
//
//       Note that not all email clients support CSS, so you might need to use a tool to inline
//       all of your CSS into style attributes on the individual elements.
// `
//   }
};
