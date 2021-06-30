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

const getRandomBook = async () => {

  let version = (Math.random() < 0.1 ? 'Unabridged Audiobook' : 'Abridged Audiobook');

  let book = {
    title: params.title[Math.floor(Math.random() * params.title.length)],
    subtitle: params.subtitle[Math.floor(Math.random() * params.title.length)],
    author: params.author[Math.floor(Math.random() * params.author.length)],
    narrator: params.narrator[Math.floor(Math.random() * params.narrator.length)],
    imageUrl: params.imageUrl[Math.floor(Math.random() * params.imageUrl.length)],
    audioSampleUrl: config.prefix + params.audioSampleUrl[Math.floor(Math.random() * params.audioSampleUrl.length)].Key,
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
    if (i % 20000 === 0) {
      console.log(`${(Date.now() - start) / 1000.00}s`);
    }
    bookArray.push(book);
  }

  return bookArray;

};

let result = seed(10000000)
  .then((result) => {
    console.log(result);
    return result;
  });