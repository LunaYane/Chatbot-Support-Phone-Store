# Phone Store Demo Website

Simple demo website for selling mobile phones.

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript (no framework)
- **Backend:** Node.js + Express

## Features

1. Homepage showing a list of mobile phones
2. Each product has:
   - Name
   - Brand
   - Price
   - Image
   - Short description
3. Clean and modern UI
4. Static sample product data

## Project Structure

```text
Chatbot-Support-Phone-Store/
├── data/
│   └── phones.js
├── public/
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── .gitignore
├── package.json
├── server.js
└── README.md
```

## How to run locally

### 1) Clone repository

```bash
git clone https://github.com/LunaYane/Chatbot-Support-Phone-Store.git
cd Chatbot-Support-Phone-Store
```

### 2) Install dependencies

```bash
npm install
```

### 3) Run server

```bash
npm start
```

### 4) Open browser

Go to:

```text
http://localhost:3000
```

## Notes for university demo

- Code is intentionally simple and readable.
- Frontend and backend are separated clearly.
- Data is static, so no database setup is required.
- You can easily extend with search, filter, cart, or admin page later.
