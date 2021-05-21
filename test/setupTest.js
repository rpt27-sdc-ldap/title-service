import { configure } from 'enzyme';
import 'regenerator-runtime/runtime'

//patch to make enzyme work with react-17
import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

Enzyme.configure({ adapter: new Adapter() });

require('jest-fetch-mock').enableMocks();

const testBook = {
  "title": "A Promised Land",
  "subtitle": "",
  "author": "Barack Obama",
  "narrator": "Barack Obama",
  "imageUrl": "https://hr-rpt-audible.s3-us-west-1.amazonaws.com/001-a-promised-land.jpg",
  "audioSampleUrl": "https://hr-rpt-audible.s3-us-west-1.amazonaws.com/001-a-promised-land.mp3",
  "length": "29:10",
  "version": "Unabridged Audiobook",
  "categories": [
    { "name": "Biographies & Memoirs" },
    { "name": "Politics & Activism" }
  ]
}


require('mysql2/node_modules/iconv-lite').encodingExists('foo');