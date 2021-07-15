DROP TABLE IF EXISTS authors CASCADE;
DROP TABLE IF EXISTS narrators CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS books_categories CASCADE;

CREATE TABLE categories (

  id BIGSERIAL PRIMARY KEY,
  name varchar(255)

);

CREATE TABLE books (

  id BIGSERIAL PRIMARY KEY,
  title varchar(255),
  subtitle varchar(255),
  author varchar(255),
  narrator varchar(255),
  image_url varchar(255),
  audio_sample_url varchar(255),
  length varchar(10),
  version varchar(255),
  category1 varchar(255),
  category2 varchar(255)

);

CREATE TABLE books_categories (

  id BIGSERIAL PRIMARY KEY,
  book_id SERIAL,
  category_id SERIAL,
  FOREIGN KEY (book_id)
      REFERENCES books(id)
      ON DELETE CASCADE,
  FOREIGN KEY (category_id)
      REFERENCES categories(id)
      ON DELETE CASCADE

);