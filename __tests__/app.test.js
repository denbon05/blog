// @ts-check

import request from 'supertest';

import runServer from '../index.js';

const app = runServer();

// it('requests', async () => {
//   const res = await request(app).get('/');
//   expect(res.status).toBe(200);

//   const res2 = await request(app).get('/posts');
//   expect(res2.status).toBe(200);

//   const res3 = await request(app).get('/posts/new');
//   expect(res3.status).toBe(200);

//   const res5 = await request(app)
//     .post('/posts');
//   expect(res5.status).toBe(422);

//   const res6 = await request(app)
//     .post('/posts')
//     .type('form')
//     .send({ title: 'post title', body: 'post body' });
//   expect(res6.status).toBe(302);

//   const res7 = await request(app).get(res6.headers.location);
//   expect(res7.status).toBe(200);
// });

describe('requests', () => {
  it('GET /', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
  });

  it('GET /posts', async () => {
    const res = await request(app).get('/posts');
    expect(res.status).toBe(200);
  });

  it('GET /posts/new', async () => {
    const res = await request(app)
      .get('/posts/new');
    expect(res.status).toBe(200);
  });

  it('POST /posts', async () => {
    const res = await request(app)
      .post('/posts')
      .type('form')
      .send({ title: 'post title', body: 'post body' });
    expect(res.status).toBe(302);
  });

  it('POST /posts (errors)', async () => {
    const res = await request(app)
      .post('/posts');
    expect(res.status).toBe(422);
  });

  it('GET posts/:id/edit', async () => {
    const res1 = await request(app)
      .post('/posts')
      .type('form')
      .send({ title: 'post title2', body: 'post body2' });
    expect(res1.status).toBe(302);
    const url = res1.headers.location;
    const res2 = await request(app)
      .get(url);
    expect(res2.status).toBe(200);
  });

  it('PATCH posts/:id', async () => {
    const res1 = await request(app)
      .post('/posts')
      .type('form')
      .send({ title: 'post title3', body: 'post body3' });
    const url = res1.headers.location.match(/\/posts\/\d+/)[0];
    const res2 = await request(app)
      .patch(url)
      .type('form')
      .send({ title: 'new post title3', body: 'new post body3' });
    expect(res2.status).toBe(302);
  });

  it('PATCH posts/:id (unproccessable entity)', async () => {
    const res1 = await request(app)
      .post('/posts')
      .type('form')
      .send({ title: 'post title4', body: 'post body4' });
    const url = res1.headers.location.match(/\/posts\/\d+/)[0];
    const res2 = await request(app)
      .patch(url);
    expect(res2.status).toBe(422);
  });

  it('DELETE posts/:id', async () => {
    const res1 = await request(app)
      .post('/posts')
      .type('form')
      .send({ title: 'post title4', body: 'post body4' });
    const url = res1.headers.location.match(/\/posts\/\d+/)[0];
    const res2 = await request(app)
      .delete(url);
    expect(res2.status).toBe(302);
  });
});
