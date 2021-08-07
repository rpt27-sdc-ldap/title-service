import http from 'k6/http';

export const options = {
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 55,
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
  http.get('http://ec2-18-168-91-241.eu-west-2.compute.amazonaws.com:5500/');
}