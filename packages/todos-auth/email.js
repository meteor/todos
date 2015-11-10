Accounts.emailTemplates.siteName = "Meteor Guide Todos Example";
Accounts.emailTemplates.from = "Meteor Todos Accounts <accounts@example.com>";

Accounts.emailTemplates.resetPassword = {
  subject(user) {
    return "Reset your password on Meteor Todos";
  },
  text(user, url) {
    return `Hello!

Here is a link to reset your password on Meteor Todos: ${url}

If you didn't request this email, please ignore it.

Thanks,
The Meteor Todos team
`
  },
//   html(user, url) {
//     return `
//       XXX THIS SEEMS HELLA COMPLEX
// `
//   }
};
