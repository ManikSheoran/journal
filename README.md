# Journal

A secure, AI-powered journaling web app with mood tracking, todos, and Gemini AI assistant.

## Features

- **Daily Journal Entries:** Write, edit, and view entries by date.
- **Mood Tracking:** Select your mood for each day (emoji scale).
- **Todos:** Add and manage daily tasks.
- **AI Assistant:** Get supportive, context-aware responses from Google Gemini based on your last 7 days of entries.
- **Data Encryption:** Journal content and todos are encrypted before saving to the database.
- **Mobile Friendly:** Responsive UI with mobile-specific features.
- **Authentication:** User registration, login, and session management.

## Tech Stack

- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express, Passport.js
- **Database:** MongoDB (Mongoose)
- **AI:** Google Gemini API (`@google/generative-ai`)
- **Security:** AES-256 encryption for journal data

## Getting Started

### Prerequisites

- Node.js & npm
- MongoDB

### Setup

1. **Clone the repo:**

   ```sh
   git clone https://github.com/yourusername/journal.git
   cd journal
   ```

2. **Install dependencies:**

   ```sh
   cd server
   npm install
   cd ../client
   npm install
   ```

3. **Environment variables:**

   Create a `.env` file in `/server`:

   ```
   MONGODB_URI=mongodb://localhost:27017/journals
   GEMINI_API_KEY=your_gemini_api_key
   JOURNAL_SECRET_KEY=your_32_char_secret_key
   SESSION_SECRET=your_session_secret
   ```

4. **Start the app:**

   - **Backend:**
     ```sh
     cd server
     npm start
     ```
   - **Frontend:**
     ```sh
     cd client
     npm run dev
     ```

5. **Open in browser:**  
   Visit [http://localhost:5173](http://localhost:5173)

## Security

- All journal content and todos are encrypted with AES-256 before being stored.
- User authentication is handled with Passport.js and sessions.
- CORS and cookie settings are configured for secure cross-origin requests.

## AI Assistant

- The AI assistant uses Google Gemini and considers your last 7 days of entries for context.
- Responses are formatted in Markdown and rendered in the chat.

## License

MIT
