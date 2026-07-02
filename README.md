# CoffeeBlog

CoffeeBlog is a full-stack blog application built with Node.js, Express, MongoDB, and EJS. It gives users a cozy coffee-themed space to sign up, log in, publish blogs with images, browse posts, manage their own writing, download blog content as PDF, and support the project through Stripe donations.

## Features

- Coffee-themed home page with featured sections for stories, coding notes, and coffee-inspired posts.
- User authentication with sign up, login, logout, and session persistence.
- Password hashing with bcrypt.
- Gmail-only email validation for login and sign up.
- Form validation with inline error messages using express-validator.
- Password reset flow with secure reset tokens and email delivery through Resend.
- Welcome email sent after successful registration.
- Protected routes for authenticated users.
- CSRF protection for forms and AJAX delete requests.
- MongoDB-backed sessions using connect-mongo.
- Blog listing page with pagination.
- Full blog detail page with title, author, email, creation date, image, and content.
- Create blog posts with title, content, author, card theme, and image upload.
- Edit existing blog posts.
- Delete blogs asynchronously from the "My Blogs" page.
- Owner-only authorization for editing and deleting blogs.
- Personal "My Blogs" dashboard for managing the logged-in user's posts.
- Image upload support with multer.
- Image type filtering for PNG, JPG, and JPEG files.
- Coffee card themes: Espresso, Mocha, and Latte.
- PDF download route for blog content using PDFKit.
- Stripe Checkout donation flow.
- Minimum donation validation of INR 50.
- Payment success and cancel pages.
- Custom 404 and 500 error pages.
- EJS partials for shared navbar, footer, and pagination.
- Static asset serving for CSS, JavaScript, and uploaded images.

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- EJS
- express-session
- connect-mongo
- csrf-csrf
- bcrypt
- express-validator
- multer
- PDFKit
- Stripe
- Resend
- connect-flash
- nodemon

## Project Structure

```text
NoteMaker/
|-- app.js
|-- controllers/
|   |-- authController.js
|   |-- blogController.js
|   `-- paymentController.js
|-- models/
|   |-- blog.models.js
|   `-- user.models.js
|-- routes/
|   |-- auth.routes.js
|   |-- blog.routes.js
|   `-- payment.routes.js
|-- utils/
|   |-- email.js
|   |-- is-auth.js
|   `-- reset-pass.js
|-- validators/
|   |-- auth.validate.js
|   `-- blog.validate.js
|-- views/
|   |-- auth/
|   |-- error/
|   |-- includes/
|   |-- notes/
|   `-- payment/
|-- public/
|   |-- js/
|   |-- main.css
|   `-- reset.css
|-- images/
|-- data/
|-- package.json
`-- README.md
```

## Getting Started

### Prerequisites

Install the following before running the project:

- Node.js
- npm
- MongoDB database, local or hosted
- Stripe account for payments
- Resend API key for emails

### Installation

1. Clone the repository or open the project folder.

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
CSRF_SECRET=your_csrf_secret
RESEND_API_KEY=your_resend_api_key
STRIPE_SECRET=your_stripe_secret_key
```

4. Start the application:

```bash
npm start
```

5. Open the app in your browser:

```text
http://localhost:3000
```

## Available Routes

### Blog Routes

| Method | Route | Description | Auth Required |
| --- | --- | --- | --- |
| GET | `/` | Home page | No |
| GET | `/blogs` | Paginated blog listing | Yes |
| GET | `/blogs/:blogId` | Full blog detail page | No |
| GET | `/myblogs` | Logged-in user's blogs | Yes |
| GET | `/add-blog` | Create blog page | Yes |
| POST | `/add-blog` | Save a new blog | Yes |
| GET | `/edit-blog/:blogId` | Edit blog page | Yes |
| POST | `/edit-blog/:blogId` | Update a blog | Yes |
| DELETE | `/delete-blog/:blogId` | Delete a blog | Yes |
| GET | `/download/:blogId` | Download blog PDF | Yes |

### Auth Routes

| Method | Route | Description |
| --- | --- | --- |
| GET | `/login` | Login page |
| POST | `/login` | Log in user |
| GET | `/signup` | Sign up page |
| POST | `/signup` | Create account |
| POST | `/logout` | Log out user |
| GET | `/reset` | Password reset request page |
| POST | `/reset` | Send password reset email |
| GET | `/reset/:token` | New password page |
| POST | `/new-password` | Save new password |

### Payment Routes

| Method | Route | Description |
| --- | --- | --- |
| GET | `/checkout` | Donation page |
| POST | `/create-checkout-session` | Create Stripe checkout session |
| GET | `/success` | Payment success page |
| GET | `/cancel` | Payment cancel page |

## Blog Model

Each blog stores:

- `title`
- `content`
- `imageUrl`
- `color`, one of `ESPRESSO`, `MOCHA`, or `LATTE`
- `author`
- `userId`
- `createdAt` and `updatedAt`

## User Model

Each user stores:

- `name`
- `email`
- `password`
- `resetToken`
- `resetTokenExpiration`

## Notes

- Uploaded blog images are stored in the `images/` folder.
- Sessions are stored in MongoDB in a `sessions` collection.
- Blog pagination currently displays 3 posts per page.
- The app accepts uploaded images only when the MIME type is `image/png`, `image/jpg`, or `image/jpeg`.
- Stripe donations use INR and require a minimum amount of 50.
- Email features require a valid Resend API key.

## Scripts

```bash
npm start
```

Runs the app with nodemon.

```bash
npm test
```

Currently prints the default placeholder test message.
