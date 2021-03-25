// @ts-check

import request from 'supertest';

import solution from '../solution.js';

const app = solution();

it('requests', async () => {
  const res = await request(app).get('/');
  expect(res.status).toBe(200);

  const res2 = await request(app).get('/posts');
  expect(res2.status).toBe(200);

  const res3 = await request(app).get('/posts/new');
  expect(res3.status).toBe(200);

  const res4 = await request(app)
    .post('/posts')
    .type('form')
    .send({ title: 'post title', body: 'post body' });
  expect(res4.status).toBe(302);

  const res5 = await request(app)
    .post('/posts');
  expect(res5.status).toBe(422);

  const res6 = await request(app)
    .post('/posts')
    .type('form')
    .send({ title: 'post title', body: 'post body' });
  const res7 = await request(app).get(res6.headers.location);
  expect(res7.status).toBe(200);
});
