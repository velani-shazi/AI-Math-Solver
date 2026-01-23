
---

# **Infinity AI Math Solver**

Infinity AI Math Solver is a smart, interactive web application that helps users solve math problems using Google’s Gemini AI. It features a clean interface, real-time math editing using **MathQuill**, and beautiful LaTeX rendering with **MathJax**.

---

## 🚀 **Tech Stack**

### **Frontend**

* **React** – Component-based UI for a smooth, fast, and dynamic user experience.
* **CSS** – Custom styling for layout, responsiveness, and polished visual design.
* **MathQuill** – Interactive math expression editor allowing users to type formulas naturally (fractions, roots, symbols, etc.).
* **MathJax** – High-quality LaTeX rendering for displaying equations, steps, and AI-generated solutions clearly.

---

### **Backend**

* **Node.js** – Backend runtime for handling requests, performing server logic, and connecting external APIs.
* **Express.js** – Web framework used for REST API endpoints, authentication, and routing.
* **MongoDB** – NoSQL database storing user accounts, login sessions, and more.
* **Gemini API** – Processes math problem input and returns AI-powered reasoning, step-by-step solutions, and explanations.

---

## 🔐 **Environment Variables**

Create a `.env` file in `ai-math-solver-backend` and add:

```
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
JWT_EXPIRY=24h

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

FRONTEND_URL=http://localhost:3000
GEMINI_API_KEY=your-gemini-api-key
NODE_ENV=development

# Email (Nodemailer) - required for verification / reset emails
EMAIL_SERVICE=gmail                       # optional, defaults to 'gmail'
EMAIL_USER=your-email@example.com         # SMTP user / email address
EMAIL_PASSWORD=your-email-password        # SMTP password or app password
EMAIL_FROM="AI Math Solver <no-reply@example.com>"  # optional, defaults to EMAIL_USER
```

> ⚠️ Use your own API keys, SMTP credentials, and secrets.
> Never commit environment variables to version control.

---

## 🛠️ **How to Run the Project**

### **1. Build the frontend**

```bash
cd ai-math-solver-frontend
npm install
npm run build
```

### **2. Move the build output to the backend**

Copy the generated `build/` folder into:

```
ai-math-solver-backend/
```

### **3. Start the backend**

```bash
cd ai-math-solver-backend
npm install
node server.js
```

---

## 🎉 **Ready to Solve Math with AI!**

Once the backend is running, open your browser and enjoy an AI-powered math-solving experience with clean LaTeX rendering and intuitive formula editing.
