import http from 'k6/http';

export const options = {
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 1000,
      timeUnit: '1s',
      duration: '1m',
      preAllocatedVUs: 100,
      maxVUs: 500
    }
  }
};

const getRandomNumber = (num) => {
  return Math.ceil((Math.random() * Math.random() * Math.random() * Math.random() * Math.random()) * num);
};

export default function main() {
  http.get(`http://ec2-18-170-172-153.eu-west-2.compute.amazonaws.com:2002/api/book/${getRandomNumber(10000000)}`);
}