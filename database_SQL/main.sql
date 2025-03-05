-- Create Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create Monitors Table
CREATE TABLE monitors (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users (id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (
        type IN (
            'HTTP',
            'HTTPS',
            'TCP',
            'Ping'
        )
    ),
    interval INTEGER DEFAULT 5,
    status VARCHAR(20) DEFAULT 'active' CHECK (
        status IN ('active', 'paused', 'deleted')
    ),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create Monitor Logs Table
CREATE TABLE monitor_logs (
    id SERIAL PRIMARY KEY,
    monitor_id INTEGER REFERENCES monitors (id) ON DELETE CASCADE,
    status_code INTEGER NOT NULL,
    response_time INTEGER NOT NULL,
    checked_at TIMESTAMP DEFAULT NOW()
);

-- Create Alerts Table
CREATE TABLE alerts (
    id SERIAL PRIMARY KEY,
    monitor_id INTEGER REFERENCES monitors (id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users (id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (
        type IN ('Email', 'SMS', 'Webhook')
    ),
    status VARCHAR(20) DEFAULT 'pending' CHECK (
        status IN ('pending', 'sent', 'failed')
    ),
    sent_at TIMESTAMP
);

-- Create API Keys Table
CREATE TABLE api_keys (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users (id) ON DELETE CASCADE,
    key TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexing for Performance
CREATE INDEX idx_users_email ON users (email);

CREATE INDEX idx_monitors_url ON monitors (url);

CREATE INDEX idx_monitor_logs_status ON monitor_logs (status_code);