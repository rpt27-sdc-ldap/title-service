let faker = require('faker');
// let ffmpeg = require('fluent-ffmpeg');
// let axios = require('axios');
const AWS = require('aws-sdk');
// let s3 = require('s3');
let config = require('../../config.js');

const BUCKET_NAME = 'charlotte-badger-course-content-stock-footage';

const s3 = new AWS.S3({
  accessKeyId: config.accessKeyID,
  secretAccessKey: config.secretAccessKey
});

let audio;

const getContents = async () => {

  const contents = await s3.listObjects({ Bucket: BUCKET_NAME }).promise();

  audio = contents.Contents;
};

const getRandomBook = () => {

  let version = (Math.random() < 0.1 ? 'Unabridged Audiobook' : 'Abridged Audiobook');

  let book = {
    title: faker.git.commitMessage(),
    subtitle: faker.git.commitMessage(),
    author: faker.name.findName(),
    narrator: faker.name.findName(),
    imageUrl: faker.image.imageUrl(),
    audioSampleUrl: audio[Math.floor(Math.random() * audio.length)],
    length: Math.floor(Math.random() * 1800000),
    version
  };

  return book;
};

const bookArray = [];

const seed = async (books) => {

  await getContents();

  for (let i = 0; i < books; i++) {
    let book = getRandomBook();
    if (i % 2000 === 0) {
      console.log(i);
    }
    bookArray.push(book);
  }

  console.log(bookArray);

};

seed(10000000);