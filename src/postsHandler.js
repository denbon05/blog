// @ts-check

import Post from '../entities/Post.js';
import NotFoundError from '../errors/NotFoundError.js';
import AccessDeniedError from '../errors/AccessDeniedError.js';

export default (app) => {
  let posts = [
    new Post('hello', 'how are you?'),
    new Post('nodejs', 'story about nodejs'),
  ];

  const requiredAuth = (req, res, next) => {
    console.log('currentUser=>', res.locals.currentUser);
    if (res.locals.currentUser.isGuest()) {
      return next(new AccessDeniedError());
    }
    return next();
  };

  app.get('/posts', (req, res) => {
    res.render('posts/index', { posts });
  });

  app.get('/posts/new', requiredAuth, (req, res) => {
    res.render('posts/new', { form: {}, errors: {} });
  });

  app.get('/posts/:id', (req, res, next) => {
    const { id } = req.params;
    const post = posts.find((p) => p.id === Number(id));
    if (!post) next(new NotFoundError());
    else res.render('posts/show', { post });
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

  app.get('/posts/:id/edit', requiredAuth, (req, res) => {
    const post = posts.find((p) => p.id.toString() === req.params.id);
    res.render('posts/edit', { post, form: post, errors: {} });
  });

  app.patch('/posts/:id', requiredAuth, (req, res) => {
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

  app.delete('/posts/:id', requiredAuth, (req, res) => {
    const { id } = req.params;
    posts = posts.filter((p) => p.id !== Number(id));
    res.redirect('/posts');
  });
};
