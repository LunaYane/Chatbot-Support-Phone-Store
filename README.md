# Phone Store Demo Website (Upgraded)

Demo website bán điện thoại cho đồ án cuối kỳ, nâng cấp theo hướng **full demo flow**: lọc/sắp xếp/phân trang, chatbot tư vấn theo dữ liệu DB, giỏ hàng + checkout giả lập, admin CRUD có upload ảnh.

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript (vanilla)
- **Backend:** Node.js + Express
- **Database:** MongoDB + Mongoose

## Tính năng chính

### 1) Storefront

- Danh sách sản phẩm
- Search theo tên
- Filter theo hãng, khoảng giá
- Sort:
  - Giá tăng dần
  - Giá giảm dần
  - Tên A-Z
  - Tên Z-A
- Pagination: mặc định 12 sản phẩm/trang
- Loading state + empty state
- Toast khi thêm sản phẩm vào giỏ

### 2) Cart + Checkout giả lập

- Thêm vào giỏ từ trang home và detail
- Tăng/giảm số lượng, xóa sản phẩm
- Tính subtotal, phí ship, tổng đơn
- Lưu giỏ bằng `localStorage` (refresh không mất)
- Form checkout đơn giản:
  - Họ tên
  - SĐT
  - Địa chỉ
- Validate cơ bản và tạo đơn demo

### 3) Chatbot tư vấn theo dữ liệu thật

- API: `POST /api/chat`
- Nhận diện nhu cầu theo:
  - Hãng
  - Ngân sách
  - Nhu cầu (gaming/camera/pin/sinh viên)
- Gợi ý top sản phẩm từ DB theo rule scoring
- Fallback rõ ràng nếu chưa đủ thông tin

Ví dụ:
- `iphone duoi 20 trieu`
- `samsung pin trau`
- `dien thoai chup anh dep tam 12 trieu`

### 4) Admin mini CRUD (`/admin`)

- Admin login/logout bằng token
- Xem danh sách sản phẩm
- Thêm / Sửa / Xóa sản phẩm
- Validate input cơ bản
- Nhập ảnh bằng URL **hoặc upload file ảnh**
  - Endpoint: `POST /api/upload/image`
  - File lưu trong `public/uploads/`

### 5) Backend chuẩn hóa

Đã tách cấu trúc theo layer:

- `routes/`
- `controllers/`
- `services/`
- `middlewares/`
- `config/`

Có:
- `asyncHandler`
- middleware xử lý lỗi API chung
- tách logic auth admin, phone data, chat suggestion

---

## Cấu trúc thư mục

```text
Chatbot-Support-Phone-Store/
├── config/
│   ├── db.js
│   └── env.js
├── controllers/
│   ├── adminController.js
│   ├── chatController.js
│   ├── phoneController.js
│   └── uploadController.js
├── data/
│   └── phones.js
├── middlewares/
│   ├── asyncHandler.js
│   ├── errorHandler.js
│   ├── upload.js
│   └── ...
├── models/
│   └── Phone.js
├── public/
│   ├── index.html
│   ├── detail.html
│   ├── checkout.html
│   ├── admin.html
│   ├── script.js
│   ├── detail.js
│   ├── checkout.js
│   ├── admin.js
│   ├── chat.js
│   ├── cart.js
│   ├── styles.css
│   └── uploads/
├── routes/
│   ├── adminRoutes.js
│   ├── chatRoutes.js
│   ├── phoneRoutes.js
│   └── uploadRoutes.js
├── services/
│   ├── authService.js
│   ├── chatService.js
│   └── phoneService.js
├── scripts/
│   └── ensureAdmin.js
├── utils/
│   ├── httpError.js
│   └── recommendation.js
├── seed/
│   └── phonesSeed.js
├── server.js
└── package.json
```

---

## API Endpoints

### Public

- `GET /api/phones`
  - Query params:
    - `search`
    - `brand`
    - `minPrice`
    - `maxPrice`
    - `category`
    - `sort` (`price_asc | price_desc | name_asc | name_desc`)
    - `page`
    - `limit`
- `GET /api/brands`
- `GET /api/phones/:id`
- `POST /api/chat`

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Admin

- `GET /api/admin/products`
- `POST /api/admin/products` (admin only)
- `PUT /api/admin/products/:id` (admin only)
- `DELETE /api/admin/products/:id` (admin only)

### Upload

- `POST /api/upload/image` (admin only)

---

## Chạy local

### 1) Cài dependencies

```bash
npm install
```

### 2) Seed dữ liệu mẫu

```bash
npm run seed
```

### 3) Tạo tài khoản admin mặc định

```bash
npm run ensure-admin
```

### 4) Chạy server

```bash
npm start
```

### 5) Chạy smoke test nhanh

```bash
npm run test:smoke
```

### 6) Chạy full test (auth/role/crud/upload/chat)

```bash
npm run test:full
```

### 7) Mở trình duyệt

- Home: `http://localhost:3001`
- Detail: `http://localhost:3001/product/1`
- Checkout: `http://localhost:3001/checkout`
- Admin: `http://localhost:3001/admin`

---

## Biến môi trường

Mặc định trong code:

- `PORT=3001`
- `MONGO_URI=mongodb://localhost:27017/phone-store-demo`
- `ADMIN_EMAIL=admin@phonestore.demo`
- `ADMIN_PASSWORD=admin123`
- `ADMIN_NAME=Store Admin`

Bạn có thể override bằng biến môi trường khi chạy.

---

## Gợi ý deploy nhanh

### Render / Railway + MongoDB Atlas

1. Push repo lên GitHub
2. Tạo MongoDB Atlas cluster
3. Deploy service Node.js trên Render/Railway
4. Set env vars:
   - `MONGO_URI`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - `ADMIN_NAME`
5. Build/start:
   - Build: `npm install`
   - Start: `npm start`

---

## Lưu ý cho demo trước giảng viên

- Đăng nhập admin rồi thêm/sửa/xóa sản phẩm trực tiếp
- Dùng upload ảnh để thể hiện CRUD đầy đủ
- Test chatbot với câu tiếng Việt theo hãng + ngân sách
- Thêm hàng vào giỏ, sang checkout và đặt đơn demo
- Show rõ phần phân trang + sort + empty/loading states

Chúc bạn bảo vệ đồ án ngon 🔥
