import { createServer, Model, Response, Factory } from 'miragejs';
import dataSets from './data.json';

const parseJson = (text: string) => {
  try {
    return JSON.parse(text);
  } catch (e) {
    return null;
  }
};

const createMockServer = (env = 'test') => {
  return createServer({
    environment: env,
    models: { dataSet: Model },
    factories: {
      dataSet: Factory.extend({
        values: Array.from({ length: 10 }, () =>
          Math.floor(Math.random() * 100),
        ),
      }),
    },

    seeds(server) {
      Object.entries(dataSets).forEach(([id, values]) => {
        server.create('dataSet', { id, values });
      });
    },

    routes() {
      this.namespace = '/';

      this.get('data-set/:id');

      this.post('data-set/:id', (schema, { params, requestBody }) => {
        const dataSet = schema.findBy('dataSet', { id: params.id });
        if (!dataSet) {
          return new Response(404);
        }
        const body = parseJson(requestBody);
        if (!body) {
          return new Response(400, undefined, { error: 'invalid json' });
        }
        if (!body.value) {
          return new Response(400, undefined, { error: 'missing value' });
        }
        dataSet.update('values', [...dataSet.values, body.value]);
        return new Response(200);
      });
    },
  });
};
export default createMockServer;
