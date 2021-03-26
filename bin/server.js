#! /usr/bin/env node
// @ts-check

import app from '../index.js';

const port = 8080;

app().listen(port, () => {
  console.log(`App was started on port: ${port}`);
});
