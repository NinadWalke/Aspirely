# Aspirely Development Backlog

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

---
