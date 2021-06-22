# Title and Images Service

> this is the fullstack service for the image and title displayed at the top of the page
this service also handles the top bar that slides in on scroll down containing the
title and subscription information

## Related Projects


## Table of Contents

1. [Database](#Database)
1. [API](#API)
1. [Development](#development)

## Database
  Seed the database by running 'seed-db'
  this will populate three tables

  Books
  Categories
  Book_Category
    - this table is a join table for the many to many relationship between Books and Categories

  MODELS:
  - Book.js
     contains several methods:
     * getById - takes in a single ID and returns a single book including the category through sequelize eager loading
     * getByIds - takes in an array of IDs and returns an array of book objects including category through sequelize eager loading
     * getRelatedById - takes in an id and returns an object containing
     {byAuthor: [], byNarrator: []}
     this method will not include the original input book in either list
     it will also not include books by the original book's author in the byNarrator list

## API
> The API contains three routes:
   - /api/book/{id}
       * returns a single book
   - /api/books
       * takes in json 'ids' - an array of ids
       * returns an array of book objects
   - /api/book/{id}/related
       * returns an object containing related books
       * {byAuthor: [], byNarrator:[]}



## Requirements

An `nvmrc` file is included if using [nvm](https://github.com/creationix/nvm).

- Node 6.13.0
- etc

## Development

### Installing Dependencies

From within the root directory:

```sh
npm install -g webpack
npm install
```

