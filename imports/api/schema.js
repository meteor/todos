import { ListSchema } from './lists/lists';
import { TodoSchema } from './todos/todos';

const schema = `
  schema {
    query: RootQuery
  }
`;

const RootQuery = `
  type RootQuery {
    lists(mine: Boolean): [List]
  }
`;

export default [schema, RootQuery, ListSchema, TodoSchema];
