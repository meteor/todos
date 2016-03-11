import { Factory } from 'meteor/factory';
import faker from 'faker';
import { Todos } from './todos.js';

import { listFactory } from '../lists/factories.js';

// XXX: should just be new Factory
export const todoFactory = Factory.define('todo', Todos, {
  listId: () => listFactory,
  text: () => faker.lorem.sentence(),
  createdAt: () => new Date(),
});
