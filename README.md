# Little Lives File Monitoring Service

Design a File Monitoring Service

## Description

Design a comprehensive file monitoring service that empowers users to seamlessly upload files to Amazon S3 while enforcing limited quotas per user. This service continuously monitors users' file uploads, verifies their quota usage, and prevents uploads exceeding their allocated quota. Robust authentication and authorization layers are implemented using JWT, Guards, and Middleware to ensure secure operations. Employ `class-validator` for data validation, limiting file size and type.

An admin user with privileged access can adjust user quotas, providing flexibility and control.

Additionally, integrate Swagger API documentation for a user-friendly and interactive API exploration experience. Swagger Documentation URL: <http://localhost:3000/swagger>

**Deployment Information:**

I've deployed the service on Railway for easy remote access and testing. You can explore and interact with the API through Swagger at the following URL:

Railway URL: [https://littlelives-hgb.up.railway.app/swagger](https://littlelives-hgb.up.railway.app/swagger)

## Technology and Frameworks Used

### NestJS

NestJS is a progressive Node.js framework designed for building efficient, scalable, and enterprise-grade server-side applications using TypeScript/JavaScript. 🚀

Learn more: [NestJS GitHub](https://github.com/nestjs/nest)

### Prisma

Prisma is a next-generation Node.js and TypeScript ORM, providing a powerful and intuitive interface for working with databases.

Learn more: [Prisma Documentation](https://www.prisma.io/)

### PostgreSQL

Utilize PostgreSQL, running seamlessly with Docker, to store and manage data efficiently.

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

## Setup and Run Locally

Follow these steps to set up and run the Little Lives File Monitoring Service locally on your machine.

### Prerequisites

- Node.js 18+ installed on your system.
- Yarn package manager installed.

### Create an S3 Bucket

Create an S3 bucket with public ACL settings. Ensure that you have the necessary credentials and access rights.

### Configure Environment Variables

Create a `.env` file at the root of your project and fill in the following information:

```env
DATABASE_URL=postgresql://postgres:abc123@localhost:5432/littlelives-test?schema=public
AWS_BUCKET_NAME=your-s3-bucket-name
AWS_ACCESS_ID=your-aws-access-id
AWS_SECRET_KEY=your-aws-secret-key
```

Replace placeholders (`your-s3-bucket-name`, `your-aws-access-id`, and `your-aws-secret-key`) with your actual S3 bucket details and AWS credentials.

### Install Dependencies

Run the following command to install project dependencies:

```bash
yarn
```

### Generate Schema and Sync Database

Use the following command to generate the Prisma schema and sync the database:

```bash
yarn db
```

### Run in Development Mode

Start the development server with the following command:

```bash
yarn dev
```

The admin account after run init is `admin` / `admin`

Your Little Lives File Monitoring Service should now be running locally. Access Swagger API documentation at [http://localhost:3000/swagger](http://localhost:3000/swagger) to explore and test the API endpoints.
