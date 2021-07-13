require('dotenv').config();
const nano = require('nano')(process.env.COUCH_LOGIN_URL);
const seed = require('./modularDataGeneration.js').seed;
const fs = require('fs');
let scriptDone = false;
let start = Date.now();
const axios = require('axios');
let counter = 0;

setInterval(() => {
  if (!scriptDone) {
    console.log(`Memory usage at ${(Date.now() - start) / 1000} seconds - ${Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100} MB`, counter);
  } else {
    console.log('Script complete - Press ctrl + c to end');
  }
}, 1000);

const refactorToJSON = (data, keys) => {

  let obj = {};

  for (let i = 0; i < data.length; i++) {
    obj[keys[i]] = data[i];
  }

  obj['categories'] = [];
  obj.categories.push(obj.category1);
  obj.categories.push(obj.category2);
  delete obj.category1;
  delete obj.category2;

  return obj;
};


const seedCouch = async (records) => {
  let dbs = await nano.db.list();
  if (dbs.includes('audible')) {
    await nano.db.destroy('audible');
  }
  await nano.db.create('audible');
  const audible = nano.use('audible');
  
  const file = await seed(records, 10, 10);
  const stream = fs.createReadStream(file, { bufferSize: 256 * 1024});
  let leftover;
  let keys;
  let lineLength;
  // let docs = [];
  
  const insert = async (data) => {
    let insertStart = Date.now();
    
    await axios({
      url: 'http://127.0.0.1:5984/audible/_bulk_docs',
      method: 'post',
      data: {docs: data},
      headers: {
        'Content-Type': 'application/json'
      },
      auth: {
        username: 'student',
        password: 'student'
      }
    })
      .then((response) => {
        console.log(`Inserted in ${Date.now() - insertStart}ms`);
        
      })
      .catch((err) => {
        console.log('err', err);
        // insert(data);
      });
  };

  stream.on('data', async (chunk) => {
    // counter++;
    chunk = chunk.toString();
    let lines = chunk.split('\n');
    let docs = [];


    for (let i = 0; i < lines.length; i++) {
      let columns;

      if (leftover) { 
        let joined = leftover.concat(lines[i]);
        columns = joined.split(',');
        leftover = undefined;
      } else {
        columns = lines[i].split(',');
      }


      if (!keys) {
        keys = columns;
        lineLength = columns.length;
      } else if (lineLength === columns.length) {     
        let json = refactorToJSON(columns, keys);
        docs.push(json);
        counter++;
      } else {
        leftover = lines[i];
      }
    }

    insert(docs);
  });

  stream.on('end', async () => {
    await stream.close();
  });

};

seedCouch(10000000);