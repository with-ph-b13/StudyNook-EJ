# StudyNook — Full-Stack Library Study Room Booking Platform 📚✨

Welcome to **StudyNook**, a premium full-stack monorepo application designed to help students, researchers, and library users browse, search, and book private study nooks and cabins inside academic libraries. 

The platform features secure token-based JWT authentication stored in HTTP-Only cookies, advanced multi-tier search filters, and a robust time-conflict mathematical detection system that guarantees no overlapping bookings.

---

## 📁 Repository Structure

This workspace is set up as a monorepo containing both the client application and the backend API server:

*   **`studynook-client/`**: React 19 SPA powered by Vite and Tailwind CSS v4.
*   **`studynook-server/`**: Node.js/Express REST API server backed by MongoDB Atlas.

---

## 🌟 Key Features

-   **Secure JWT HTTP-Only Cookie Authentication**: Protects user sessions by storing the authentication token in a secure, HTTP-only cookie, completely preventing XSS-based token theft and keeping users logged in on route reload.
-   **Real-Time Booking Conflict Prevention**: Employs backend mathematical validation (`RequestedStart < BookedEnd` and `RequestedEnd > BookedStart`) to guarantee no overlapping reservations on the same calendar date.
-   **Comprehensive Search & Multi-Tier Filtering**: Users can query study rooms dynamically using text search, floor selections, hourly pricing sliders, and checkboxes for specific amenities.
-   **Interactive Owner Room Management (CRUD)**: Authorized owners can create, update, and cascade-delete study cabins. Deletion automatically cleanses related bookings and references.
-   **Modern Glassmorphic Dark/Light Mode Theme**: A premium visual interface styled with custom-tailored HSL colors, responsive hamburger layouts, and persistent local storage theme settings.
-   **Interactive Micro-Animations & Custom Toasts**: Polished user experience powered by `framer-motion` transitions, `lucide-react` icons, and custom-designed `react-hot-toast` notifications.

---

## 🛠️ Technology Stack

### Frontend (`studynook-client`)
*   **Core**: Vite + React 19 + JavaScript (ES6+)
*   **Styling**: Tailwind CSS v4 + Vanilla CSS + Google Fonts (Outfit & Inter)
*   **Routing**: React Router DOM (with auth-preserving private route guards)
*   **Transitions**: Framer Motion
*   **Alerts**: React Hot Toast (custom HSL-styled layout)
*   **Networking**: Axios (with default dynamic credential propagation)

### Backend (`studynook-server`)
*   **Framework**: Node.js & Express.js
*   **Database**: MongoDB Atlas with Mongoose ORM
*   **Security & Auth**: JSON Web Tokens (JWT), Cookie Parser, Bcrypt.js (Password hashing)
*   **Utilities**: Cors (Cross-Origin Resource Sharing)

---

## 🚀 Local Development Setup

To get the application running locally on your computer, follow these steps:

### Prerequisite
Ensure you have [Node.js](https://nodejs.org/) and [pnpm](https://pnpm.io/) installed.

### 1. Clone & Install Dependencies
First, clone the repository and run `pnpm install` in both subdirectories:

```bash
# Install client dependencies
cd studynook-client
pnpm install

# Install server dependencies
cd ../studynook-server
pnpm install
```

### 2. Configure Environment Variables

#### Backend Configuration
Create a `.env` file in the `studynook-server/` directory:
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_uri
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

#### Frontend Configuration
Create a `.env` file in the `studynook-client/` directory (optional - defaults to API on port 3000):
```env
VITE_API_URL=http://localhost:3000/api
```

### 3. Run the Application

#### Start the Backend Server:
```bash
cd studynook-server
pnpm run dev
```
The server will boot up on [http://localhost:3000](http://localhost:3000).

#### Start the Client Dev Server:
```bash
cd studynook-client
pnpm run dev
```
The client dashboard will be available at [http://localhost:5173](http://localhost:5173).

---

## 📝 Authors & License

Designed and developed by Antigravity under CAT_12 guidelines. Standard Academic Project License.
