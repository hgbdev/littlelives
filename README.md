# Little Lives File Monitoring Service

Design an Advanced File Monitoring Service

## Technology and Frameworks Used

### NestJS

NestJS is a progressive Node.js framework designed for building efficient, scalable, and enterprise-grade server-side applications using TypeScript/JavaScript. 🚀

Learn more: [NestJS GitHub](https://github.com/nestjs/nest)

### Prisma

Prisma is a next-generation Node.js and TypeScript ORM, providing a powerful and intuitive interface for working with databases.

Learn more: [Prisma Documentation](https://www.prisma.io/)

### PostgreSQL

Utilize PostgreSQL, running seamlessly with Docker, to store and manage data efficiently.

## Description

Design a comprehensive file monitoring service that empowers users to seamlessly upload files to Amazon S3 while enforcing limited quotas per user. This service continuously monitors users' file uploads, verifies their quota usage, and prevents uploads exceeding their allocated quota. Robust authentication and authorization layers are implemented using JWT, Guards, and Middleware to ensure secure operations. Employ `class-validator` for data validation, limiting file size and type.

An admin user with privileged access can adjust user quotas, providing flexibility and control.

Additionally, integrate Swagger API documentation for a user-friendly and interactive API exploration experience. Swagger Documentation URL: http://localhost:3000/swagger

## API Endpoints

### User

- **GET /user/init-admin**
  - Description: Initialize an admin user, setting up necessary configurations.

- **POST /user/login**
  - Description: Authenticate and generate JWT tokens for user access.

- **POST /user/register**
  - Description: Register a new user with essential details.

- **GET /user/me**
  - Description: Retrieve user profile information.

- **POST /user/change-password**
  - Description: Change the user's password securely.

- **POST /user/set-quota**
  - Description: Set or modify the file upload quota for a user.

### File

- **POST /file/upload**
  - Description: Upload a file to Amazon S3, adhering to specified constraints.

- **GET /file/list**
  - Description: Retrieve a list of uploaded files, displaying relevant details.

- **GET /file/{filename}**
  - Description: Retrieve information about a specific file identified by its filename.

- **DELETE /file/{filename}**
  - Description: Delete a specific file identified by its filename.