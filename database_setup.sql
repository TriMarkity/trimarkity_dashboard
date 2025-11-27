-- Create database
CREATE DATABASE IF NOT EXISTS marketing_dashboard;
USE marketing_dashboard;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    hashed_password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    avatar_url VARCHAR(500),
    phone VARCHAR(20),
    company VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_username (username)
);

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    company VARCHAR(255),
    status VARCHAR(50) DEFAULT 'new',
    source VARCHAR(100),
    value DECIMAL(10,2) DEFAULT 0.00,
    notes TEXT,
    tags JSON,
    owner_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_owner_id (owner_id),
    INDEX idx_status (status),
    INDEX idx_email (email)
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read)
);

-- Create campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'draft',
    budget DECIMAL(10,2) DEFAULT 0.00,
    spent DECIMAL(10,2) DEFAULT 0.00,
    impressions INT DEFAULT 0,
    clicks INT DEFAULT 0,
    conversions INT DEFAULT 0,
    start_date TIMESTAMP NULL,
    end_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_type (type)
);

-- Create analytics table
CREATE TABLE IF NOT EXISTS analytics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date TIMESTAMP NOT NULL,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,2) NOT NULL,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_date (date),
    INDEX idx_metric_name (metric_name)
);

-- Create password_resets table
CREATE TABLE IF NOT EXISTS password_resets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_token (token),
    INDEX idx_email (email)
);

-- Insert sample data
INSERT INTO users (email, username, full_name, hashed_password, company, role) VALUES
('admin@example.com', 'admin', 'Admin User', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq9w5KS', 'Marketing Corp', 'admin'),
('john@example.com', 'john_doe', 'John Doe', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq9w5KS', 'Tech Solutions', 'user');

-- Insert sample leads
INSERT INTO leads (name, email, phone, company, status, source, value, owner_id) VALUES
('Alice Johnson', 'alice@company.com', '+1234567890', 'ABC Corp', 'new', 'website', 5000.00, 1),
('Bob Smith', 'bob@startup.com', '+1234567891', 'Startup Inc', 'contacted', 'referral', 3000.00, 1),
('Carol Brown', 'carol@enterprise.com', '+1234567892', 'Enterprise Ltd', 'qualified', 'social', 10000.00, 1),
('David Wilson', 'david@business.com', '+1234567893', 'Business Co', 'converted', 'email', 7500.00, 1);

-- Insert sample notifications
INSERT INTO notifications (title, message, type, user_id) VALUES
('Welcome!', 'Welcome to Marketing Dashboard. Start by adding your first lead.', 'info', 1),
('New Lead', 'You have a new lead from your website contact form.', 'success', 1),
('Campaign Update', 'Your summer campaign has reached 1000 impressions.', 'info', 1);

-- Insert sample campaigns
INSERT INTO campaigns (name, description, type, status, budget, spent, impressions, clicks, conversions) VALUES
('Summer Sale 2024', 'Promotional campaign for summer products', 'email', 'active', 5000.00, 2500.00, 10000, 500, 25),
('Product Launch', 'Launch campaign for new product line', 'social', 'active', 8000.00, 4000.00, 15000, 750, 40),
('Brand Awareness', 'General brand awareness campaign', 'ppc', 'paused', 3000.00, 1500.00, 8000, 200, 10);