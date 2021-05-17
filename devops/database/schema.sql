CREATE TABLE flight (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
  flight_date TIMESTAMP WITH TIME ZONE NOT NULL,
  deleted BOOLEAN NOT NULL DEFAULT FALSE,
  -- This should be normalized
  price FLOAT NOT NULL,
  origin VARCHAR(255) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  location_info JSONB NOT NULL
);

CREATE TABLE person  (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  identity_number INTEGER NOT NULL,
  birth_date date NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE app_user (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
  UNIQUE(email),
  UNIQUE(phone)
);

CREATE TABLE person_flight (
  id SERIAL PRIMARY KEY,
  flight_role VARCHAR(255) NOT NULL,
  person_id INTEGER NOT NULL,
  flight_id INTEGER NOT NULL,

  -- References
  FOREIGN KEY (person_id) REFERENCES person (id) ON DELETE NO ACTION,
  FOREIGN KEY (flight_id) REFERENCES flight (id) ON DELETE NO ACTION
);
