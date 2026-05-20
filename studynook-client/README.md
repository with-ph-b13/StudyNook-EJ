# StudyNook – Library Study Room Booking Platform 📚✨

StudyNook is a fully responsive, state-of-the-art full-stack web application that allows students, researchers, and library users to browse, search, and book private study nooks and cabins inside academic libraries. The platform features secure token-based JWT authentication stored in HTTP-Only cookies, advanced search options (amenities checkboxes, floor filters, hourly rate ranges), and a robust time-conflict mathematical detection system that guarantees no two bookings overlap.

**Live Demo URL**: [https://studynook-client.vercel.app](https://studynook-client.vercel.app)

---

## 🌟 Key Features

- **Secure JWT HTTP-Only Cookie Authentication**: Protects user sessions by storing the authentication token in a secure, HTTP-only cookie, completely preventing XSS-based token theft and keeping users logged in on route reload.
- **Real-Time Booking Conflict Prevention**: Employs backend mathematical validation (`RequestedStart < BookedEnd` AND `RequestedEnd > BookedStart`) to guarantee no overlapping reservations on the same calendar date.
- **Comprehensive Search & Multi-Tier Filtering**: Users can query study rooms dynamically using text search, floor selections, hourly pricing sliders, and checkboxes for specific amenities.
- **Interactive Owner Room Management (CRUD)**: Authorized owners can create, update, and cascade-delete study cabins. Deletion automatically cleanses related bookings and references.
- **Modern Glassmorphic Dark/Light Mode Theme**: A premium visual interface styled with custom-tailored HSL colors, responsive hamburger layouts, and persistent local storage theme settings.
- **Interactive Micro-Animations & Custom Toasts**: Polished user experience powered by `framer-motion` transitions, `lucide-react` icons, and custom-designed `react-hot-toast` notifications.

---

## 🛠️ Technology Stack

- **Core**: Vite + React 19 + JavaScript (ES6+)
- **Styling**: Tailwind CSS v4 + Vanilla HSL Tokens + Google Fonts (Outfit & Inter)
- **Routing**: React Router DOM (with auth-preserving private route guards)
- **Transitions**: Framer Motion
- **Alerts**: React Hot Toast (custom HSL-styled layout)
- **Networking**: Axios (with default dynamic credential propagation)

---

## 🚀 Local Development Setup

To run the StudyNook client locally, execute the following commands:

### 1. Clone the repository and install dependencies
```bash
# Navigate to the client directory
cd studynook-client

# Install dependencies using pnpm
pnpm install
```

### 2. Configure Environment Variables
Create a `.env` file in the client root if you want to override the backend API path:
```env
VITE_API_URL=http://localhost:5001/api
```

### 3. Start the Vite development server
```bash
# Launch server
pnpm dev
```
The client dashboard will be available at [http://localhost:5173](http://localhost:5173).

---

## 📝 Authors & License

Designed and developed by Antigravity under CAT_12 guidelines. Standard Academic Project License.
