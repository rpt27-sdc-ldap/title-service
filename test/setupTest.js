import { configure } from 'enzyme';
import 'regenerator-runtime/runtime'

//patch to make enzyme work with react-17
import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

const seed = require('../db/setup/seed.js');
const db = require('../db/db.js');

Enzyme.configure({ adapter: new Adapter() });

require('jest-fetch-mock').enableMocks();

require('mysql2/node_modules/iconv-lite').encodingExists('foo');