let faker = require('faker');
let path = require('path');
const AWS = require('aws-sdk');
let config = require('../../config.js');
let start = Date.now();
const fs = require('fs');
const axios = require('axios');
const s3 = new AWS.S3({
  accessKeyId: config.accessKeyID,
  secretAccessKey: config.secretAccessKey
});
const moment = require('moment');
const IMAGE_DIR = path.join(__dirname, 'images');

let params = {
  title: [],
  subtitle: [],
  author: [],
  narrator: [],
  imageUrl: [],
  categories: [
    'Literature & Fiction',
    'Classic',
    'Biographies & Memoirs',
    'Professionals & Academic',
    'Genre Fiction',
    'Politics & Social Sciences',
    'Anthropology',
    'Money & Finance',
    'Economic',
    'Business & Careers',
    'Career Success',
    'Computers & Technology',
    'Marketing & Sales',
    'Romance',
    'Historical',
    'Science Fiction & Fantasy',
    'Fantasy',
    'Action & Adventure',
    'Mystery',
    'Thriller & Suspense',
    'Relationships & Personal Development',
    'Personal Development',
    'Entertainment & Celebrities'
  ]
};

const downloadAndSaveOneImage = async () => {
  let fileName = faker.system.fileName().split('.')[0] + '.jpeg';
  let url = 'http://placeimg.com/640/480';

  const filePath = path.resolve(__dirname, 'images', fileName);
  const writer = fs.createWriteStream(filePath);

  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', () => {
      fs.unlink(path.join(__dirname, 'images', filename), () => {
        console.log(filename, 'unlinked');
        reject();
      });
    });
  });
};

const getImages = async (num = 1000) => {

  const exists = fs.existsSync(IMAGE_DIR);
  if (exists) {
    fs.rmdirSync(IMAGE_DIR, {recursive: true});
  }
  fs.mkdirSync(IMAGE_DIR);

  let status = {
    success: 0,
    error: 0,
    total: num
  };

  let array = [];

  for (let i = 0; i < num; i++) {
    array.push('http://placeimg.com/640/480');
  }

  console.log(`Downloading ${num} images`);

  for (let url of array) {
    await downloadAndSaveOneImage(url)
      .then(() => {
        status.success++;
        console.log(`Success ${status.success}/${status.total}  Errors ${status.error}`);
        console.log(`${moment(start).fromNow(true)} elapsed (${Date.now() - start}ms)`);
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
        status.error++;
        console.log('Error Downloading Video');
      });
  }

  return;
};

const emptyBucket = async () => {
  console.log(`Emptying and repopulating bucket ${config.imageBucket}`);

  const { Contents } = await s3.listObjects({ Bucket: config.imageBucket }).promise();
  if (Contents.length > 0) {
    await s3.deleteObjects({
      Bucket: config.imageBucket,
      Delete: {
        Objects: Contents.map(({ Key }) => ({ Key }))
      }
    })
      .promise();
  }

  return;
};

const uploadFiles = async () => {
  await emptyBucket();

  let files = fs.readdirSync(path.join(__dirname, 'images'));
  let promises = [];

  for (let file of files) {
    let fileContent = fs.readFileSync(path.join(IMAGE_DIR, file));
    let fileName = file.split('/');
    fileName = fileName[fileName.length - 1];

    const params = {
      Bucket: config.imageBucket,
      Key: fileName,
      Body: fileContent,
      ContentType: 'image/jpeg'
    };

    let promise = s3.upload(params, (err, data) => {
      if (err) {
        console.log(err);
      }
    }).promise();

    promises.push(promise);
  }

  Promise.all(promises)
    .then((values) => {
      for (let i = 0; i < values.length; i++) {
        params.imageUrl.push(values[i].Location);
      }
    })
    .catch((err) => {
      if (err) {
        console.log(err);
      }
    });

};

const searchAndDownload = async () => {
  await getImages(1000);
  await uploadFiles();
  return;
};

const getContents = async () => {

  const contents = await s3.listObjects({ Bucket: config.audioBucket }).promise();

  if (!params) {
    params = {};
  }

  params['audioSampleUrl'] = contents.Contents;
};


const generateParams = async (num) => {
  console.log(`Generating ${num} sets of parameters. This could take a while.`);

  for (let i = 0; i < num; i++) {

    if (i % 100000 === 0) {
      console.log(`${moment(start).fromNow(true)} elapsed (${Date.now() - start}ms) --- ${i} sets of parameters generated`);
    }

    params.title.push(faker.git.commitMessage());
    params.subtitle.push(faker.git.commitMessage());
    params.author.push(faker.name.findName());
    params.narrator.push(faker.name.findName());
    params.imageUrl.push(faker.image.imageUrl());

  }

  return 'complete';
};

const getRandomArrayIdx = (array, exclude) => {
  let idx = Math.floor(Math.random() * array.length);
  if (idx === exclude) {
    return getRandomIdx(array, exclude);
  } else {
    return Math.floor(Math.random() * array.length);
  }
};

const getRandomBook = () => {

  let version = (Math.random() < 0.1 ? 'Unabridged Audiobook' : 'Abridged Audiobook');
  let categoryIdx1 = getRandomArrayIdx(params.categories);
  let categoryIdx2 = getRandomArrayIdx(params.categories, categoryIdx1);

  let book = {
    title: params.title[getRandomArrayIdx(params.title)],
    subtitle: params.subtitle[getRandomArrayIdx(params.subtitle)],
    author: params.author[getRandomArrayIdx(params.author)],
    narrator: params.narrator[getRandomArrayIdx(params.narrator)],
    imageUrl: params.imageUrl[getRandomArrayIdx(params.imageUrl)],
    audioSampleUrl: config.audioPrefix + params.audioSampleUrl[getRandomArrayIdx(params.audioSampleUrl)].Key,
    length: Math.floor(Math.random() * 1800000),
    version,
    categories: [
      { name: params.categories[categoryIdx1] },
      { name: params.categories[categoryIdx2] }
    ]
  };

  return book;
};

const seed = async (books = 10000000) => {
  console.log(`Beginning seed of ${books} records`);
  await searchAndDownload();
  await generateParams(1000000);
  await getContents();

  const bookArray = [];

  for (let i = 0; i < books; i++) {
    let book = getRandomBook();
    if (i % 200000 === 0) {
      console.log(`${moment(start).fromNow(true)} elapsed (${Date.now() - start}ms) --- ${i} records generated`);
    }
    bookArray.push(book);
  }

  return bookArray;
};

module.exports.seed = seed;