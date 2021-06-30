let faker = require('faker');
const AWS = require('aws-sdk');
let config = require('../../config.js');
let start = Date.now();

class Seed {

  constructor(records, bucket, accessKeyID, secretAccessKey) {
    this.params = {
      title: [],
      subtitle: [],
      author: [],
      narrator: [],
      imageUrl: [],
      audioSampleUrl: []
    };
    this.records = records;
    this.bucket = bucket;
    this.accessKeyID = accessKeyID;
    this.secretAccessKey = secretAccessKey;
    this.s3 = new AWS.S3({
      accessKeyId: this.accessKeyID,
      secretAccessKey: this.secretAccessKey
    });
    this.books = this.seed(this.records)
      .then((result) => {
        return result;
      });
  }

  async getContents() {

    const contents = await this.s3.listObjects({ Bucket: this.bucket }).promise();
  
    if (!this.params) {
      this.params = {};
    }
  
    this.params['audioSampleUrl'] = contents.Contents;
  }

  async generateParams(num) {

    for (let i = 0; i < num; i++) {
  
      this.params.title.push(faker.git.commitMessage());
      this.params.subtitle.push(faker.git.commitMessage());
      this.params.author.push(faker.name.findName());
      this.params.narrator.push(faker.name.findName());
      this.params.imageUrl.push(faker.image.imageUrl());
  
    }

    return;
  }

  getRandomArrayIdx(array) {
    return Math.floor(Math.random() * array.length);
  }

  getRandomBook() {

    let version = (Math.random() < 0.1 ? 'Unabridged Audiobook' : 'Abridged Audiobook');
  
    let book = {
      title: this.params.title[this.getRandomArrayIdx(this.params.title)],
      subtitle: this.params.subtitle[this.getRandomArrayIdx(this.params.subtitle)],
      author: this.params.author[this.getRandomArrayIdx(this.params.author)],
      narrator: this.params.narrator[this.getRandomArrayIdx(this.params.narrator)],
      imageUrl: this.params.imageUrl[this.getRandomArrayIdx(this.params.imageUrl)],
      audioSampleUrl: config.prefix + this.params.audioSampleUrl[this.getRandomArrayIdx(this.params.audioSampleUrl)].Key,
      length: Math.floor(Math.random() * 1800000),
      version
    };
  
    return book;
  }

  async seed() {

    await this.generateParams(1000);
    await this.getContents();
  
    const bookArray = [];
  
    for (let i = 0; i < this.records; i++) {
      let book = this.getRandomBook();
      if (i % 200000 === 0) {
        console.log(`${(Date.now() - start) / 1000.000}s elapsed --- ${i} records generated`);
      }
      bookArray.push(book);
    }
  
    return bookArray;
  
  }

}

let seed = new Seed(10000000, config.bucket, config.accessKeyID, config.secretAccessKey);

setTimeout(() => {
  console.log(seed);
}, 10000);