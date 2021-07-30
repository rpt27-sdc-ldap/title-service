import { sleep } from 'k6';
import http from 'k6/http';
// import { get } from './server';

export const options = {
  ext: {
    loadimpact: {
      distribution: {
        'amazon:us:ashburn': { loadZone: 'amazon:us:ashburn', percent: 100 },
      },
    },
  },
  stages: [
    { target: 20, duration: '1m' },
    { target: 20, duration: '3m30s' },
    { target: 0, duration: '1m' },
  ],
  thresholds: {},
};

const getRandomNumber = (num) => {
  return Math.floor((Math.random() * Math.random() * Math.random() * Math.random() * Math.random()) * num);
};

export default function main() {
  let response;

  // Get General Requests
  response = http.get(`http://127.0.0.1:2002/api/book/${getRandomNumber(10000000)}`);

  // Automatically added sleep
  // sleep(0.00001);
}