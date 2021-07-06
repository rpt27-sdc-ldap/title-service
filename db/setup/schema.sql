DROP TABLE IF EXISTS authors CASCADE;
DROP TABLE IF EXISTS narrators CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS books_categories CASCADE;

CREATE TABLE categories (

  id SERIAL PRIMARY KEY,
  name varchar(255)

);

CREATE TABLE books (

  id SERIAL PRIMARY KEY,
  title varchar(255),
  subtitle varchar(255),
  author varchar(255),
  narrator varchar(255),
  image_url varchar(255),
  audio_sample_url varchar(255),
  length varchar(10),
  version varchar(255)
  -- FOREIGN KEY (narrator_id) references narrators(narrator_id),
  -- FOREIGN KEY (author_id) references authors(author_id)

);

CREATE TABLE books_categories (

  id SERIAL PRIMARY KEY,
  book_id SERIAL,
  category_id SERIAL,
  FOREIGN KEY (id) references books(id),
  FOREIGN KEY (id) references categories(id)

);