import { ValidatedMethod } from 'meteor/mdg:validated-method';
import i18n from 'meteor/universe:i18n';

// universe:i18n only bundles the default language on the client side.
// To get a list of all avialble languages with at least one translation,
// i18n.getLanguages() must be called server side.
const getLanguages = new ValidatedMethod({
  name: 'languages.getAll',
  validate: null,
  run() {
    return i18n.getLanguages();
  },
});

export default getLanguages;
