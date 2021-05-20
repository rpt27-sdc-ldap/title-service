
require('mysql2/node_modules/iconv-lite').encodingExists('foo');

const app = require('../server/index.js');
const supertest = require('supertest');
const request = supertest(app);

it('gets the test endpoint', async done => {
  const response = await request.get('/test');

  expect(response.status).toBe(200);
  expect(response.text).toBe('Pass!');

  done();
})