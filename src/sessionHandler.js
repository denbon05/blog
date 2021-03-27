// @ts-check

import encrypt from './encrypt.js';
import User from '../entities/User.js';
import Guest from '../entities/Guest.js';

export default (app) => {
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

  app.get('/', (req, res) => {
    res.render('index');
  });

  app.get('/users/new', (req, res) => {
    res.render('session/new', { form: {}, errors: {}, action: '/users' });
  });

  app.post('/users', (req, res) => {
    const { nickname, password } = req.body;
    const errors = {};
    const theSameName = users.some((u) => u.getName() === nickname);

    if (!nickname) errors.nickname = "Username can't be blanck!";
    if (!password) errors.password = "Password can't be blanck!";
    if (theSameName) errors.existName = 'Username already exist!';
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
};
