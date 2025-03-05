# UptimePulse - Backend Documentation

## Overview
UptimePulse is a service that monitors the availability of websites by periodically sending HTTP requests and logging their uptime.

---

## **1. Project Setup**
### **1.1 Installation**
```sh
# Initialize project
npm init -y

# Install dependencies
npm install express pg node-cron dotenv axios cors
```

To run this application:

```
npm start
```


### **1.2 Project Structure**
```
/uptimepulse-backend
│── server.js
│── config/
│   ├── db.js
│── routes/
│   ├── monitorRoutes.js
│── controllers/
│   ├── monitorController.js
│── models/
│   ├── monitorModel.js
│── utils/
│   ├── uptimeChecker.js
│── .env
│── package.json
```

---

## **2. Database Schema (PostgreSQL)**
### **2.1 Monitors Table**
```sql
CREATE TABLE monitors (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    interval INTEGER DEFAULT 5, -- Check every X minutes
    last_status INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **2.2 Logs Table**
```sql
CREATE TABLE logs (
    id SERIAL PRIMARY KEY,
    monitor_id INTEGER REFERENCES monitors(id) ON DELETE CASCADE,
    status_code INTEGER,
    response_time INTEGER,
    checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## **3. API Endpoints**
### **3.1 Add a Monitor**
`POST /monitor`
#### Request Body:
```json
{
  "url": "https://example.com",
  "interval": 5
}
```
#### Response:
```json
{
  "message": "Monitor added successfully",
  "monitor": { "id": 1, "url": "https://example.com", "interval": 5 }
}
```

### **3.2 Get All Monitors**
`GET /monitors`
#### Response:
```json
[
  { "id": 1, "url": "https://example.com", "interval": 5, "last_status": 200 }
]
```

### **3.3 Delete a Monitor**
`DELETE /monitor/:id`
#### Response:
```json
{
  "message": "Monitor deleted successfully"
}
```

---

## **4. Uptime Monitoring Logic**
- A `node-cron` job runs every X minutes (as per the monitor settings).
- It sends an HTTP GET request using `axios`.
- Logs response status and time in the `logs` table.
- If the site is down, retries the check and sends an alert if still down.

---

## **5. Deployment (Render.com)**
1. Push your code to GitHub.
2. Create a new Web Service on Render.com.
3. Connect your GitHub repository.
4. Add environment variables:
   - `DATABASE_URL` (PostgreSQL connection string)
   - `PORT=5000`
5. Deploy and test using Postman or frontend.

---

## **6. Future Enhancements**
- User authentication (optional).
- Webhooks for real-time notifications.
- Dashboard UI to display uptime statistics.

---

This document serves as a guide to setting up and running the UptimePulse backend. 🚀

