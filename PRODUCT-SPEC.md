
# AI Vacation Planner - Product Specification Document

**Status:** 🟢 Active / Living Document  
**Last Updated:** 2026-03-16  
**Version:** 1.0.0  

> **Note:** This is a living document. It serves as the single source of truth for the AI Vacation Planner platform's product requirements, architecture, features, and design guidelines. It will be updated continuously as the platform evolves.

---

## Table of Contents
1. [Overview](#1-overview)
2. [Application Layout & Navigation](#2-application-layout--navigation)
3. [Pages & Routes](#3-pages--routes)
4. [Core Features & Functionalities](#4-core-features--functionalities)
5. [Integrations](#5-integrations)
6. [UI Components Inventory](#6-ui-components-inventory)
7. [User Flows](#7-user-flows)
8. [Data Models](#8-data-models)
9. [API Endpoints](#9-api-endpoints)
10. [Security Measures](#10-security-measures)
11. [Compliance Requirements](#11-compliance-requirements)
12. [Performance & Optimization](#12-performance--optimization)
13. [Best Practices](#13-best-practices)

---

## 1. Overview

### Brief Overview
The AI Vacation Planner is a comprehensive, intelligent SaaS platform designed to revolutionize how individuals, families, and groups plan, book, and experience travel. By leveraging advanced Generative AI, the platform automates the tedious aspects of trip planning—from itinerary generation and budget tracking to real-time booking and collaborative photo sharing.

### Target Users
*   **Solo Travelers:** Seeking optimized, safe, and personalized itineraries.
*   **Families:** Needing kid-friendly activities, shared itineraries, and collaborative photo albums.
*   **Group Travelers (Friends/Corporate):** Requiring expense splitting, voting mechanisms, and centralized communication.
*   **Travel Agents/Enterprise:** Utilizing white-label solutions, CRM integrations, and advanced RFP (Request for Proposal) management.

### Core Value Proposition
"Let AI handle the logistics while you focus on the experience." The platform reduces trip planning time from weeks to minutes, optimizes budgets, and provides a centralized hub for all travel-related documents, bookings, and memories.

### Product Goals
1.  **Automation:** Generate complete, bookable itineraries based on natural language prompts.
2.  **Collaboration:** Enable seamless group planning, voting, and expense splitting.
3.  **Monetization:** Drive revenue through tiered SaaS subscriptions, affiliate bookings, and marketplace sales.
4.  **Retention:** Keep users engaged post-trip with AI-generated photo albums, memory highlight reels, and community sharing.

---

## 2. Application Layout & Navigation

The application utilizes a responsive, modern SaaS layout designed for maximum usability across all device sizes.

### Top Navigation Bar (Global)
*   **Logo/Brand:** Clickable, routes to Dashboard (or Home if unauthenticated).
*   **Search Bar:** Global search for trips, destinations, users, and help articles.
*   **User Menu:** Dropdown containing Profile, Billing, Preferences, and Logout.
*   **Notifications:** Bell icon with unread badge, opening a popover for recent alerts.
*   **Settings:** Quick access to app preferences (Dark/Light mode, language, currency).

### Sidebar Navigation (Desktop)
*   **Dashboard:** Overview of upcoming trips, recent activity, and quick actions.
*   **Trips:** List of all active, past, and drafted trips.
*   **Bookings:** Centralized view of all flights, hotels, and activities.
*   **Budget:** Financial overview, expense tracking, and split-cost management.
*   **Photos:** AI-organized galleries, albums, and highlight reels.
*   **Community:** Social feed, marketplace, and public travel guides.
*   **Messages:** Direct messaging, group chats, and support tickets.
*   **Analytics:** Personal travel stats (countries visited, total spent, etc.).
*   **Settings:** Deep link to account configuration.

### Mobile Bottom Navigation (Mobile/PWA)
*   **Home:** Mobile dashboard and quick AI prompt access.
*   **Trips:** Active itinerary and timeline view.
*   **Bookings:** Wallet-style view of tickets and reservations.
*   **Messages:** Chat interface for groups and AI assistant.
*   **Profile:** User settings, budget summary, and photo access.

---

## 3. Pages & Routes

### Web Application Routes
*   **Public Routes:**
    *   `/` - Landing Page (Hero, Features, Testimonials, Pricing)
    *   `/login`, `/signup`, `/forgot-password` - Authentication flows
    *   `/pricing` - Subscription plans and feature comparison
    *   `/blog`, `/guides` - SEO content and travel resources
*   **Protected Routes (User):**
    *   `/dashboard` - Main user hub
    *   `/trips` - Trip list view
    *   `/trips/create` - AI prompt interface for new trips
    *   `/trips/:id` - Trip overview (Itinerary, Budget, Bookings tabs)
    *   `/trips/:id/itinerary` - Drag-and-drop timeline
    *   `/budget` - Global expense tracker
    *   `/photos` - Media gallery and AI albums
    *   `/community` - Social feed and marketplace
    *   `/settings/profile`, `/settings/billing` - Account management
*   **Protected Routes (Admin/Enterprise):**
    *   `/admin` - System overview and metrics
    *   `/admin/users` - User management and RBAC
    *   `/admin/content` - Knowledge base and blog CMS
    *   `/admin/integrations` - API key and webhook management

### Visual References: Dashboards & UI
![Futuristic dashboard UI 1](https://images.unsplash.com/photo-1639060015191-9d83063eab2a)
*Alt text: Futuristic dashboard UI showing AI itinerary generation and travel metrics.*

![Futuristic dashboard UI 2](https://images.unsplash.com/photo-1662345137094-15a72b6e792b)
*Alt text: Advanced SaaS dashboard displaying real-time booking data and user analytics.*

---

## 4. Core Features & Functionalities

### AI Assistant & Planning
*   **Conversational Trip Builder:** Users input natural language (e.g., "Plan a 5-day romantic trip to Paris under $3000"). AI parses intent, dates, budget, and style.
*   **Smart Itinerary Generation:** AI creates a day-by-day timeline, factoring in travel distances, opening hours, and logical sequencing.
*   **Real-Time Refinements:** Users can chat with the AI to swap activities ("Make day 3 less walking intensive").

![AI chatbot assistant 1](https://images.unsplash.com/photo-1695596687757-d11e6cccb679)
*Alt text: AI chatbot interface assisting a user with travel recommendations.*

### Booking & Reservations
*   **Integrated Search:** Direct API connections to flight and hotel aggregators.
*   **Auto-Sync:** Email parsing to automatically extract booking references and add them to the itinerary.
*   **Document Management:** Secure vault for passports, visas, and tickets.

### Budget & Expense Tracking
*   **Real-Time Tracking:** Log expenses manually or via receipt scanning (OCR).
*   **Group Splitting:** "Splitwise-style" functionality to divide costs among trip members.
*   **Currency Conversion:** Live exchange rates for international trips.

![SaaS dashboard budget](https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b)
*Alt text: Financial dashboard showing travel budget tracking and expense categorization.*

### Photo & Memory Management
*   **AI Auto-Tagging:** Vision AI detects landmarks, faces, and activities in uploaded photos.
*   **Smart Albums:** Automatic creation of albums based on location or date.
*   **Highlight Reels:** Auto-generated video slideshows with music and transitions.

### Social & Collaboration
*   **Multiplayer Planning:** Real-time collaborative editing of itineraries (similar to Google Docs).
*   **Group Polling:** Vote on destinations, dates, or activities.
*   **Public Sharing:** Generate read-only links to share itineraries with non-users.

![Group travel planning 1](https://images.unsplash.com/photo-1566371485846-1d68080f9f4a)
*Alt text: Friends collaborating on a travel plan using mobile devices.*

### Mobile & Offline Access
*   **PWA / Native App:** Fully responsive mobile experience.
*   **Offline Mode:** Download itineraries, maps, and tickets for access without internet.
*   **Push Notifications:** Flight gate changes, check-in reminders, and weather alerts.

![Mobile app demo 1](https://images.unsplash.com/photo-1528033978085-52f315289665)
*Alt text: Person using the mobile travel app to navigate a city.*

---

## 5. Integrations

To deliver a seamless experience, the platform integrates with the following third-party services:

*   **Payments & Billing:**
    *   **Stripe:** Subscription management, checkout, and marketplace payouts.
    *   **Converge:** Alternative payment gateway for enterprise clients.
*   **AI & Machine Learning:**
    *   **OpenAI (GPT-4) / Google Gemini:** Core conversational engine and itinerary generation.
    *   **Google Cloud Vision:** Image analysis, OCR for receipts, and landmark detection.
*   **Travel & Mapping:**
    *   **Amadeus / Skyscanner APIs:** Flight and hotel inventory search.
    *   **OpenStreetMap / Leaflet:** Interactive mapping and routing.
*   **Communications:**
    *   **SendGrid / Platform Mailer:** Transactional emails, OTPs, and marketing campaigns.
    *   **Twilio:** SMS notifications for urgent travel alerts.
*   **Storage & Infrastructure:**
    *   **PocketBase:** Core database, authentication, and file storage.
    *   **AWS S3 (Optional):** Scalable backup storage for high-res user photos.
*   **Analytics & CRM:**
    *   **PostHog / Google Analytics:** User behavior tracking and feature usage metrics.
    *   **HubSpot:** Enterprise lead generation and CRM syncing.

---

## 6. UI Components Inventory

The application utilizes a customized `shadcn/ui` component library, styled with Tailwind CSS.

*   **Navigation:** `NavigationMenu`, `Sidebar`, `Breadcrumb`, `Tabs`.
*   **Data Display:** `Card` (for trips/activities), `Table` (for budgets/admin), `Avatar` (user profiles), `Badge` (status indicators), `Carousel` (photo galleries).
*   **Forms & Inputs:** `Input`, `Textarea`, `Select`, `Checkbox`, `Switch`, `Slider`, `DatePicker` (Calendar), `Form` (with Zod validation).
*   **Feedback:** `Toast` / `Sonner` (success/error messages), `Alert`, `Skeleton` (loading states), `Progress` (upload/budget bars).
*   **Overlays:** `Dialog` (modals), `Sheet` (side panels for editing), `Popover`, `DropdownMenu`, `Tooltip`.
*   **Specialized:**
    *   `InteractiveTimeline`: Drag-and-drop interface for itinerary days.
    *   `ChatInterface`: Message bubbles, typing indicators, and quick-reply chips.
    *   `MapContainer`: Leaflet wrapper with custom markers.

---

## 7. User Flows

### Flow 1: AI Trip Generation
1.  User clicks "New Trip".
2.  System presents a chat interface or guided form.
3.  User inputs: "Going to Tokyo for 4 days with my partner, budget is moderate, we love food and art."
4.  System displays a loading skeleton while querying the AI backend.
5.  AI returns a structured JSON response, which the frontend renders as a day-by-day timeline.
6.  User reviews, clicks "Save Trip", and is redirected to the Trip Dashboard.

### Flow 2: Group Collaboration
1.  Trip Owner navigates to "Settings" -> "Collaborators" on a saved trip.
2.  Owner enters email addresses and selects permission levels (Editor/Viewer).
3.  System sends invitation emails with secure tokens.
4.  Invitee clicks link, creates an account (or logs in), and is added to the `trip_members` collection.
5.  Both users can now view the trip. WebSockets (PocketBase real-time) reflect changes instantly when either user modifies the itinerary.

### Flow 3: Expense Splitting
1.  User navigates to the "Budget" tab of a trip.
2.  User clicks "Add Expense", enters amount ($100), category (Dinner), and selects "Paid by Me".
3.  User selects "Split equally" among 4 trip members.
4.  System calculates $25 per person, updates the `expenses` collection, and recalculates the global "Who owes who" balances.

---

## 8. Data Models

The platform uses PocketBase as its primary database. Below are the core collections and their access control rules.

| Collection | Key Fields | Purpose | Access Control (Rules) |
| :--- | :--- | :--- | :--- |
| `users` | `email`, `name`, `avatar`, `role`, `tenant_id` | Core authentication and profile data. | Read/Write: Self or Admin. |
| `trips` | `user_id`, `destination`, `start_date`, `budget`, `status` | High-level container for a vacation. | Read/Write: Owner or Collaborator. |
| `itineraries` | `trip_id`, `day_number`, `date`, `title` | Represents a single day within a trip. | Read/Write: Trip Owner/Editor. |
| `activities` | `trip_id`, `itinerary_id`, `name`, `time`, `cost` | Specific events (museums, tours) on a day. | Read/Write: Trip Owner/Editor. |
| `budget` | `trip_id`, `category`, `planned_amount`, `actual_amount` | Financial tracking per category. | Read/Write: Trip Owner/Editor. |
| `photos` | `trip_id`, `user_id`, `file`, `location`, `tags` | User uploaded media. | Read/Write: Trip Members. |
| `subscriptions` | `user_id`, `plan`, `status`, `end_date` | SaaS billing status. | Read: Self. Write: Admin/System. |
| `trip_members` | `trip_id`, `user_id`, `role` | Junction table for RBAC on specific trips. | Read: Members. Write: Trip Owner. |

*(Note: Refer to the full PocketBase schema for exhaustive field definitions including AI plans, RFPs, and Enterprise tables).*

---

## 9. API Endpoints

The frontend communicates with the Express.js backend via the `apiServerClient.js` wrapper (which prefixes `/hcgi/api`).

### AI & Planning
*   `POST /ai/generate-itinerary`: Accepts user prompt, returns structured JSON itinerary.
*   `POST /ai/chat`: Conversational endpoint for refining plans.
*   `POST /ai/analyze-receipt`: Accepts image base64, returns extracted cost and merchant.

### Payments (Stripe)
*   `POST /payments/create-checkout`: Initiates Stripe session for subscription upgrades.
*   `GET /payments/session/:id`: Verifies payment success.
*   `POST /webhooks/stripe`: (Public) Receives async payment events from Stripe.

### Integrations & External
*   `GET /travel/flights`: Proxies requests to Amadeus/Skyscanner.
*   `GET /travel/hotels`: Proxies requests to accommodation providers.

*(Note: Standard CRUD operations for Trips, Users, and Photos are handled directly via the PocketBase SDK on the frontend).*

---

## 10. Security Measures

*   **Authentication:** Handled via PocketBase (Email/Password, OAuth2 via Google/Apple). JWT tokens are stored securely.
*   **Authorization (RBAC):** Strict PocketBase API rules ensure users can only access data where `user_id = @request.auth.id` or via explicit junction tables (`trip_members`).
*   **Data Encryption:** All sensitive API keys (Stripe, OpenAI) are stored in backend `.env` files, never exposed to the client.
*   **Input Validation:** Frontend uses `Zod` for schema validation before submission. Backend/PocketBase enforces strict typing and constraints.
*   **Rate Limiting:** Express backend implements rate limiting on AI endpoints to prevent abuse and manage token costs.

---

## 11. Compliance Requirements

*   **GDPR / CCPA:** 
    *   Users have a dedicated "Data Deletion" page to request complete account erasure.
    *   Cookie consent banners are implemented.
    *   Privacy Policy and Terms of Service are explicitly accepted during onboarding (`compliance_acceptance` collection).
*   **Data Residency:** PocketBase instances can be deployed in specific regions (EU/US) for enterprise clients requiring data localization.
*   **PCI-DSS:** The platform does not store raw credit card data. All payment processing is offloaded to Stripe/Converge via secure tokens and Checkout sessions.

---

## 12. Performance & Optimization

*   **Image Optimization:** PocketBase automatically generates thumbnails for uploaded photos. The frontend requests specific thumb sizes (e.g., `?thumb=100x100`) to reduce bandwidth.
*   **Lazy Loading:** React `Suspense` and `lazy()` are used for heavy route components (e.g., Map views, Photo Editors).
*   **Caching:** 
    *   Service Workers (PWA) cache static assets and API responses for offline access.
    *   React Query / SWR patterns are used to cache PocketBase responses in memory and prevent redundant network requests.
*   **Animation Performance:** Framer Motion is restricted to animating `transform` and `opacity` properties to ensure GPU acceleration and maintain 60fps.

---

## 13. Best Practices

### Development
*   **Component Structure:** Keep components small (< 300 lines). Extract complex logic into custom hooks (`useTripData.js`, `useBudget.js`).
*   **Styling:** Strictly adhere to the Tailwind design system defined in `index.css`. Avoid inline styles. Use CSS variables for theming.
*   **State Management:** Use Context API for global state (Auth, Theme) and local state for UI toggles. Avoid over-engineering with Redux unless necessary.

### Design
*   **Accessibility (a11y):** Ensure all interactive elements have `aria-labels`, maintain WCAG AA color contrast, and support keyboard navigation.
*   **Empty States:** Never show blank screens. Always provide a clear call-to-action (e.g., "You have no trips yet. Create your first itinerary!").
*   **Loading States:** Use `Skeleton` components that mimic the layout of the incoming data rather than generic spinners.

### Deployment
*   **CI/CD:** Automated linting (`npm run lint`) and building (`npm run build`) on every PR.
*   **Environment Variables:** Maintain strict separation between development, staging, and production environments.

---
*End of Document*
