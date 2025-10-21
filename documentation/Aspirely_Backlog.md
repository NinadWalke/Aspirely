# Aspirely Development Backlog

---

## Documentation

---

### 1. Create Prisma Integration MD

- All steps from `npx prisma init` to `npx prisma studio` must be included in it.
- Prisma installation must also be accompanied by Postgres installation and server setup.

### 2. Create a JWT & @nestjs/passport authentication workflow MD

- All steps from `npm i xyz` to `async validate()...` must be covered in NestJS.
- Secret creation, .env config must also be included `[dotenv -cli]`.

---

## Frontend

---

### 1. Create React Routes

- Implement react-router-dom under `main.jsx`
- Stage all member files for required pages
- Stage `apiConfig.js` by abstracting `axios`

### 2. Configure CORS

- Configure cors based on the backend and frontend domains.

```markdown
http://localhost:3000  --> backend
http://localhost:5173  --> frontend
```

### 3. Validate and stage LocalStorage for JWT configuration and easy retrieval

- Configure localStorage at `/login` route for ease of JWT storage.
- Syntax:

```javascript
localStorage.setItem('Authorization',  `Bearer ${token}`);
localStorage.getItem('Authorization');
```

---

## Backend

---

### 1. Creation of DTOs for each module

- DTOs are missing for the following modules:
    i) Fitness
    ii) Meditation
    iii) Notes
    iv) Progress
- Updates to the following DTOs:
    i) Auth [Signup and Login]
    ii) Tasks [Just a temporary DTO]

### 2. Implementation of Social Module [Redis and Socket.io]

- Module, controller and services creation

```bash
nest g module social
nest g controller social --no-spec
nest g service social --no-spec
```

### 3. Adding a 'IsOwner' guard to every Controller

- Currently, all the controllers are committing to requests just on the basis of Authentication.
- There is a possibility of another user, logged in, making requests to another users data. We can block that by

```javascript
...(@GetUser() id: User) {
    if(id == task.user.id || progress.user.id) // do operations
    else return {statusCode: 401, message: "Unauthorized"};
} 
```

---
