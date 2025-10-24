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

### 3. Create a Zustand & @nestjs/config authentication workflow for Auth

- All steps from `npm i zustand` to `app.enableCors()` must be covered in React & Nest.
- Secret storage, localStorage spectatorship must be demonstrated in the docs.

---

## Frontend

---

### 1. Configure \<PublicRoute/> component

- Currently we have installed the Protected Route component, but after testing we'll need to protect the public routes from logged in users.
- We'll be implementing it the same way, where if the user is LOGGED IN then we redirect them to the protected pages eg. profile.

### 2. Initialize \<Spinner/> component

- Currently Spinner.tsx is absent. Simply initialize it for smooth waiting durations.

### 3. Pagination component

- Demonstration of Pagination would allow a better presentation of the project as well as easier retrieval of progress reports, meditation logs, etc.

### 4. Proper pages for NotFound.tsx and Error.tsx

- Properly design the frontend for NotFound.tsx & Error.tsx so we have a professional looking Aspirely.

---

## Backend

---

### 1. Creation of DTOs for each module

- DTOs are missing for the following modules:
    i) Fitness
    ii) Progress
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

### 4. Validating unique constraints like 'email already registered' or 'username already taken'

- Currently, no such feature for the above function is in place. Therefore, an implementation is must.
- We can create a seperate function to act as a validator or any other desired methodlogy. This part comes under the finishing touches of Aspirely.

### 5. Build public guards

- Currently, an authenticated user can also send a request to a public route like `/auth/login` or `/auth/forgot-email`.
- We protect the routes using a new guard `@UseGuards(..., PublicGuard)`

### 6. Implement Nodemailer for OTP-Sign Up, Forgot-Pass and Forgot-Username & Implement them

- No mails being sent right now. We'll be sending the main to `user.email`.
- Token verification and real-time handling missing. We'll be doing that as polishing.

---
