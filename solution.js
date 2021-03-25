// @ts-check

import Express from 'express';
import bodyParser from 'body-parser';

import Post from './entities/Post.js';

export default () => {
  // @ts-ignore
  const app = new Express();
  app.set('view engine', 'pug');
  app.use(Express.static('/assets'));
  app.use(bodyParser.urlencoded({ extended: false }));

  // console.log("Express.static('/assets')=>", Express.static('/assets').toString());

  const posts = [
    new Post('hello', 'how are you?'),
    new Post('nodejs', 'story about nodejs'),
  ];

  app.get('/', (req, res) => {
    res.render('index');
  });

  app.get('/posts', (req, res) => {
    res.render('./posts/index', { posts });
  });

  app.get('/posts/new', (req, res) => {
    res.render('./posts/new', { form: {}, errors: {} });
  });

  app.get('/posts/:id', (req, res) => {
    const { id } = req.params;
    const post = posts.find((p) => p.id === Number(id));
    res.render('./posts/show', post);
  });

  app.post('/posts', (req, res) => {
    const { title, body } = req.body;
    const errors = {};
    if (!title) errors.title = "title can't be blank";
    if (!body) errors.body = "body can't be blank";

    if (Object.values(errors).length > 0) {
      res.status(422);
      res.render('./posts/new', { form: {}, errors });
      return;
    }
    const post = new Post(title, body);
    posts.push(post);
    res.redirect(`/posts/${post.id}`);
  });

  return app;
};
