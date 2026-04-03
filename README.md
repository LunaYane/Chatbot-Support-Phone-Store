# Phone Store Demo Website

Simple demo website for selling mobile phones.

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript (no framework)
- **Backend:** Node.js + Express
- **Database:** MongoDB + Mongoose

## Features

1. Homepage showing a list of mobile phones
2. Product detail page (`/product/:id`)
3. Search by product name
4. Filter by brand
5. Filter by price range (min/max)
6. Chatbot popup UI at bottom-right corner
7. Clean and modern UI for easy demo

## Updated Project Structure

```text
Chatbot-Support-Phone-Store/
├── data/
│   └── phones.js                # Sample product data for seeding
├── models/
│   └── Phone.js                 # Mongoose model
├── seed/
│   └── phonesSeed.js            # Seed script (import sample data to MongoDB)
├── public/
│   ├── index.html               # Homepage + search/filter + chatbot popup
│   ├── detail.html              # Product detail page + chatbot popup
│   ├── styles.css               # Shared styles (filter + chatbot UI)
│   ├── script.js                # Homepage logic (search/filter requests)
│   ├── detail.js                # Detail page logic
│   └── chat.js                  # Chatbox frontend logic (send/receive messages)
├── .gitignore
├── package.json
├── server.js                    # Express API + MongoDB + chat API
└── README.md
```

## API Endpoints

- `GET /api/phones`
  - Supports query params:
    - `search` (search by name, case-insensitive)
    - `brand` (exact brand)
    - `minPrice` (minimum price)
    - `maxPrice` (maximum price)
- `GET /api/brands` → get all distinct brands for dropdown filter
- `GET /api/phones/:id` → get one product by ID
- `POST /api/chat` → chatbot reply based on predefined rules

## MongoDB Connection

Default URI in code:

```text
mongodb://localhost:27017/phone-store-demo
```

You can override via environment variable:

```bash
MONGO_URI=mongodb://localhost:27017/phone-store-demo
```

## How to run locally

### 1) Install dependencies

```bash
npm install
```

### 2) Seed sample data into MongoDB

```bash
npm run seed
```

### 3) Run server

```bash
npm start
```

### 4) Open browser

- Homepage: `http://localhost:3001`
- Product detail example: `http://localhost:3001/product/1`

## Search & Filter flow (brief)

1. User types keyword / selects brand / enters min-max price on homepage.
2. Frontend builds query string, for example:

```text
/api/phones?search=iphone&brand=Apple&minPrice=10000000&maxPrice=30000000
```

3. Backend converts query params into MongoDB filter object:
   - `search` → `$regex` on `name` (case-insensitive)
   - `brand` → exact match
   - `minPrice`, `maxPrice` → `$gte`, `$lte` on `price`
4. Backend returns filtered list and frontend re-renders the product grid.

## Chatbot flow (brief)

1. User clicks **💬 Chat** button in bottom-right corner.
2. Popup chatbox appears with:
   - chat window
   - input field
   - send button
3. User sends message.
4. Frontend (`chat.js`) calls `POST /api/chat` with JSON body `{ message }`.
5. Backend returns predefined reply based on message keywords (hello, price, iphone, samsung, thank...).
6. Frontend appends bot response to chat window.

## Files Added / Modified

### Added
- `models/Phone.js`
- `seed/phonesSeed.js`
- `public/chat.js`

### Modified
- `server.js`
- `public/index.html`
- `public/detail.html`
- `public/script.js`
- `public/styles.css`
- `package.json`
- `README.md`

## Notes for university final project demo

- Code is intentionally simple and easy to explain.
- Uses traditional static frontend + Express APIs.
- No advanced frameworks.
- Easy to extend with real AI chatbot, cart, login, and admin management.
