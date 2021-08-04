import http from 'k6/http';

export const options = {
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 100,
      timeUnit: '1s',
      duration: '2m',
      preAllocatedVUs: 100,
      maxVUs: 500
    }
  }
};

const getRandomNumber = (num) => {
  return Math.ceil((Math.random() * Math.random() * Math.random() * Math.random() * Math.random()) * num);
};

export default function main() {
  http.get(`http://127.0.0.1:2002/api/book/${getRandomNumber(10000000)}`);
}