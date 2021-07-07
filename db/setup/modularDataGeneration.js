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

const getImages = async (num) => {

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

  await Promise.all(promises)
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

const searchAndDownload = async (numImages) => {
  await getImages(numImages);
  await uploadFiles();
  return;
};

const getContents = async () => {

  const contents = await s3.listObjects({ Bucket: config.audioBucket }).promise();

  if (!params) {
    params = {};
  }

  params['audioSampleUrl'] = contents.Contents;

  const images = await s3.listObjects({ Bucket: config.imageBucket }).promise();

  if (!params) {
    params = {};
  }

  params['imageUrl'] = images.Contents;

};

getContents();


const generateParams = async (num) => {
  console.log(`Generating ${num} sets of parameters. This could take a while.`);

  for (let i = 0; i < num; i++) {

    if (i % Math.floor((num / 1000)) === 0) {
      console.log(`${moment(start).fromNow(true)} elapsed (${Date.now() - start}ms) --- ${i} sets of parameters generated`);
    }

    params.title.push(faker.git.commitMessage());
    params.subtitle.push(faker.git.commitMessage());
    params.author.push(faker.name.findName());
    params.narrator.push(faker.name.findName());
    // params.imageUrl.push(faker.image.imageUrl());

  }

  return 'complete';
};

const getRandomArrayIdx = (array, exclude) => {
  let idx = Math.floor(Math.random() * array.length);
  if (idx === exclude) {
    return getRandomArrayIdx(array, exclude);
  } else {
    return idx;
  }
};

const getRandomBook = (id) => {

  let version = (Math.random() < 0.1 ? 'Unabridged Audiobook' : 'Abridged Audiobook');
  let categoryIdx1 = getRandomArrayIdx(params.categories);
  let categoryIdx2 = getRandomArrayIdx(params.categories, categoryIdx1);

  let book = {};
  if (id) {
    book['id'] = id;
  }
  book['title'] = params.title[getRandomArrayIdx(params.title)];
  book['subtitle'] = params.subtitle[getRandomArrayIdx(params.subtitle)];
  book['author'] = params.author[getRandomArrayIdx(params.author)];
  book['narrator'] = params.narrator[getRandomArrayIdx(params.narrator)];
  book['image_url'] = config.imagePrefix + params.imageUrl[getRandomArrayIdx(params.imageUrl)].Key;
  book['audio_sample_url'] = config.audioPrefix + params.audioSampleUrl[getRandomArrayIdx(params.audioSampleUrl)].Key;
  book['length'] = Math.floor(Math.random() * 1800000);
  book['version'] = version;
  book['categories'] = [
    params.categories[categoryIdx1],
    params.categories[categoryIdx2]
  ];

  return book;
};

const seed = async (numBooks = 10000000, numParams = 10000, numImages = 1000) => {
  console.log(`Beginning seed of ${numBooks} records`);
  await searchAndDownload(numImages);
  await generateParams(numParams);
  await getContents();

  const bookPath = path.join(__dirname, 'data.csv');
  const exists = fs.existsSync(bookPath);
  if (exists) {
    fs.unlinkSync(bookPath);
  }

  fs.appendFileSync(bookPath, Object.keys(getRandomBook(1)).join(',') + '\n');

  let bookArray = [];
  let postWrite = 0;
  let iterable = ['hello'];

  const timeout = async (ms) => {
    console.log(`Waiting ${ms}ms`);
    return new Promise(resolve => setTimeout(resolve, ms));
  };
  count = 0;

  while (count <= numBooks) {
    count++;
    let book = getRandomBook(count);
    if (count % 10000 === 0) {
      console.log(`${moment(start).fromNow(true)} elapsed (${Date.now() - start}ms) --- ${count} records generated`);
    }

    bookArray.push(book);

    if (bookArray.length === 1000000 || bookArray.length === numBooks) {
      const used = process.memoryUsage().heapUsed / 1024 / 1024;
      console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
      bookArray = bookArray.map((string) => {
        string.categories = string.categories.join(',');
        string.categories = JSON.stringify(string.categories);
        string = Object.values(string);
        return string.join(',');
      });
      bookArray = bookArray.join('\n');
      fs.appendFileSync(bookPath, bookArray);
      bookArray = null;
      bookArray = [];
    }

  }

  return bookPath;
};

module.exports.seed = seed;