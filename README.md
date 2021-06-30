# Audibles Title Service

![demo gif](https://github.com/huang-pei-mei/title-service/blob/master/gifs/TitleBarGif.gif)

## Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Database](#database)
4. [API](#api)
5. [Testing](#testing)

## Overview

### Background
This is the title service for audibles.com. This services displays the title, book information, image, audio sample, and dynamic background image.
This service is apart of a larger group project with an emphasis on service oriented architecture.
you can learn more about the project [here](https://github.com/huang-pei-mei/CM-proxy)

### Technologies
- React
- Node with Express
- MySQL
- AWS S3
- AWS EC2
- Lighthouse
- Jest
- Enzyme
- Puppeteer

### Highlights
- dynamic background Image
  * image stretched, blurred, and darkened using only css
- audio sample
  * lazy loads on user click
  * dynamic countdown timer
- Lighthouse page load speed of 100

## Installation

An `nvmrc` file is included if using [nvm](https://github.com/creationix/nvm).

- Node 12.22.1

1. From within the root directory:

`npm install`

2. create a .env file containing the following:
```
DB_USER={mysqlUserName}
DB_PASSWORD={mysqlPassword}
DB_HOST={mysqlHost}
```

3. create a new mysql database named:
`audible`

4. seed the database with:
`npm run seed-db`

5. build the client bundle with:
`npm run react-dev`

6. start the server with:
`npm run server-dev`

## Database
  Seed the database by running
   `npm run seed-db`
  this will populate three tables

  - Books
  - Categories
  - Book_Category
     * this table is a join table for the many to many relationship between Books and Categories

  MODELS:
   Book.js contains several methods:
     - getById - takes in a single ID and returns a single book including the category through sequelize eager loading
     - getByIds - takes in an array of IDs and returns an array of book objects including category through sequelize eager loading
     - getRelatedById - takes in an id and returns an object containing
     `{byAuthor: [], byNarrator: []}`
     this method will not include the original input book in either list
     it will also not include books by the original book's author in the byNarrator list

## API
  GET:
   - /api/book/{id}
       * returns a single book
   - /api/books
       * takes in json 'ids' - an array of ids **OR** a query param 'ids' equal to a comma separated list of ids
       * returns an array of book objects
   - /api/book/{id}/related
       * returns an object containing related books
       * {byAuthor: [], byNarrator:[]}

  POST:
   - /api/book
        * takes a 'book' parameter with the following properties
      ```javascript
      book: {
        title: 'string', // Required
        subtitle: 'string',
        author: 'string', // Required
        narrator: 'string', // Required
        imageUrl: 'string',
        audioSampleUrl: 'string',
        length: 'string',
        version: 'string',
        createdAt: 'datetime',
        updatedAt: 'datetime
      };
      ```

  PUT:
   - /api/book/:id
      * takes id as last url parameter
      * takes a 'book' parameter (above) with the properties to be updated.
      * updates all given parameters
  
  DELETE:
   - /api/book/:id
      * takes id as last url parameter
      * delete's specified book from the database

## TESTING

**WARNING** currently running `npm run test` will repopulate the database.
see `/test/setupDb.js` to disable re-seed for tests