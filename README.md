# AI-Powered Industry Chatbot Widget

## Project Overview
This repository contains the source code for a context-aware AI chatbot widget developed for the **AI Automation & Chatbot** challenge. The application leverages **Google Gemini 2.5 Flash** for natural language understanding and **Supabase** (PostgreSQL) for data persistence. It is designed as a scalable, embeddable solution capable of adapting its persona and logic to different industries dynamically.

**Live Demonstration:**  
https://chatbot-wheat-three-83.vercel.app/

---

## Key Features

### 1. Context-Aware Artificial Intelligence
The application utilizes the Google Gemini 2.5 Flash model to process user queries. It maintains conversation history to provide contextually relevant responses and adapts its tone based on the active industry configuration. The system also generates dynamic **Quick Reply** suggestions based on the immediate conversation context.

### 2. Dynamic Industry Switching (Scalability Demonstration)
The application demonstrates multi-tenancy capabilities through a single codebase. The chatbot's persona, thematic styling, and operational logic can be modified at runtime using URL query parameters, eliminating the need for separate deployments.

- **Real Estate Mode (Default):** Specialized in property inquiries and tour scheduling  
  https://chatbot-wheat-three-83.vercel.app/

- **Healthcare Mode:** Specialized in patient triage and appointment management  
  https://chatbot-wheat-three-83.vercel.app/?industry=Healthcare

### 3. Automated Lead Capture & Escalation
The system includes an intent detection layer that identifies high-value user actions (e.g., booking requests or inquiries about pricing). Upon detection, the AI automatically triggers a lead capture form. Submitted data is securely stored in the Supabase `leads` table for administrative review.

### 4. Universal Embeddability
The widget is architected to function independently of the host environment. It can be integrated into external websites (CMS platforms or custom HTML) via a single JavaScript module import.

---

## Technical Stack

- **Frontend Framework:** React 18  
- **Build Tool:** Vite  
- **Styling:** Tailwind CSS (Glassmorphism UI)  
- **AI Integration:** Google Gemini 2.5 Flash API  
- **Backend & Database:** Supabase (PostgreSQL)  
- **State Management:** React Context API  
- **Deployment:** Vercel  

---

## Installation and Setup

To run this project locally, follow the steps below:

### 1. Clone the Repository
```bash
git clone https://github.com/abdul1ah/chatbot.git
cd chatbot
```

### 2. Install Dependencies
Install the necessary project dependencies using the Node Package Manager (npm).

```bash
npm install
```

---

## Configuration

The application requires specific environment variables to function correctly. You must create a local environment file to store your API keys and database credentials.

### 1. Create Environment File
Create a file named `.env` in the root directory of the project.

### 2. Define Variables
Add the following keys to the `.env` file:

```env
VITE_GEMINI_API_KEY=your_google_gemini_api_key
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_public_key
```

**Variable Descriptions:**
- `VITE_GEMINI_API_KEY`: Your API key from Google AI Studio  
- `VITE_SUPABASE_URL`: The REST URL associated with your Supabase project  
- `VITE_SUPABASE_ANON_KEY`: The anon public key found in your Supabase project settings  

---

## Usage Notes

### Development Mode
To run the application locally for development and testing:

```bash
npm run dev
```

This will start a local server accessible at:  
http://localhost:5173

Changes to the code will reflect instantly in the browser.

### Building for Production
To generate the optimized production build (including the embeddable script):

```bash
npm run build
```

The output files will be generated in the `dist/` directory.

---

## Embedding the Widget

The chatbot is designed to be embedded into external websites. To use it, include the generated script file in the HTML of the target website, just before the closing `</body>` tag:

```html
<script type="module" src="https://chatbot-wheat-three-83.vercel.app/assets/index.js"></script>
```

---

## Dynamic Industry Switching

The application supports runtime configuration changes via URL parameters. This allows a single deployment to serve multiple use cases without code changes.

- **Default View:** Loads the configuration defined in `config.json` (Real Estate)
- **Industry Override:** Append `?industry=Name` to the URL  
  Example:
  ```
  ?industry=Healthcare
  ```

---

## Analytics and Logging

All user interactions are logged to the `chat_logs` table within the connected Supabase instance. This provides a data trail for auditing bot performance, analyzing user intent, and refining automated responses.
