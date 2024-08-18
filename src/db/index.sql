BEGIN;

CREATE TABLE verification_token
(
  identifier TEXT NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  token TEXT NOT NULL,
 
  PRIMARY KEY (identifier, token)
);
 
CREATE TABLE accounts
(
  id SERIAL,
  "userId" INTEGER NOT NULL,
  type VARCHAR(255) NOT NULL,
  provider VARCHAR(255) NOT NULL,
  "providerAccountId" VARCHAR(255) NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  id_token TEXT,
  scope TEXT,
  session_state TEXT,
  token_type TEXT,
 
  PRIMARY KEY (id)
);
 
CREATE TABLE sessions
(
  id SERIAL,
  "userId" INTEGER NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  "sessionToken" VARCHAR(255) NOT NULL,
 
  PRIMARY KEY (id)
);
 
CREATE TABLE users
(
  id SERIAL,
  name VARCHAR(255),
  email VARCHAR(255),
  "emailVerified" TIMESTAMPTZ,
  image TEXT,
  "role" TEXT DEFAULT 'standard' NOT NULL,
  image_public_id TEXT,
  PRIMARY KEY (id)
);

CREATE TABLE product(
    product_id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    "description" VARCHAR,
    price NUMERIC(10, 2) NOT NULL,
    upload_time TIMESTAMP DEFAULT current_timestamp,
    approved BOOL DEFAULT false,
    FK_users_id INT REFERENCES users(id)
);

CREATE TABLE product_image( 
    product_image_id SERIAL PRIMARY KEY,
    product_image VARCHAR, 
    FK_product_id INT REFERENCES product(product_id),
    public_id TEXT NOT NULL,
    "order" SMALLINT
);

CREATE TABLE tag( 
    tag_id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    FK_product_id INT REFERENCES product(product_id)
);

CREATE TABLE product_download( 
    product_download_id SERIAL PRIMARY KEY,
    product_download_link TEXT NOT NULL,
    FK_product_id INT REFERENCES product(product_id),
    public_id TEXT NOT NULL
);

CREATE TABLE user_image(
    user_image_id SERIAL PRIMARY KEY,
    profile_image TEXT,
    FK_user_id INT REFERENCES users(id)
);

COMMIT;