-- -- Complete setup for movie_ticket_booking_website

-- CREATE DATABASE IF NOT EXISTS movie_ticket_booking_website;
-- USE movie_ticket_booking_website;

-- -- Tables (includes poster_url and description on movies)
-- CREATE TABLE IF NOT EXISTS users (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   name VARCHAR(100) NOT NULL,
--   email VARCHAR(120) NOT NULL UNIQUE,
--   password_hash VARCHAR(255) NOT NULL,
--   role ENUM('user','admin') NOT NULL DEFAULT 'user',
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE IF NOT EXISTS movies (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   title VARCHAR(200) NOT NULL,
--   genre VARCHAR(50),
--   duration_mins INT,
--   language VARCHAR(50),
--   rating VARCHAR(10),
--   description TEXT,
--   poster_url VARCHAR(512)
-- );

-- CREATE TABLE IF NOT EXISTS theatres (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   name VARCHAR(150) NOT NULL,
--   city VARCHAR(100) NOT NULL
-- );

-- CREATE TABLE IF NOT EXISTS showtimes (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   movie_id INT NOT NULL,
--   theatre_id INT NOT NULL,
--   start_time DATETIME NOT NULL,
--   price_inr INT NOT NULL DEFAULT 250,
--   CONSTRAINT fk_show_movie FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
--   CONSTRAINT fk_show_theatre FOREIGN KEY (theatre_id) REFERENCES theatres(id) ON DELETE CASCADE
-- );

-- CREATE TABLE IF NOT EXISTS seats (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   theatre_id INT NOT NULL,
--   row_label CHAR(1) NOT NULL,
--   seat_number INT NOT NULL,
--   UNIQUE KEY uniq_seat (theatre_id, row_label, seat_number),
--   CONSTRAINT fk_seat_theatre FOREIGN KEY (theatre_id) REFERENCES theatres(id) ON DELETE CASCADE
-- );

-- CREATE TABLE IF NOT EXISTS bookings (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   user_id INT NOT NULL,
--   showtime_id INT NOT NULL,
--   total_amount_inr INT NOT NULL,
--   status ENUM('confirmed','cancelled') NOT NULL DEFAULT 'confirmed',
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   CONSTRAINT fk_booking_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
--   CONSTRAINT fk_booking_show FOREIGN KEY (showtime_id) REFERENCES showtimes(id) ON DELETE CASCADE
-- );

-- CREATE TABLE IF NOT EXISTS booking_seats (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   booking_id INT NOT NULL,
--   showtime_id INT NOT NULL,
--   seat_id INT NOT NULL,
--   status ENUM('booked') NOT NULL DEFAULT 'booked',
--   UNIQUE KEY uniq_show_seat (showtime_id, seat_id),
--   CONSTRAINT fk_bs_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
--   CONSTRAINT fk_bs_show FOREIGN KEY (showtime_id) REFERENCES showtimes(id) ON DELETE CASCADE,
--   CONSTRAINT fk_bs_seat FOREIGN KEY (seat_id) REFERENCES seats(id) ON DELETE CASCADE
-- );

-- -- Theatres (2 total)
-- INSERT INTO theatres (name, city) VALUES
-- ('PVR Forum', 'Bengaluru'),
-- ('INOX Phoenix', 'Mumbai');

-- -- Seat maps for each theatre
-- -- Theatre 1: A-C x 1-10
-- INSERT INTO seats (theatre_id, row_label, seat_number)
-- SELECT 1, rl, sn FROM (SELECT 'A' rl UNION SELECT 'B' UNION SELECT 'C') rls
-- CROSS JOIN (
--   SELECT 1 sn UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 
--   UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10
-- ) sns;

-- -- Theatre 2: A-B x 1-8
-- INSERT INTO seats (theatre_id, row_label, seat_number)
-- SELECT 2, rl, sn FROM (SELECT 'A' rl UNION SELECT 'B') rls
-- CROSS JOIN (
--   SELECT 1 sn UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 
--   UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8
-- ) sns;

-- -- Movies per theatre: 3 genres (Action, Romance, Thriller) and 2 movies per genre per theatre
-- -- Use poster image names you supplied as poster_url values

-- -- Theatre 1 (PVR Forum)
-- INSERT INTO movies (title, genre, duration_mins, language, rating, description, poster_url) VALUES
-- ('Pathaan', 'Action', 146, 'Hindi', 'U/A', 'An agent returns to stop a bio-weapon plot.', 'pathaan.jpg'),
-- ('Baahubali: The Beginning', 'Action', 159, 'Telugu', 'U/A', 'A young man discovers his legacy and a kingdom''s fate.', 'baahubali.jpg'),
-- ('Yeh Jawaani Hai Deewani', 'Romance', 160, 'Hindi', 'U/A', 'Friends, love, and life choices from youth to adulthood.', 'yeh_jawaani_hai_deewani.jpg'),
-- ('Kabir Singh', 'Romance', 173, 'Hindi', 'A', 'A brilliant surgeon spirals after heartbreak and seeks redemption.', 'kabir_singh.jpg'),
-- ('Inception', 'Thriller', 148, 'English', 'PG-13', 'A thief who steals corporate secrets through dream-sharing tech.', 'inception.jpg'),
-- ('Kaabil', 'Thriller', 139, 'Hindi', 'U/A', 'A blind man seeks justice after a tragic crime.', 'kaabil.jpg');

-- -- Theatre 2 (INOX Phoenix)
-- INSERT INTO movies (title, genre, duration_mins, language, rating, description, poster_url) VALUES
-- ('Animal', 'Action', 201, 'Hindi', 'A', 'A violent saga of a father-son bond and vengeance.', 'animal.jpg'),
-- ('Chhaava', 'Action', 150, 'Hindi', 'U/A', 'Epic tale set in the Maratha era.', 'chhaava.jpg'),
-- ('Raanjhanaa', 'Romance', 140, 'Hindi', 'U/A', 'A passionate lover''s journey through heartbreak and hope.', 'raanjhanaa.jpg'),
-- ('Saiyaara', 'Romance', 130, 'Hindi', 'U/A', 'A heartfelt love story.', 'saiyaara.jpg'),
-- ('Kahaani 2', 'Thriller', 129, 'Hindi', 'U/A', 'A woman entangled in a web of secrets and pursuit.', 'kahaani2.jpg'),
-- ('Munjya', 'Thriller', 120, 'Hindi', 'U/A', 'A horror-comedy about folklore coming to life.', 'munjya.jpg');

-- -- SHOWTIMES: Two showtimes per movie, linked to correct theatre via movie-title and theatre name
-- -- Helper: insert showtimes using subqueries to fetch ids

-- -- Theatre 1 mappings
-- INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
-- SELECT m.id, t.id, DATE_ADD(NOW(), INTERVAL 1 DAY), 300 FROM movies m JOIN theatres t ON t.name='PVR Forum' WHERE m.title='Pathaan';
-- INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
-- SELECT m.id, t.id, DATE_ADD(NOW(), INTERVAL 1 DAY + 3 HOUR), 300 FROM movies m JOIN theatres t ON t.name='PVR Forum' WHERE m.title='Pathaan';

-- INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
-- SELECT m.id, t.id, DATE_ADD(NOW(), INTERVAL 2 DAY), 320 FROM movies m JOIN theatres t ON t.name='PVR Forum' WHERE m.title='Baahubali: The Beginning';
-- INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
-- SELECT m.id, t.id, DATE_ADD(NOW(), INTERVAL 2 DAY + 4 HOUR), 320 FROM movies m JOIN theatres t ON t.name='PVR Forum' WHERE m.title='Baahubali: The Beginning';

-- INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
-- SELECT m.id, t.id, DATE_ADD(NOW(), INTERVAL 1 DAY + 6 HOUR), 250 FROM movies m JOIN theatres t ON t.name='PVR Forum' WHERE m.title='Yeh Jawaani Hai Deewani';
-- INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
-- SELECT m.id, t.id, DATE_ADD(NOW(), INTERVAL 3 DAY), 250 FROM movies m JOIN theatres t ON t.name='PVR Forum' WHERE m.title='Yeh Jawaani Hai Deewani';

-- INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
-- SELECT m.id, t.id, DATE_ADD(NOW(), INTERVAL 1 DAY + 2 HOUR), 260 FROM movies m JOIN theatres t ON t.name='PVR Forum' WHERE m.title='Kabir Singh';
-- INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
-- SELECT m.id, t.id, DATE_ADD(NOW(), INTERVAL 4 DAY), 260 FROM movies m JOIN theatres t ON t.name='PVR Forum' WHERE m.title='Kabir Singh';

-- INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
-- SELECT m.id, t.id, DATE_ADD(NOW(), INTERVAL 1 DAY + 1 HOUR), 280 FROM movies m JOIN theatres t ON t.name='PVR Forum' WHERE m.title='Inception';
-- INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
-- SELECT m.id, t.id, DATE_ADD(NOW(), INTERVAL 3 DAY + 2 HOUR), 280 FROM movies m JOIN theatres t ON t.name='PVR Forum' WHERE m.title='Inception';

-- INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
-- SELECT m.id, t.id, DATE_ADD(NOW(), INTERVAL 2 DAY + 2 HOUR), 240 FROM movies m JOIN theatres t ON t.name='PVR Forum' WHERE m.title='Kaabil';
-- INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
-- SELECT m.id, t.id, DATE_ADD(NOW(), INTERVAL 5 DAY), 240 FROM movies m JOIN theatres t ON t.name='PVR Forum' WHERE m.title='Kaabil';

-- -- Theatre 2 mappings
-- INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
-- SELECT m.id, t.id, DATE_ADD(NOW(), INTERVAL 1 DAY), 320 FROM movies m JOIN theatres t ON t.name='INOX Phoenix' WHERE m.title='Animal';
-- INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
-- SELECT m.id, t.id, DATE_ADD(NOW(), INTERVAL 1 DAY + 3 HOUR), 320 FROM movies m JOIN theatres t ON t.name='INOX Phoenix' WHERE m.title='Animal';

-- INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
-- SELECT m.id, t.id, DATE_ADD(NOW(), INTERVAL 2 DAY), 300 FROM movies m JOIN theatres t ON t.name='INOX Phoenix' WHERE m.title='Chhaava';
-- INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
-- SELECT m.id, t.id, DATE_ADD(NOW(), INTERVAL 2 DAY + 4 HOUR), 300 FROM movies m JOIN theatres t ON t.name='INOX Phoenix' WHERE m.title='Chhaava';

-- INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
-- SELECT m.id, t.id, DATE_ADD(NOW(), INTERVAL 1 DAY + 6 HOUR), 240 FROM movies m JOIN theatres t ON t.name='INOX Phoenix' WHERE m.title='Raanjhanaa';
-- INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
-- SELECT m.id, t.id, DATE_ADD(NOW(), INTERVAL 3 DAY), 240 FROM movies m JOIN theatres t ON t.name='INOX Phoenix' WHERE m.title='Raanjhanaa';

-- INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
-- SELECT m.id, t.id, DATE_ADD(NOW(), INTERVAL 1 DAY + 2 HOUR), 230 FROM movies m JOIN theatres t ON t.name='INOX Phoenix' WHERE m.title='Saiyaara';
-- INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
-- SELECT m.id, t.id, DATE_ADD(NOW(), INTERVAL 4 DAY), 230 FROM movies m JOIN theatres t ON t.name='INOX Phoenix' WHERE m.title='Saiyaara';

-- INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
-- SELECT m.id, t.id, DATE_ADD(NOW(), INTERVAL 1 DAY + 1 HOUR), 250 FROM movies m JOIN theatres t ON t.name='INOX Phoenix' WHERE m.title='Kahaani 2';
-- INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
-- SELECT m.id, t.id, DATE_ADD(NOW(), INTERVAL 3 DAY + 2 HOUR), 250 FROM movies m JOIN theatres t ON t.name='INOX Phoenix' WHERE m.title='Kahaani 2';

-- INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
-- SELECT m.id, t.id, DATE_ADD(NOW(), INTERVAL 2 DAY + 2 HOUR), 220 FROM movies m JOIN theatres t ON t.name='INOX Phoenix' WHERE m.title='Munjya';
-- INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
-- SELECT m.id, t.id, DATE_ADD(NOW(), INTERVAL 5 DAY), 220 FROM movies m JOIN theatres t ON t.name='INOX Phoenix' WHERE m.title='Munjya';

-- Complete setup for movie_ticket_booking_website

-- CREATE DATABASE IF NOT EXISTS movie_ticket_booking_website;
-- USE movie_ticket_booking_website;

-- -- Tables (includes poster_url and description on movies)
-- CREATE TABLE IF NOT EXISTS users (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   name VARCHAR(100) NOT NULL,
--   email VARCHAR(120) NOT NULL UNIQUE,
--   password_hash VARCHAR(255) NOT NULL,
--   role ENUM('user','admin') NOT NULL DEFAULT 'user',
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE IF NOT EXISTS movies (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   title VARCHAR(200) NOT NULL,
--   genre VARCHAR(50),
--   duration_mins INT,
--   language VARCHAR(50),
--   rating VARCHAR(10),
--   description TEXT,
--   poster_url VARCHAR(512)
-- );

-- CREATE TABLE IF NOT EXISTS theatres (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   name VARCHAR(150) NOT NULL,
--   city VARCHAR(100) NOT NULL
-- );

-- CREATE TABLE IF NOT EXISTS showtimes (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   movie_id INT NOT NULL,
--   theatre_id INT NOT NULL,
--   start_time DATETIME NOT NULL,
--   price_inr INT NOT NULL DEFAULT 250,
--   CONSTRAINT fk_show_movie FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
--   CONSTRAINT fk_show_theatre FOREIGN KEY (theatre_id) REFERENCES theatres(id) ON DELETE CASCADE
-- );

-- CREATE TABLE IF NOT EXISTS seats (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   theatre_id INT NOT NULL,
--   row_label CHAR(1) NOT NULL,
--   seat_number INT NOT NULL,
--   UNIQUE KEY uniq_seat (theatre_id, row_label, seat_number),
--   CONSTRAINT fk_seat_theatre FOREIGN KEY (theatre_id) REFERENCES theatres(id) ON DELETE CASCADE
-- );

-- CREATE TABLE IF NOT EXISTS bookings (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   user_id INT NOT NULL,
--   showtime_id INT NOT NULL,
--   total_amount_inr INT NOT NULL,
--   status ENUM('confirmed','cancelled') NOT NULL DEFAULT 'confirmed',
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   CONSTRAINT fk_booking_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
--   CONSTRAINT fk_booking_show FOREIGN KEY (showtime_id) REFERENCES showtimes(id) ON DELETE CASCADE
-- );

-- CREATE TABLE IF NOT EXISTS booking_seats (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   booking_id INT NOT NULL,
--   showtime_id INT NOT NULL,
--   seat_id INT NOT NULL,
--   status ENUM('booked') NOT NULL DEFAULT 'booked',
--   UNIQUE KEY uniq_show_seat (showtime_id, seat_id),
--   CONSTRAINT fk_bs_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
--   CONSTRAINT fk_bs_show FOREIGN KEY (showtime_id) REFERENCES showtimes(id) ON DELETE CASCADE,
--   CONSTRAINT fk_bs_seat FOREIGN KEY (seat_id) REFERENCES seats(id) ON DELETE CASCADE
-- );

-- -- Theatres
-- INSERT INTO theatres (name, city) VALUES
-- ('PVR Forum', 'Bengaluru'),
-- ('INOX Phoenix', 'Mumbai');

-- -- Seats
-- INSERT INTO seats (theatre_id, row_label, seat_number)
-- SELECT 1, rl, sn FROM (SELECT 'A' rl UNION SELECT 'B' UNION SELECT 'C') rls
-- CROSS JOIN (
--   SELECT 1 sn UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 
--   UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10
-- ) sns;

-- INSERT INTO seats (theatre_id, row_label, seat_number)
-- SELECT 2, rl, sn FROM (SELECT 'A' rl UNION SELECT 'B') rls
-- CROSS JOIN (
--   SELECT 1 sn UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 
--   UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8
-- ) sns;

-- -- Movies
-- INSERT INTO movies (title, genre, duration_mins, language, rating, description, poster_url) VALUES
-- ('Pathaan', 'Action', 146, 'Hindi', 'U/A', 'An agent returns to stop a bio-weapon plot.', 'pathaan.jpg'),
-- ('Baahubali: The Beginning', 'Action', 159, 'Telugu', 'U/A', 'A young man discovers his legacy and a kingdom''s fate.', 'baahubali.jpg'),
-- ('Yeh Jawaani Hai Deewani', 'Romance', 160, 'Hindi', 'U/A', 'Friends, love, and life choices from youth to adulthood.', 'yeh_jawaani_hai_deewani.jpg'),
-- ('Kabir Singh', 'Romance', 173, 'Hindi', 'A', 'A brilliant surgeon spirals after heartbreak and seeks redemption.', 'kabir_singh.jpg'),
-- ('Inception', 'Thriller', 148, 'English', 'PG-13', 'A thief who steals corporate secrets through dream-sharing tech.', 'inception.jpg'),
-- ('Kaabil', 'Thriller', 139, 'Hindi', 'U/A', 'A blind man seeks justice after a tragic crime.', 'kaabil.jpg'),
-- ('Animal', 'Action', 201, 'Hindi', 'A', 'A violent saga of a father-son bond and vengeance.', 'animal.jpg'),
-- ('Chhaava', 'Action', 150, 'Hindi', 'U/A', 'Epic tale set in the Maratha era.', 'chhaava.jpg'),
-- ('Raanjhanaa', 'Romance', 140, 'Hindi', 'U/A', 'A passionate lover''s journey through heartbreak and hope.', 'raanjhanaa.jpg'),
-- ('Saiyaara', 'Romance', 130, 'Hindi', 'U/A', 'A heartfelt love story.', 'saiyaara.jpg'),
-- ('Kahaani 2', 'Thriller', 129, 'Hindi', 'U/A', 'A woman entangled in a web of secrets and pursuit.', 'kahaani2.jpg'),
-- ('Munjya', 'Thriller', 120, 'Hindi', 'U/A', 'A horror-comedy about folklore coming to life.', 'munjya.jpg');

-- -- SHOWTIMES
-- -- Theatre 1 (PVR Forum)
-- INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
-- SELECT m.id, t.id, DATE_ADD(NOW(), INTERVAL 1 DAY), 300 FROM movies m JOIN theatres t ON t.name='PVR Forum' WHERE m.title='Pathaan';
-- INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
-- SELECT m.id, t.id, DATE_ADD(DATE_ADD(NOW(), INTERVAL 1 DAY), INTERVAL 3 HOUR), 300 FROM movies m JOIN theatres t ON t.name='PVR Forum' WHERE m.title='Pathaan';

-- INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
-- SELECT m.id, t.id, DATE_ADD(NOW(), INTERVAL 2 DAY), 320 FROM movies m JOIN theatres t ON t.name='PVR Forum' WHERE m.title='Baahubali: The Beginning';
-- INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
-- SELECT m.id, t.id, DATE_ADD(DATE_ADD(NOW(), INTERVAL 2 DAY), INTERVAL 4 HOUR), 320 FROM movies m JOIN theatres t ON t.name='PVR Forum' WHERE m.title='Baahubali: The Beginning';

-- INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
-- SELECT m.id, t.id, DATE_ADD(DATE_ADD(NOW(), INTERVAL 1 DAY), INTERVAL 6 HOUR), 250 FROM movies m JOIN theatres t ON t.name='PVR Forum' WHERE m.title='Yeh Jawaani Hai Deewani';
-- INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
-- SELECT m.id, t.id, DATE_ADD(NOW(), INTERVAL 3 DAY), 250 FROM movies m JOIN theatres t ON t.name='PVR Forum' WHERE m.title='Yeh Jawaani Hai Deewani';

-- INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
-- SELECT m.id, t.id, DATE_ADD(DATE_ADD(NOW(), INTERVAL 1 DAY), INTERVAL 2 HOUR), 260 FROM movies m JOIN theatres t ON t.name='PVR Forum' WHERE m.title='Kabir Singh';
-- INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
-- SELECT m.id, t.id, DATE_ADD(NOW(), INTERVAL 4 DAY), 260 FROM movies m JOIN theatres t ON t.name='PVR Forum' WHERE m.title='Kabir Singh';

-- INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
-- SELECT m.id, t.id, DATE_ADD(DATE_ADD(NOW(), INTERVAL 1 DAY), INTERVAL 1 HOUR), 280 FROM movies m JOIN theatres t ON t.name='PVR Forum' WHERE m.title='Inception';
-- INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
-- SELECT m.id, t.id, DATE_ADD(DATE_ADD(NOW(), INTERVAL 3 DAY), INTERVAL 2 HOUR), 280 FROM movies m JOIN theatres t ON t.name='PVR Forum' WHERE m.title='Inception';

-- INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
-- SELECT m.id, t.id, DATE_ADD(DATE_ADD(NOW(), INTERVAL 2 DAY), INTERVAL 2 HOUR), 240 FROM movies m JOIN theatres t ON t.name='PVR Forum' WHERE m.title='Kaabil';
-- INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
-- SELECT m.id, t.id, DATE_ADD(NOW(), INTERVAL 5 DAY), 240 FROM movies m JOIN theatres t ON t.name='PVR Forum' WHERE m.title='Kaabil';

-- -- Theatre 2 (INOX Phoenix)
-- INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
-- SELECT m.id, t.id, DATE_ADD(NOW(), INTERVAL 1 DAY), 320 FROM movies m JOIN theatres t ON t.name='INOX Phoenix' WHERE m.title='Animal';
-- INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
-- SELECT m.id, t.id, DATE_ADD(DATE_ADD(NOW(), INTERVAL 1 DAY), INTERVAL 3 HOUR), 320 FROM movies m JOIN theatres t ON t.name='INOX Phoenix' WHERE m.title='Animal';

-- INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
-- SELECT m.id, t.id, DATE_ADD(NOW(), INTERVAL 2 DAY), 300 FROM movies m JOIN theatres t ON t.name='INOX Phoenix' WHERE m.title='Chhaava';
-- INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
-- SELECT m.id, t.id, DATE_ADD(DATE_ADD(NOW(), INTERVAL 2 DAY), INTERVAL 4 HOUR), 300 FROM movies m JOIN theatres t ON t.name='INOX Phoenix' WHERE m.title='Chhaava';

-- INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
-- SELECT m.id, t.id, DATE_ADD(DATE_ADD(NOW(), INTERVAL 1 DAY), INTERVAL 6 HOUR), 240 FROM movies m JOIN theatres t ON t.name='INOX Phoenix' WHERE m.title='Raanjhanaa';
-- INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
-- SELECT m.id, t.id, DATE_ADD(NOW(), INTERVAL 3 DAY), 240 FROM movies m JOIN theatres t ON t.name='INOX Phoenix' WHERE m.title='Raanjhanaa';

-- INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
-- SELECT m.id, t.id, DATE_ADD(DATE_ADD(NOW(), INTERVAL 1 DAY), INTERVAL 2 HOUR), 230 FROM movies m JOIN theatres t ON t.name='INOX Phoenix' WHERE m.title='Saiyaara';
-- INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
-- SELECT m.id, t.id, DATE_ADD(NOW(), INTERVAL 4 DAY), 230 FROM movies m JOIN theatres t ON t.name='INOX Phoenix' WHERE m.title='Saiyaara';

-- INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
-- SELECT m.id, t.id, DATE_ADD(DATE_ADD(NOW(), INTERVAL 1 DAY), INTERVAL 1 HOUR), 250 FROM movies m JOIN theatres t ON t.name='INOX Phoenix' WHERE m.title='Kahaani 2';
-- INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
-- SELECT m.id, t.id, DATE_ADD(DATE_ADD(NOW(), INTERVAL 3 DAY), INTERVAL 2 HOUR), 250 FROM movies m JOIN theatres t ON t.name='INOX Phoenix' WHERE m.title='Kahaani 2';

-- INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
-- SELECT m.id, t.id, DATE_ADD(DATE_ADD(NOW(), INTERVAL 2 DAY), INTERVAL 2 HOUR), 220 FROM movies m JOIN theatres t ON t.name='INOX Phoenix' WHERE m.title='Munjya';
-- INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
-- SELECT m.id, t.id, DATE_ADD(NOW()_

-- Complete setup for movie_ticket_booking_website

CREATE DATABASE IF NOT EXISTS movie_ticket_booking_website;
USE movie_ticket_booking_website;

-- Tables (includes poster_url and description on movies)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user','admin') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS movies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  genre VARCHAR(50),
  duration_mins INT,
  language VARCHAR(50),
  rating VARCHAR(10),
  description TEXT,
  poster_url VARCHAR(512)
);

CREATE TABLE IF NOT EXISTS theatres (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  city VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS showtimes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  movie_id INT NOT NULL,
  theatre_id INT NOT NULL,
  start_time DATETIME NOT NULL,
  price_inr INT NOT NULL DEFAULT 250,
  CONSTRAINT fk_show_movie FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
  CONSTRAINT fk_show_theatre FOREIGN KEY (theatre_id) REFERENCES theatres(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS seats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  theatre_id INT NOT NULL,
  row_label CHAR(1) NOT NULL,
  seat_number INT NOT NULL,
  UNIQUE KEY uniq_seat (theatre_id, row_label, seat_number),
  CONSTRAINT fk_seat_theatre FOREIGN KEY (theatre_id) REFERENCES theatres(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  showtime_id INT NOT NULL,
  total_amount_inr INT NOT NULL,
  status ENUM('confirmed','cancelled') NOT NULL DEFAULT 'confirmed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_booking_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_booking_show FOREIGN KEY (showtime_id) REFERENCES showtimes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS booking_seats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  showtime_id INT NOT NULL,
  seat_id INT NOT NULL,
  status ENUM('booked') NOT NULL DEFAULT 'booked',
  UNIQUE KEY uniq_show_seat (showtime_id, seat_id),
  CONSTRAINT fk_bs_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  CONSTRAINT fk_bs_show FOREIGN KEY (showtime_id) REFERENCES showtimes(id) ON DELETE CASCADE,
  CONSTRAINT fk_bs_seat FOREIGN KEY (seat_id) REFERENCES seats(id) ON DELETE CASCADE
);

-- Theatres
INSERT INTO theatres (name, city) VALUES
('PVR Forum', 'Bengaluru'),
('INOX Phoenix', 'Mumbai');

-- Seats
INSERT INTO seats (theatre_id, row_label, seat_number)
SELECT 1, rl, sn FROM (SELECT 'A' rl UNION SELECT 'B' UNION SELECT 'C') rls
CROSS JOIN (
  SELECT 1 sn UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 
  UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10
) sns;

INSERT INTO seats (theatre_id, row_label, seat_number)
SELECT 2, rl, sn FROM (SELECT 'A' rl UNION SELECT 'B') rls
CROSS JOIN (
  SELECT 1 sn UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 
  UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8
) sns;

-- Movies
INSERT INTO movies (title, genre, duration_mins, language, rating, description, poster_url) VALUES
('Pathaan', 'Action', 146, 'Hindi', 'U/A', 'An agent returns to stop a bio-weapon plot.', 'pathaan.jpg'),
('Baahubali: The Beginning', 'Action', 159, 'Telugu', 'U/A', 'A young man discovers his legacy and a kingdom''s fate.', 'baahubali.jpg'),
('Yeh Jawaani Hai Deewani', 'Romance', 160, 'Hindi', 'U/A', 'Friends, love, and life choices from youth to adulthood.', 'yeh_jawaani_hai_deewani.jpg'),
('Kabir Singh', 'Romance', 173, 'Hindi', 'A', 'A brilliant surgeon spirals after heartbreak and seeks redemption.', 'kabir_singh.jpg'),
('Inception', 'Thriller', 148, 'English', 'PG-13', 'A thief who steals corporate secrets through dream-sharing tech.', 'inception.jpg'),
('Kaabil', 'Thriller', 139, 'Hindi', 'U/A', 'A blind man seeks justice after a tragic crime.', 'kaabil.jpg'),
('Animal', 'Action', 201, 'Hindi', 'A', 'A violent saga of a father-son bond and vengeance.', 'animal.jpg'),
('Chhaava', 'Action', 150, 'Hindi', 'U/A', 'Epic tale set in the Maratha era.', 'chhaava.jpg'),
('Raanjhanaa', 'Romance', 140, 'Hindi', 'U/A', 'A passionate lover''s journey through heartbreak and hope.', 'raanjhanaa.jpg'),
('Saiyaara', 'Romance', 130, 'Hindi', 'U/A', 'A heartfelt love story.', 'saiyaara.jpg'),
('Kahaani 2', 'Thriller', 129, 'Hindi', 'U/A', 'A woman entangled in a web of secrets and pursuit.', 'kahaani2.jpg'),
('Munjya', 'Thriller', 120, 'Hindi', 'U/A', 'A horror-comedy about folklore coming to life.', 'munjya.jpg');

-- SHOWTIMES
-- Theatre 1 (PVR Forum)
INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
SELECT m.id, t.id, DATE_ADD(NOW(), INTERVAL 1 DAY), 300 FROM movies m JOIN theatres t ON t.name='PVR Forum' WHERE m.title='Pathaan';
INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
SELECT m.id, t.id, DATE_ADD(DATE_ADD(NOW(), INTERVAL 1 DAY), INTERVAL 3 HOUR), 300 FROM movies m JOIN theatres t ON t.name='PVR Forum' WHERE m.title='Pathaan';

INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
SELECT m.id, t.id, DATE_ADD(NOW(), INTERVAL 2 DAY), 320 FROM movies m JOIN theatres t ON t.name='PVR Forum' WHERE m.title='Baahubali: The Beginning';
INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
SELECT m.id, t.id, DATE_ADD(DATE_ADD(NOW(), INTERVAL 2 DAY), INTERVAL 4 HOUR), 320 FROM movies m JOIN theatres t ON t.name='PVR Forum' WHERE m.title='Baahubali: The Beginning';

INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
SELECT m.id, t.id, DATE_ADD(DATE_ADD(NOW(), INTERVAL 1 DAY), INTERVAL 6 HOUR), 250 FROM movies m JOIN theatres t ON t.name='PVR Forum' WHERE m.title='Yeh Jawaani Hai Deewani';
INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
SELECT m.id, t.id, DATE_ADD(NOW(), INTERVAL 3 DAY), 250 FROM movies m JOIN theatres t ON t.name='PVR Forum' WHERE m.title='Yeh Jawaani Hai Deewani';

INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
SELECT m.id, t.id, DATE_ADD(DATE_ADD(NOW(), INTERVAL 1 DAY), INTERVAL 2 HOUR), 260 FROM movies m JOIN theatres t ON t.name='PVR Forum' WHERE m.title='Kabir Singh';
INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
SELECT m.id, t.id, DATE_ADD(NOW(), INTERVAL 4 DAY), 260 FROM movies m JOIN theatres t ON t.name='PVR Forum' WHERE m.title='Kabir Singh';

INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
SELECT m.id, t.id, DATE_ADD(DATE_ADD(NOW(), INTERVAL 1 DAY), INTERVAL 1 HOUR), 280 FROM movies m JOIN theatres t ON t.name='PVR Forum' WHERE m.title='Inception';
INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
SELECT m.id, t.id, DATE_ADD(DATE_ADD(NOW(), INTERVAL 3 DAY), INTERVAL 2 HOUR), 280 FROM movies m JOIN theatres t ON t.name='PVR Forum' WHERE m.title='Inception';

INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
SELECT m.id, t.id, DATE_ADD(DATE_ADD(NOW(), INTERVAL 2 DAY), INTERVAL 2 HOUR), 240 FROM movies m JOIN theatres t ON t.name='PVR Forum' WHERE m.title='Kaabil';
INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
SELECT m.id, t.id, DATE_ADD(NOW(), INTERVAL 5 DAY), 240 FROM movies m JOIN theatres t ON t.name='PVR Forum' WHERE m.title='Kaabil';

-- Theatre 2 (INOX Phoenix)
INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
SELECT m.id, t.id, DATE_ADD(NOW(), INTERVAL 1 DAY), 320 FROM movies m JOIN theatres t ON t.name='INOX Phoenix' WHERE m.title='Animal';
INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
SELECT m.id, t.id, DATE_ADD(DATE_ADD(NOW(), INTERVAL 1 DAY), INTERVAL 3 HOUR), 320 FROM movies m JOIN theatres t ON t.name='INOX Phoenix' WHERE m.title='Animal';

INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
SELECT m.id, t.id, DATE_ADD(NOW(), INTERVAL 2 DAY), 300 FROM movies m JOIN theatres t ON t.name='INOX Phoenix' WHERE m.title='Chhaava';
INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
SELECT m.id, t.id, DATE_ADD(DATE_ADD(NOW(), INTERVAL 2 DAY), INTERVAL 4 HOUR), 300 FROM movies m JOIN theatres t ON t.name='INOX Phoenix' WHERE m.title='Chhaava';

INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
SELECT m.id, t.id, DATE_ADD(DATE_ADD(NOW(), INTERVAL 1 DAY), INTERVAL 6 HOUR), 240 FROM movies m JOIN theatres t ON t.name='INOX Phoenix' WHERE m.title='Raanjhanaa';
INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
SELECT m.id, t.id, DATE_ADD(NOW(), INTERVAL 3 DAY), 240 FROM movies m JOIN theatres t ON t.name='INOX Phoenix' WHERE m.title='Raanjhanaa';

INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
SELECT m.id, t.id, DATE_ADD(DATE_ADD(NOW(), INTERVAL 1 DAY), INTERVAL 2 HOUR), 230 FROM movies m JOIN theatres t ON t.name='INOX Phoenix' WHERE m.title='Saiyaara';
INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
SELECT m.id, t.id, DATE_ADD(NOW(), INTERVAL 4 DAY), 230 FROM movies m JOIN theatres t ON t.name='INOX Phoenix' WHERE m.title='Saiyaara';

INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
SELECT m.id, t.id, DATE_ADD(DATE_ADD(NOW(), INTERVAL 1 DAY), INTERVAL 1 HOUR), 250 FROM movies m JOIN theatres t ON t.name='INOX Phoenix' WHERE m.title='Kahaani 2';
INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
SELECT m.id, t.id, DATE_ADD(DATE_ADD(NOW(), INTERVAL 3 DAY), INTERVAL 2 HOUR), 250 FROM movies m JOIN theatres t ON t.name='INOX Phoenix' WHERE m.title='Kahaani 2';

INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
SELECT m.id, t.id, DATE_ADD(DATE_ADD(NOW(), INTERVAL 2 DAY), INTERVAL 2 HOUR), 220 FROM movies m JOIN theatres t ON t.name='INOX Phoenix' WHERE m.title='Munjya';
INSERT INTO showtimes (movie_id, theatre_id, start_time, price_inr)
SELECT m.id, t.id, DATE_ADD(NOW(), INTERVAL 5 DAY), 220 FROM movies m JOIN theatres t ON t.name='INOX Phoenix' WHERE m.title='Munjya';

