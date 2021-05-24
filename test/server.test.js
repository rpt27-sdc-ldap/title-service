const app = require('../server/index.js');
const supertest = require('supertest');
const request = supertest(app);

describe('ROUTES', () => {

  it(`returns an html file on GET '/'`, async done => {
    const response = await request.get('/');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe('text/html; charset=UTF-8');

    done();
  });

  it(`returns a single book on GET '/api/book/:id'`, async done => {
    const response = await request.get('/api/book/1');
    const body = JSON.parse(response.text);

    expect(response.status).toBe(200);
    expect(Array.isArray(body)).toBe(false);
    expect(body.title).not.toBe(undefined);
    done();
  });

  it(`includes categories on GET '/api/book/:id'`, async done => {
    const response = await request.get('/api/book/1');
    const body = JSON.parse(response.text);

    expect(response.status).toBe(200);
    expect(Array.isArray(body.categories)).toBe(true);
    expect(body.categories[0].name).not.toBe(undefined);
    done();
  });

  it(`returns an array of books on GET '/api/books'`, async done => {
    const response = await request.get('/api/books').send({ids: [1, 2, 3, 4]});
    const body = JSON.parse(response.text);

    expect(response.status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
    expect(body[0].title).not.toBe(undefined);
    done();
  });

  it(`includes categories on GET '/api/books'`, async done => {
    const response = await request.get('/api/books').send({ids: [1, 2, 3, 4]});
    const body = JSON.parse(response.text);

    expect(response.status).toBe(200);
    expect(Array.isArray(body[0].categories)).toBe(true);
    expect(body[0].categories[0].name).not.toBe(undefined);
    done();
  });

  it(`returns an object of arrays of books on GET '/api/book/:id/related'`, async done => {
    const response = await request.get('/api/book/1/related');
    const body = JSON.parse(response.text);

    expect(response.status).toBe(200);
    expect(Array.isArray(body)).toBe(false);
    expect(Array.isArray(body.byAuthor)).toBe(true);
    expect(Array.isArray(body.byNarrator)).toBe(true);
    done();
  });

  it(`includes categories on GET '/api/book/:id/related'`, async done => {
    const response = await request.get('/api/book/1/related');
    const body = JSON.parse(response.text);

    expect(response.status).toBe(200);
    expect(Array.isArray(body.byAuthor[0].categories)).toBe(true);
    expect(body.byAuthor[0].categories[0].name).not.toBe(undefined);
    done();
  });
});