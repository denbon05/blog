// @ts-check

import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
// import debug from 'debug';
import methodOverride from 'method-override';
import flash from './flash.js';
import postsHandler from './postsHandler.js';
import sessionHandler from './sessionHandler.js';

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
  app.use(flash());

  sessionHandler(app);
  postsHandler(app);

  app.use((err, _req, res, next) => {
    res.status(err.status);
    switch (err.status) {
      case 404:
        res.render(err.status.toString());
        break;
      case 403:
        res.render(err.status.toString());
        break;
      default:
        next(new Error(err));
    }
  });

  return app;
};
