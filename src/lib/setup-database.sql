-- Create the lifelink database if it doesn't exist
CREATE DATABASE IF NOT EXISTS lifelink;

-- Use the lifelink database
USE lifelink;

-- Create donors table
CREATE TABLE IF NOT EXISTS donors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  blood_type VARCHAR(10),
  last_donation DATE,
  donation_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create hospitals table
CREATE TABLE IF NOT EXISTS hospitals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create blood_inventory table
CREATE TABLE IF NOT EXISTS blood_inventory (
  id INT AUTO_INCREMENT PRIMARY KEY,
  hospital_id INT NOT NULL,
  blood_type VARCHAR(10) NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  status ENUM('low', 'medium', 'high', 'critical') NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
);

-- Create donations table
CREATE TABLE IF NOT EXISTS donations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  donor_id INT NOT NULL,
  hospital_id INT NOT NULL,
  donation_date DATE NOT NULL,
  blood_type VARCHAR(10) NOT NULL,
  quantity INT NOT NULL,
  status ENUM('scheduled', 'completed', 'cancelled') NOT NULL DEFAULT 'scheduled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (donor_id) REFERENCES donors(id),
  FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
);

-- Create emergency_alerts table
CREATE TABLE IF NOT EXISTS emergency_alerts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  hospital_id INT NOT NULL,
  blood_type VARCHAR(10) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('active', 'resolved') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP NULL,
  FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
);

-- Insert sample data for donors
INSERT INTO donors (name, email, password, blood_type, last_donation, donation_count) VALUES
('John Donor', 'donor@example.com', 'password123', 'O+', '2023-10-15', 5),
('Jane Smith', 'jane@example.com', 'password123', 'A-', '2023-11-20', 3),
('Mike Johnson', 'mike@example.com', 'password123', 'B+', '2023-09-05', 8);

-- Insert sample data for hospitals
INSERT INTO hospitals (name, email, password, location) VALUES
('Memorial Hospital', 'hospital@example.com', 'password123', '123 Medical Ave'),
('City General Hospital', 'city@example.com', 'password123', '456 Health Blvd'),
('University Medical Center', 'university@example.com', 'password123', '789 Campus Dr');

-- Insert sample blood inventory data
INSERT INTO blood_inventory (hospital_id, blood_type, quantity, status) VALUES
(1, 'A+', 50, 'medium'),
(1, 'O-', 10, 'critical'),
(1, 'B-', 25, 'low'),
(2, 'AB+', 30, 'medium'),
(2, 'O+', 15, 'low'),
(3, 'A-', 20, 'medium');

-- Insert sample donations
INSERT INTO donations (donor_id, hospital_id, donation_date, blood_type, quantity, status) VALUES
(1, 1, '2023-10-15', 'O+', 1, 'completed'),
(2, 2, '2023-11-20', 'A-', 1, 'completed'),
(3, 1, '2023-09-05', 'B+', 1, 'completed'),
(1, 3, '2023-12-10', 'O+', 1, 'completed'),
(1, 1, CURDATE() + INTERVAL 5 DAY, 'O+', 1, 'scheduled');

-- Insert sample emergency alerts
INSERT INTO emergency_alerts (hospital_id, blood_type, message, status) VALUES
(1, 'O-', 'Critical shortage of O- blood. Urgent donors needed!', 'active'),
(2, 'AB+', 'Low supply of AB+ blood. Please donate if you can.', 'active'),
(3, 'B-', 'Emergency need for B- blood due to multiple trauma cases.', 'active');