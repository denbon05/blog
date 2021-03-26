// @ts-check

import Express from 'express';
import bodyParser from 'body-parser';
// import debug from 'debug';
import methodOverride from 'method-override';

import Post from './entities/Post.js';

// const logHttp = debug('http');

export default () => {
  // @ts-ignore
  const app = new Express();
  app.set('view engine', 'pug');
  // app.use(Express.static('/assets'));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(methodOverride('_method'));

  let posts = [
    new Post('hello', 'how are you?'),
    new Post('nodejs', 'story about nodejs'),
  ];

  app.get('/', (req, res) => {
    res.render('index');
  });

  app.get('/posts', (req, res) => {
    res.render('posts/index', { posts });
  });

  app.get('/posts/new', (req, res) => {
    res.render('posts/new', { form: {}, errors: {} });
  });

  app.get('/posts/:id', (req, res) => {
    const { id } = req.params;
    const post = posts.find((p) => p.id === Number(id));

    res.render('posts/show', { post });
  });

  app.post('/posts', (req, res) => {
    const { title, body } = req.body;
    const errors = {};
    if (!title) errors.title = "title can't be blank";
    if (!body) errors.body = "body can't be blank";

    if (Object.keys(errors).length > 0) {
      res.status(422);
      res.render('./posts/new', { form: {}, errors });
      return;
    }
    const post = new Post(title, body);
    posts.push(post);
    res.redirect(`/posts/${post.id}`);
  });

  app.get('/posts/:id/edit', (req, res) => {
    const post = posts.find((p) => p.id.toString() === req.params.id);
    res.render('posts/edit', { post, form: post, errors: {} });
  });

  app.patch('/posts/:id', (req, res) => {
    const { body, title } = req.body;
    const { id } = req.params;
    const post = posts.find((p) => p.id === Number(id));
    const errors = {};
    if (!title) errors.title = "title can't be blank";
    if (!body) errors.body = "body can't be blank";
    if (Object.keys(errors).length > 0) {
      res.status(422);
      res.render('posts/edit', { post, form: req.body, errors });
      return;
    }
    post.title = title;
    post.body = body;
    res.redirect(`/posts/${post.id}/edit`);
  });

  app.delete('/posts/:id', (req, res) => {
    const { id } = req.params;
    posts = posts.filter((p) => p.id !== Number(id));
    res.redirect('/posts');
  });

  return app;
};
