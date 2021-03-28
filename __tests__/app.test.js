// @ts-check

import request from 'supertest';
import cheerio from 'cheerio';

import runServer from '../src/index.js';

describe('requests', () => {
  const app = runServer();
  let res;

  it('GET / <routes>', async () => {
    res = await request(app).get('/');
    expect(res.status).toBe(200);
    res = await request(app).get('/posts');
    expect(res.status).toBe(200);
    res = await request(app).get('/posts/new');
    expect(res.status).toBe(403);
    res = await request(app).get('/session/new');
    expect(res.status).toBe(200);
    res = await request(app).get('/users/new');
    expect(res.status).toBe(200);
  });

  it('GET / <undefined>', async () => {
    res = await request(runServer()).get('/undefined');
    expect(res.status).toBe(404);
    let $ = cheerio.load(res.text.split('\n').join(''));
    expect($('#title').text()).toBe('Oops, page not found');
    res = await request(runServer()).get('/posts/100');
    expect(res.status).toBe(404);
    $ = cheerio.load(res.text.split('\n').join(''));
    expect($('#title').text()).toBe('Oops, page not found');
  });

  it('Manipulation posts as Guest', async () => {
    res = await request(app)
      .get('/posts/1');
    expect(res.status).toBe(200);
    res = await request(app)
      .patch('/posts/1');
    expect(res.status).toBe(403);
    res = await request(app)
      .delete('/posts/1');
    expect(res.status).toBe(403);
  });
});

it('Authorized cases', async () => {
  const app = runServer();
  let res = await request(app)
    .post('/session')
    .type('form')
    .send({ nickname: 'admin', password: 'qwerty' });
  expect(res.status).toBe(302);
  res = await request(app)
    .post('/session')
    .type('form')
    .send({ nickname: 'admin', password: 'qwery' });
  expect(res.status).toBe(422);
  const authRes = await request(app)
    .post('/session')
    .type('form')
    .send({ nickname: 'admin', password: 'qwerty' });
  expect(authRes.status).toBe(302);
  const cookie = authRes.headers['set-cookie'];
  res = await request(app) // ? Destroy session
    .delete('/session')
    .set('Cookie', cookie);
  expect(res.status).toBe(302);
  res = await request(app)
    .post('/session')
    .type('form')
    .send({});
  expect(res.status).toBe(422);
});

describe('Authorization and posts manipulation', () => {
  const app = runServer();
  let res;

  beforeAll(async () => {
    res = await request(app)
      .post('/session')
      .type('form')
      .send({ nickname: 'admin', password: 'qwerty' });
    expect(res.status).toBe(302);
  });

  it('Manipulation posts as User', async () => {
    res = await request(app)
      .post('/posts')
      .type('form')
      .send({ title: 'post title2', body: 'post body2' });
    expect(res.status).toBe(302); // ? Created
    const url = res.headers.location.match(/\/posts\/\d+/)[0];
    res = await request(app)
      .get(url);
    expect(res.status).toBe(200); // ? Check if exist on right route
    // res = await request(app)
    //   .patch(url);
    // expect(res.status).toBe(422); // ! Unproccessable entity
  });
});
