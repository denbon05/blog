// @ts-check

import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
// import debug from 'debug';
import methodOverride from 'method-override';

import encrypt from './encrypt.js';
import User from '../entities/User.js';
import Guest from '../entities/Guest.js';
import postsHandler from './postsHandler.js';

// const logHttp = debug('http');

export default () => {
  const app = express();
  app.set('view engine', 'pug');
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(methodOverride('_method'));
  app.use('/assets', express.static('../node_modules'));
  app.use(session({
    secret: 'secret key',
    resave: false,
    saveUninitialized: false,
  }));

  const users = [new User('admin', encrypt('qwerty'))];

  app.use((req, res, next) => {
    // @ts-ignore
    if (req.session?.nickname) {
      // @ts-ignore
      const { nickname } = req.session;
      res.locals.currentUser = users.find((user) => user.nickname === nickname);
    } else {
      res.locals.currentUser = new Guest();
    }
    next();
  });

  // @ts-ignore
  app.get('/', (req, res) => {
    res.render('index');
  });

  // @ts-ignore
  app.get('/users/new', (req, res) => {
    res.render('session/new', { form: {}, errors: {}, action: '/users' });
  });

  app.post('/users', (req, res) => {
    const { nickname, password } = req.body;
    const errors = {};
    const theSameName = users.some((u) => u.getName() === nickname);

    if (!nickname) errors.nickname = "Username can't be blanck!";
    if (!password) errors.password = "Password can't be blanck!";
    if (theSameName) errors.existName = 'Username have to be unique!';
    if (Object.keys(errors).length === 0) {
      // @ts-ignore
      req.session.nickname = nickname;
      users.push(new User(nickname, encrypt(password)));
      res.redirect('/');
      return;
    }
    res.status(422);
    res.render('session/new', { form: {}, errors });
  });

  // @ts-ignore
  app.get('/session/new', (req, res) => {
    res.render('session/new', { form: {}, errors: {}, action: '/session' });
  });

  app.post('/session', (req, res) => {
    const { nickname, password } = req.body;
    const user = users.find((u) => u.getName() === nickname);
    if (!user || (user.getPassword() !== encrypt(password))) {
      res.status(422);
      res.render('session/new', { form: {}, errors: { err: 'Invalid nickname or password' }, action: '/session' });
      return;
    }
    // @ts-ignore
    req.session.nickname = nickname;
    res.redirect('/');
  });

  app.delete('/session', (req, res) => {
    req.session.destroy(() => {
      res.redirect('/');
    });
  });

  postsHandler(app);

  app.use((err, _req, res, next) => {
    res.status(err.status);
    switch (err.status) {
      case 404:
        res.render(err.status.toString());
        break;
      default:
        next(new Error('Unexpected error'));
    }
  });

  return app;
};
