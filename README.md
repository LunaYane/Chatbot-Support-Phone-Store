# Phone Store Demo Website

Simple demo website for selling mobile phones.

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript (no framework)
- **Backend:** Node.js + Express

## Features

1. Homepage showing a list of mobile phones
2. Click product card to open product detail page
3. Product detail page shows:
   - Name
   - Brand
   - Price
   - Image
   - Specifications
   - Description
4. Clean and modern UI
5. Static sample product data

## Updated Project Structure

```text
Chatbot-Support-Phone-Store/
├── data/
│   └── phones.js                # Product sample data + specifications
├── public/
│   ├── index.html               # Homepage
│   ├── detail.html              # Product detail page (NEW)
│   ├── styles.css               # Shared styles (UPDATED)
│   ├── script.js                # Homepage logic (UPDATED)
│   └── detail.js                # Detail page logic (NEW)
├── .gitignore
├── package.json
├── server.js                    # Express API + routing (UPDATED)
└── README.md
```

## API Endpoints

- `GET /api/phones` → get all products
- `GET /api/phones/:id` → get one product by ID

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

- Homepage: `http://localhost:3000`
- Product detail example: `http://localhost:3000/product/1`

## Files Added / Modified

### Added
- `public/detail.html`
- `public/detail.js`

### Modified
- `data/phones.js`
  - Added `specifications` object for each product.
- `server.js`
  - Added route `GET /api/phones/:id`.
  - Added route `/product/:id` to serve detail page.
- `public/script.js`
  - Product cards now link to `/product/:id`.
- `public/styles.css`
  - Added styles for detail page and product links.
- `README.md`
  - Updated structure and instructions for detail page.

## Notes for university final project demo

- Code is intentionally simple, readable, and easy to explain.
- Frontend and backend are separated clearly.
- No database required (static data).
- Easy to extend with search/filter/cart/admin in next steps.
