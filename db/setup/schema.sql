-- DROP DATABASE audible;

-- CREATE DATABASE audible;

DROP TABLE IF EXISTS authors CASCADE;
DROP TABLE IF EXISTS narrators CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS books_categories CASCADE;

CREATE TABLE authors (

  author_id int,
  first varchar(255),
  last varchar(255),
  PRIMARY KEY (author_id)

);

CREATE TABLE narrators (

  narrator_id int,
  first varchar(255),
  last varchar(255),
  PRIMARY KEY (narrator_id)

);

CREATE TABLE categories (

  category_id int,
  name varchar(255),
  PRIMARY KEY (category_id)

);

CREATE TABLE books (

  book_id int,
  title varchar(255),
  subtitle varchar(255),
  author_id int,
  narrator_id int,
  image_url varchar(255),
  audio_sample_url varchar(255),
  length varchar(10),
  version varchar(255),
  PRIMARY KEY (book_id),
  FOREIGN KEY (narrator_id) references narrators(narrator_id),
  FOREIGN KEY (author_id) references authors(author_id)

);

CREATE TABLE books_categories (

  id int,
  book_id int,
  category_id int,
  PRIMARY KEY (id),
  FOREIGN KEY (book_id) references books(book_id),
  FOREIGN KEY (category_id) references categories(category_id)

);