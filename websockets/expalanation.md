# Understanding Socket.io: Events, Listeners, and Broadcasting

This guide explains how events flow between the client and the server in a Socket.io application, focusing on `socket.on`, `socket.emit`, and `io.emit`.

---

## 1. `.on()` vs `.emit()`
In Socket.io, communication is bidirectional (two-way). Both the client and the server can send and receive messages:
* **`.on(event, callback)`** is used to **listen for (receive)** an event.
* **`.emit(event, data)`** is used to **trigger (send)** an event.

Here is how they connect across the server and the client:

| Location | Code | Meaning |
| :--- | :--- | :--- |
| **Client** ([index.html](file:///d:/Nodejs/websockets/public/index.html)) | `socket.emit('message', data)` | **Sends** a message to the server. |
| **Server** ([index.js](file:///d:/Nodejs/websockets/index.js)) | `socket.on('message', (data) => { ... })` | **Receives** the message from that client. |
| | | |
| **Server** ([index.js](file:///d:/Nodejs/websockets/index.js)) | `io.emit('message', data)` | **Sends/Broadcasts** the message to all clients. |
| **Client** ([index.html](file:///d:/Nodejs/websockets/public/index.html)) | `socket.on('message', (data) => { ... })` | **Receives** the broadcasted message from the server. |

---

## 2. Server-side Broadcasting Methods
On the server side (`index.js`), you have different ways to send (`emit`) messages depending on who needs to receive them:

### 1. `io.emit('message', msg)`
* **Target:** **All** connected clients (including the sender).
* **Use Case:** Chat applications. When a user sends a message, everyone in the chat room needs to see it.
* **Example:**
  ```javascript
  io.emit('message', msg); // Broadcast to everyone
  ```

### 2. `socket.emit('message', msg)`
* **Target:** **Only** the specific client who initiated the event (a 1-to-1 reply).
* **Use Case:** Private confirmation, error messages, or initial configuration.
* **Example:**
  ```javascript
  socket.emit('message', 'Welcome to the chat!'); // Only the connected user sees this
  ```

### 3. `socket.broadcast.emit('message', msg)`
* **Target:** **Everyone except** the sender.
* **Use Case:** Notifications like "User X has joined the chat" or "User Y is typing..."
* **Example:**
  ```javascript
  socket.broadcast.emit('message', 'A new user has joined the chat');
  ```

---

## 3. What are Namespaces?
A **Namespace** in Socket.io is a communication channel that allows you to split the logic of your application over a single shared connection (this is called *multiplexing*). 

By default, every client connects to the **default namespace** (`/`). 

### Why use Namespaces?
Instead of creating multiple server ports or separate WebSocket connections, you can use namespaces to separate different parts of your application (e.g., separating normal chat features from admin panels or notification panels).

### Example: `/admin` vs Default `/`
#### Server-side Setup (`index.js`):
```javascript
// 1. Default namespace (/)
io.on('connection', (socket) => {
    console.log('User connected to default namespace');
});

// 2. Custom admin namespace (/admin)
const adminNamespace = io.of('/admin');
adminNamespace.on('connection', (socket) => {
    console.log('Admin connected to /admin namespace');
    
    socket.on('announcement', (data) => {
        adminNamespace.emit('announcement', data); // Broadcasts only to admin clients
    });
});
```

#### Client-side Setup (`index.html`):
```javascript
// Connect to the default namespace (/)
const socket = io(); 

// Connect to the admin namespace (/admin)
const adminSocket = io('/admin'); 

adminSocket.on('announcement', (data) => {
    console.log('Received admin announcement:', data);
});
```

---

## 4. Namespaces vs Rooms
It is easy to confuse **Namespaces** and **Rooms**. Here is how they compare:

| Feature | Namespaces | Rooms |
| :--- | :--- | :--- |
| **What is it?** | A completely separate communication channel. | A sub-channel/group *within* a namespace. |
| **Connection** | The client must explicitly connect to it (e.g., `io('/admin')`). | The client connects normally; the server puts them into a room. |
| **Control** | Controlled by both Client and Server. | Controlled entirely by the Server (`socket.join('room')`). |
| **Use Case** | Separating Admin portals from regular Users. | Creating individual chat rooms, game lobbies, or threads. |

## 5. Rooms

Rooms are sub-channels/groups within a namespace.

Unlike namespaces, rooms are managed entirely on the server side. The client does not know about rooms directly and cannot connect to them directly; instead, the client connects to a namespace, and the server places the client into a room.

The Hotel Analogy
To understand the difference:

The Server is a large hotel.
Namespaces are different wings or floors of the hotel (e.g., the Guest Wing vs. the Staff Wing). You need a specific keycard (authentication) to even get onto the Staff Wing.
Rooms are the actual rooms on that floor (e.g., Room 101, Room 102). If you are inside Room 101 and speak, only the people inside Room 101 hear you, not the whole floor.
Real-Life Examples of Rooms
WhatsApp Groups / Discord Channels:

All users are in the same general namespace (/chat), but when you open a specific group chat, the server puts you in a room designated for that group (e.g., room-family-chat).
When someone posts a message, it is only sent to the users in room-family-chat.
Multiplayer Lobbies:

In a chess game, once you get paired with an opponent, the server puts both of you into a private room (e.g., game-98324). The moves you make are only sent to the opponent in that room.
How to use Rooms (Code Example)
1. Server-Side (

index.js
)
javascript
io.on('connection', (socket) => {
    // 1. Join a Room
    socket.on('join-room', (roomName) => {
        socket.join(roomName); // Server puts this specific socket/user into the room
        console.log(`User joined room: ${roomName}`);
    });
    // 2. Send message to a specific Room
    socket.on('message-to-room', (data) => {
        const { roomName, msg } = data;
        
        // Sends to everyone in 'roomName'
        io.to(roomName).emit('new-room-message', msg); 
        
        // OR: Sends to everyone in 'roomName' EXCEPT the sender
        // socket.to(roomName).emit('new-room-message', msg);
    });
    // 3. Leave a Room
    socket.on('leave-room', (roomName) => {
        socket.leave(roomName); // Server removes the user from the room
    });
});
2. Client-Side (

index.html
)
javascript
const socket = io();
// Ask the server to put us in 'room1'
socket.emit('join-room', 'room1');
// Send a message to 'room1'
socket.emit('message-to-room', {
    roomName: 'room1',
    msg: 'Hello everyone in room 1!'
});
// Receive messages sent only to this room
socket.on('new-room-message', (msg) => {
    console.log("Room message received: ", msg);
});

---

## 6. Authentication and Middlewares
In Socket.io, you can protect WebSocket connections using **Middleware**, which behaves very similarly to Express middleware. It runs once during the **handshake phase** (when the client first attempts to connect to the server). If authentication fails, the connection is rejected.

### Step 1: Client sends credentials
When connecting from the client, pass credentials (like a JWT token, session ID, or API key) using the **`auth`** option:
```javascript
const socket = io({
    auth: {
        token: "your-jwt-auth-token-here" // Sent securely during connection handshake
    }
});
```

### Step 2: Server-side Middleware checks credentials
On the server side, use **`io.use()`** to intercept the connection. You can access the token via **`socket.handshake.auth`**:
```javascript
// Register a middleware
io.use((socket, next) => {
    // 1. Get the token from client handshake
    const token = socket.handshake.auth.token;

    // 2. Validate the token (e.g., verifying a JWT)
    if (token === "your-jwt-auth-token-here") {
        // Save user details on the socket object for future use in event handlers
        socket.user = { id: 101, username: "JohnDoe", role: "user" }; 
        next(); // Authorization succeeded, allow connection!
    } else {
        // Authorization failed, reject connection
        const err = new Error("Authentication failed: Invalid token");
        err.data = { content: "Please log in first." }; 
        next(err); 
    }
});

// If the middleware calls next(), this block will run
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.username}`);
    
    socket.on('message', (msg) => {
        // You have access to socket.user here!
        console.log(`Message from ${socket.user.username}: ${msg}`);
    });
});
```

### Step 3: Client handles authentication failure
If the server rejects the connection in the middleware, the client can listen to the **`connect_error`** event to handle it:
```javascript
socket.on("connect_error", (err) => {
    console.error(err.message); // prints "Authentication failed: Invalid token"
    console.error(err.data.content); // prints "Please log in first."
});
```

### Namespace Middleware
You can also apply middlewares specifically to a namespace (e.g., restricting access to `/admin`):
```javascript
const adminNamespace = io.of('/admin');

// This middleware runs ONLY when clients connect to '/admin'
adminNamespace.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    // Check if user is admin
    if (token === "admin-secret-token") {
        next();
    } else {
        next(new Error("Forbidden: Not an admin"));
    }
});
```

---

## 7. Modular MVC Pattern for WebSocket Authentication
To keep your project clean, scalable, and easy to test, you can separate the authentication logic into **Services** and **Middlewares**.

### Folder Structure
```text
websockets/
├── index.js
├── middlewares/
│   └── socketAuth.js      # Socket.io Middleware wrapper
└── services/
    └── authService.js     # Pure business logic (validating tokens/DB)
```

### 1. The Service (`services/authService.js`)
Handles checking credentials, tokens, or queries against a database.
```javascript
const jwt = require('jsonwebtoken');

function verifyUserToken(token) {
    try {
        if (!token) return null;
        
        // Verifies the token using a secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        return decoded; // Returns decoded user object { id: 101, username: 'JohnDoe' }
    } catch (err) {
        return null; // Token is invalid/expired
    }
}

module.exports = { verifyUserToken };
```

### 2. The Middleware (`middlewares/socketAuth.js`)
Extracts parameters from the Socket.io handshake and interacts with the service.
```javascript
const { verifyUserToken } = require('../services/authService');

function socketAuth(socket, next) {
    const token = socket.handshake.auth.token;

    // Check if token exists
    if (!token) {
        return next(new Error("Authentication failed: No token provided"));
    }

    // Call service to verify token
    const user = verifyUserToken(token);

    if (!user) {
        return next(new Error("Authentication failed: Invalid token"));
    }

    // Attach user data directly to socket connection
    socket.user = user; 
    next(); 
}

module.exports = socketAuth;
```

### 3. Usage in Server (`index.js`)
```javascript
const express = require("express");
const http = require('http');
const { Server } = require('socket.io');
const socketAuth = require('./middlewares/socketAuth'); // Import middleware

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Apply middleware
io.use(socketAuth); 

io.on('connection', (socket) => {
    // Easily access the attached user object
    console.log(`User ${socket.user.username} connected.`);

    socket.on('message', (msg) => {
        console.log(`Message from ${socket.user.username}: ${msg}`);
    });
});
```
