// @ts-check

import request from 'supertest';
import cheerio from 'cheerio';

import runServer from '../index.js';

describe('requests', () => {
  it('GET /', async () => {
    let res = await request(runServer()).get('/');
    expect(res.status).toBe(200);
    res = await request(runServer()).get('/posts');
    expect(res.status).toBe(200);
    res = await request(runServer())
      .get('/posts/new');
    expect(res.status).toBe(200);
  });

  it('GET /undefined', async () => {
    const res = await request(runServer()).get('/undefined');
    expect(res.status).toBe(404);
    const $ = cheerio.load(res.text.split('\n').join(''));
    expect($('#title').text()).toBe('Oops, page not found');
  });

  it('GET posts/:id 404', async () => {
    const res = await request(runServer()).get('/posts/100');
    expect(res.status).toBe(404);
    const $ = cheerio.load(res.text.split('\n').join(''));
    expect($('#title').text()).toBe('Oops, page not found');
  });

  it('POST /posts', async () => {
    let res2 = await request(runServer())
      .post('/posts')
      .type('form')
      .send({ title: 'post title', body: 'post body' });
    expect(res2.status).toBe(302);
    res2 = await request(runServer())
      .post('/posts');
    expect(res2.status).toBe(422);
  });

  it('GET posts/:id/edit', async () => {
    const app = runServer();
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
    const app = runServer();
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
    const app = runServer();
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
    const app = runServer();
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
