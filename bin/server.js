#! /usr/bin/env node
// @ts-check

import app from '../src/index.js';

const port = process.env.PORT || 8080;
const address = '0.0.0.0';

// @ts-ignore
app().listen(port, address, () => {
  console.log(`App was started on port: ${port}`);
});
