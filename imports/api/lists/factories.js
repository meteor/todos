import { Factory } from 'meteor/factory';
import { Lists } from './lists.js';

export const listFactory = Factory.define('list', Lists, {});
