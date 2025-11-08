# WTWR (What to Wear?) — Back End

Minimal REST API built with **Node.js/Express** and **MongoDB/Mongoose** for the WTWR app.
Implements users and clothing items, including like/unlike logic.

> Note: For Sprint 12, a temporary auth middleware injects a fixed test user (`req.user._id`). Real auth comes next sprint.

---

## Tech Stack

- Node.js, Express
- MongoDB, Mongoose
- validator (URL validation)
- ESLint (Airbnb) + Prettier
- Nodemon (dev)
- Postman tests + GitHub Actions

---

## Run Locally

```bash
npm install
# start MongoDB locally, then:
npm run dev   # hot reload
# or
npm start

```
