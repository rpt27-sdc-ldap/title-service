let faker = require('faker');
const AWS = require('aws-sdk');
let config = require('../../config.js');
let start = Date.now();

const s3 = new AWS.S3({
  accessKeyId: config.accessKeyID,
  secretAccessKey: config.secretAccessKey
});

let params = {
  title: [],
  subtitle: [],
  author: [],
  narrator: [],
  imageUrl: []
};

const getContents = async () => {

  const contents = await s3.listObjects({ Bucket: config.bucket }).promise();

  if (!params) {
    params = {};
  }

  params['audioSampleUrl'] = contents.Contents;
};


const generateParams = async (num) => {

  for (let i = 0; i < num; i++) {

    params.title.push(faker.git.commitMessage());
    params.subtitle.push(faker.git.commitMessage());
    params.author.push(faker.name.findName());
    params.narrator.push(faker.name.findName());
    params.imageUrl.push(faker.image.imageUrl());

  }

  return 'complete';
};

const getRandomArrayIdx = (array) => {
  return Math.floor(Math.random() * array.length);
};

const getRandomBook = async () => {

  let version = (Math.random() < 0.1 ? 'Unabridged Audiobook' : 'Abridged Audiobook');

  let book = {
    title: params.title[getRandomArrayIdx(params.title)],
    subtitle: params.subtitle[getRandomArrayIdx(params.subtitle)],
    author: params.author[getRandomArrayIdx(params.author)],
    narrator: params.narrator[getRandomArrayIdx(params.narrator)],
    imageUrl: params.imageUrl[getRandomArrayIdx(params.imageUrl)],
    audioSampleUrl: config.prefix + params.audioSampleUrl[getRandomArrayIdx(params.audioSampleUrl)].Key,
    length: Math.floor(Math.random() * 1800000),
    version
  };

  return book;
};


const seed = async (books) => {

  await generateParams(1000);
  await getContents();

  const bookArray = [];

  for (let i = 0; i < books; i++) {
    let book = getRandomBook();
    if (i % 200000 === 0) {
      console.log(`${(Date.now() - start) / 1000.000}s elapsed --- ${i} records generated`);
    }
    bookArray.push(book);
  }

  return bookArray;

};

seed(10000000)
  .then((result) => {
    console.log(result.length);
    return result;
  });