require('mysql2/node_modules/iconv-lite').encodingExists('foo');

const app = require('../server/index.js');
const supertest = require('supertest');
const request = supertest(app);
const seed = require('../db/setup/seed.js');
const db = require('../db/db.js')