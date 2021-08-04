#!/bin/bash

k6 run test/k6/k6-10.js && k6 run test/k6/k6-100.js && k6 run test/k6/k6-1000.js