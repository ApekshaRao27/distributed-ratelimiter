
# 🚀 Distributed Rate Limiter using Node.js, Express and Redis

This project implements **two real-world rate limiting algorithms** using Redis and Express.js.  
It also supports **distributed rate limiting**, meaning the same limit works across multiple server instances.

## 📌 Features

- Sliding Window Rate Limiter
- Token Bucket Rate Limiter
- User-based rate limiting (using `user-id` header)
- Redis used as shared storage
- Supports multiple server instances (simulates load balancer environment)
- Separate middleware for each algorithm
- Easy testing using Postman

## 🧠 Rate Limiting Algorithms Implemented

### 1️⃣ Sliding Window Algorithm
- Stores request timestamps in Redis
- Removes expired timestamps on every request
- Blocks request if limit exceeded

### 2️⃣ Token Bucket Algorithm
- Each user has a bucket with fixed tokens
- Tokens refill gradually over time
- Allows burst traffic but blocks excessive requests

## 🏗️ Project Structure

ratelimiter/
│
├── middlewares/
│   ├── slidingWindowLimiter.js
│   └── tokenBucketLimiter.js
│
├── redisClient.js
├── server.js
├── package.json
└── README.md


## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/rate-limiter-project.git
cd rate-limiter-project
````

### 2. Install dependencies

```bash
npm install
```

### 3. Start Redis server

Make sure Redis is running locally.

```bash
redis-server
```

### 4. Run the server

```bash
node server.js
```

Server will run on:

```
http://localhost:3000
```

---

## 🧪 API Endpoints

### 🔹 Sliding Window Rate Limiter

```
GET /api/slidingwindow
```

Add header in Postman:

```
user-id: 101
```

---

### 🔹 Token Bucket Rate Limiter

```
GET /api/token-bucket
```

Add header:

```
user-id: 101
```

---

## 🔥 Distributed Rate Limiting (Multi-Server Test)

You can run multiple servers:

```bash
PORT=3000 node server.js
PORT=3001 node server.js
PORT=3002 node server.js
```

Even if requests go to different ports, the rate limit will still work because Redis is shared.

---

## 🧠 Technologies Used

* Node.js
* Express.js
* Redis
* ioredis
* Postman (for testing)
