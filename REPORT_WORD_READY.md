# BÁO CÁO CUỐI KỲ
## Môn: Phát triển ứng dụng
## Đề tài: Hệ thống Phone Store tích hợp Chatbot tư vấn sản phẩm

> **Hướng dẫn dùng file này:**
> 1) Copy toàn bộ nội dung sang Word
> 2) Dùng Heading 1/2/3 để tạo mục lục tự động
> 3) Thay các phần trong ngoặc vuông `[ ... ]`
> 4) Chèn ảnh minh họa ở các vị trí gợi ý

---

# TRANG BÌA

**TRƯỜNG:** [Tên trường]  
**KHOA/BỘ MÔN:** [Tên khoa]  
**MÔN HỌC:** Phát triển ứng dụng  
**ĐỀ TÀI:** Hệ thống Phone Store tích hợp Chatbot tư vấn sản phẩm  
**NHÓM:** [Tên nhóm]  
**GIẢNG VIÊN HƯỚNG DẪN:** [Tên GV]  
**HỌC KỲ - NĂM HỌC:** [Học kỳ, năm học]  

**THÀNH PHỐ, NĂM:** [Địa điểm], [Năm]

---

# DANH SÁCH THÀNH VIÊN & PHÂN CÔNG TỔNG QUAN

| STT | Họ và tên | MSSV | Vai trò chính | Công việc chính | Tỷ lệ đóng góp |
|---|---|---|---|---|---|
| 1 | [Tên TV1] | [MSSV] | Team Lead / Backend | Thiết kế API, phân quyền, DB, tích hợp chatbot | [..]% |
| 2 | [Tên TV2] | [MSSV] | Frontend | UI/UX trang Home/Detail/Checkout/Admin | [..]% |
| 3 | [Tên TV3] | [MSSV] | Fullstack / QA | CRUD sản phẩm, upload ảnh, kiểm thử | [..]% |
| 4 | [Tên TV4] | [MSSV] | Documentation | Báo cáo, screenshot, video demo | [..]% |

> Ghi chú: Thành viên không đóng góp không đưa vào báo cáo.

---

# MỤC LỤC

> Dùng mục lục tự động của Word sau khi áp Heading.

---

# CHƯƠNG 1. GIỚI THIỆU ĐỀ TÀI

**Thành viên thực hiện chương này:** [Tên + MSSV ...]

## 1.1. Bối cảnh
Trong bối cảnh thương mại điện tử phát triển mạnh, nhu cầu mua sắm smartphone/laptop trực tuyến tăng cao. Người dùng cần một hệ thống có khả năng tìm kiếm nhanh, lọc theo nhu cầu và được tư vấn phù hợp ngân sách.

## 1.2. Mục tiêu đề tài
- Xây dựng website bán thiết bị công nghệ (smartphone là chính, có thêm một phần laptop).
- Hỗ trợ người dùng qua chatbot tư vấn theo hãng, ngân sách, nhu cầu.
- Xây dựng hệ thống phân quyền rõ ràng giữa user và admin.

## 1.3. Phạm vi đề tài
### 1.3.1. Trong phạm vi
- Quản lý danh sách sản phẩm.
- Xem chi tiết sản phẩm.
- Tìm kiếm/lọc/sắp xếp/phân trang.
- Giỏ hàng và checkout.
- Đăng nhập/đăng ký và phân quyền.
- Admin CRUD sản phẩm + upload ảnh.
- Chatbot tư vấn sản phẩm.

### 1.3.2. Ngoài phạm vi
- Thanh toán online thật (VNPay/MoMo).
- Theo dõi vận chuyển thật.
- Huấn luyện mô hình AI riêng.

## 1.4. Công nghệ sử dụng
- Frontend: HTML/CSS/JavaScript
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Quản lý source code: Git + GitHub

## 1.5. Kết quả kỳ vọng
- Sản phẩm chạy ổn định, demo được đầy đủ luồng user/admin.
- Có tài liệu báo cáo, video demo và source code hoàn chỉnh.

---

# CHƯƠNG 2. PHÂN TÍCH YÊU CẦU

**Thành viên thực hiện chương này:** [Tên + MSSV ...]

## 2.1. Đối tượng sử dụng
- Khách truy cập chưa đăng nhập
- User đã đăng nhập
- Admin

## 2.2. User Stories
1. Là khách truy cập, tôi muốn xem danh sách sản phẩm để tham khảo.
2. Là user, tôi muốn tìm kiếm và lọc sản phẩm theo giá/hãng.
3. Là user, tôi muốn xem chi tiết sản phẩm trước khi mua.
4. Là user, tôi muốn thêm sản phẩm vào giỏ và checkout.
5. Là user, tôi muốn chatbot gợi ý máy theo nhu cầu.
6. Là admin, tôi muốn thêm/sửa/xóa sản phẩm.
7. Là admin, tôi muốn upload ảnh sản phẩm để quản lý thuận tiện.

## 2.3. Use Cases chính
- UC01: Đăng ký tài khoản
- UC02: Đăng nhập
- UC03: Xem danh sách sản phẩm
- UC04: Tìm kiếm/lọc/sắp xếp
- UC05: Xem chi tiết sản phẩm
- UC06: Quản lý giỏ hàng
- UC07: Thanh toán (checkout)
- UC08: Chatbot tư vấn sản phẩm
- UC09: Admin CRUD sản phẩm
- UC10: Admin upload ảnh sản phẩm

## 2.4. Wireframe (đính kèm ảnh)
- Trang chủ
- Trang chi tiết sản phẩm
- Trang checkout
- Trang admin
- Popup chatbox

> **Chèn ảnh minh họa wireframe tại đây**

---

# CHƯƠNG 3. THIẾT KẾ HỆ THỐNG

**Thành viên thực hiện chương này:** [Tên + MSSV ...]

## 3.1. Kiến trúc tổng thể
Mô hình Client - Server:
- Client (Web Browser)
- Server (Express API)
- Database (MongoDB)

## 3.2. Thiết kế cơ sở dữ liệu
### 3.2.1. Collection `users`
- fullName
- email
- phone
- passwordHash
- role (user/admin)
- isActive

### 3.2.2. Collection `phones`
- id
- name
- brand
- price
- image
- shortDescription
- fullDescription
- specifications
- recommendation flags

### 3.2.3. Collection khác (nếu có)
- orders / carts [mô tả nếu triển khai]

## 3.3. ERD
> **Chèn hình ERD tại đây**

## 3.4. Thiết kế API
### 3.4.1. Auth APIs
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

### 3.4.2. Product APIs
- GET /api/phones
- GET /api/phones/:id
- GET /api/brands

### 3.4.3. Admin APIs
- GET /api/admin/products
- POST /api/admin/products (admin only)
- PUT /api/admin/products/:id (admin only)
- DELETE /api/admin/products/:id (admin only)

### 3.4.4. Chat API
- POST /api/chat

---

# CHƯƠNG 4. PHÁT TRIỂN HỆ THỐNG

**Thành viên thực hiện chương này:** [Tên + MSSV ...]

## 4.1. Phát triển Frontend
- Xây dựng giao diện homepage theo phong cách e-commerce.
- Tối ưu hiển thị card sản phẩm, category, sticky navbar.
- Trang detail hiển thị thông số kỹ thuật rõ ràng.
- Trang checkout yêu cầu đăng nhập trước khi thanh toán.
- Trang admin quản lý sản phẩm.

> **Chèn ảnh màn hình từng chức năng frontend**

## 4.2. Phát triển Backend
- Xây dựng API sản phẩm với tìm kiếm/lọc/sắp xếp/phân trang.
- Xây dựng auth và phân quyền user/admin.
- Bảo vệ route admin và upload ảnh.
- Chuẩn hóa kiến trúc routes/controllers/services.

> **Chèn ảnh code minh họa backend + giải thích ngắn**

## 4.3. Chatbot tư vấn
- Nhận diện ý định: ngân sách, hãng, nhu cầu.
- Gợi ý top sản phẩm theo dữ liệu DB.
- Hỗ trợ ngữ cảnh hội thoại nhiều lượt.
- Hỗ trợ hỏi so sánh mẫu máy.

## 4.4. Các tối ưu đã thực hiện
- Fix ảnh lỗi bằng fallback + cập nhật source ảnh hợp lệ.
- Tối ưu UI/UX theo phản hồi người dùng.
- Cải thiện logic search và điều hướng.

---

# CHƯƠNG 5. KIỂM THỬ

**Thành viên thực hiện chương này:** [Tên + MSSV ...]

## 5.1. Mục tiêu kiểm thử
- Đảm bảo chức năng hoạt động đúng.
- Đảm bảo phân quyền chính xác.
- Đảm bảo trải nghiệm sử dụng mượt và ổn định.

## 5.2. Bảng test case mẫu

| STT | Chức năng | Bước kiểm thử | Kết quả mong đợi | Kết quả thực tế | Đạt/Không đạt |
|---|---|---|---|---|---|
| 1 | Đăng ký | Nhập thông tin hợp lệ | Tạo tài khoản thành công | [..] | [..] |
| 2 | Đăng nhập | User login | Đăng nhập thành công | [..] | [..] |
| 3 | Phân quyền | User gọi API admin | Trả về 401/403 | [..] | [..] |
| 4 | Admin CRUD | Admin thêm sản phẩm | Trả về 201 + dữ liệu mới | [..] | [..] |
| 5 | Search | Nhập từ khóa và Enter | Hiển thị danh sách đúng | [..] | [..] |
| 6 | Checkout | Chưa login bấm checkout | Bị chặn thanh toán | [..] | [..] |
| 7 | Chatbot | Hỏi ngân sách + nhu cầu | Gợi ý máy phù hợp | [..] | [..] |
| 8 | API phones | GET /api/phones | Trả về 200 + danh sách | [..] | [..] |
| 9 | Product detail | GET /api/phones/:id | Trả về 200 + chi tiết | [..] | [..] |

## 5.3. Kiểm thử tự động (Smoke Test)
Nhóm triển khai script kiểm thử nhanh để kiểm tra các chức năng lõi trước khi demo:

```bash
npm run test:smoke
```

Script này xác minh các API quan trọng:
- `/api/phones`
- `/api/phones/:id`
- `/api/chat`
- Quyền truy cập admin route khi chưa đăng nhập

## 5.3. Kết luận kiểm thử
- Tổng số test case: [..]
- Số test pass: [..]
- Số test fail: [..]
- Nguyên nhân và hướng khắc phục: [..]

---

# CHƯƠNG 6. KẾT QUẢ & HƯỚNG PHÁT TRIỂN

**Thành viên thực hiện chương này:** [Tên + MSSV ...]

## 6.1. Kết quả đạt được
- Hoàn thành hệ thống Phone Store có đầy đủ chức năng cốt lõi.
- Triển khai phân quyền admin/user rõ ràng.
- Chatbot hoạt động theo ngữ cảnh và dữ liệu thực tế.

## 6.2. Hạn chế
- Chưa tích hợp thanh toán online thực tế.
- Chưa có dashboard thống kê bán hàng chi tiết.
- Chưa triển khai tối ưu SEO/performance chuyên sâu.

## 6.3. Hướng phát triển
- Tích hợp cổng thanh toán online.
- Bổ sung quản lý đơn hàng đầy đủ.
- Nâng cấp chatbot tích hợp LLM API ngoài.
- Bổ sung dashboard phân tích doanh thu và hành vi người dùng.

---

# TÀI LIỆU THAM KHẢO

1. Node.js Documentation — https://nodejs.org/
2. Express Documentation — https://expressjs.com/
3. MongoDB Documentation — https://www.mongodb.com/docs/
4. Mongoose Documentation — https://mongoosejs.com/docs/
5. Tài liệu học phần Phát triển ứng dụng — [Giáo trình/slide môn học]

---

# PHỤ LỤC

## A. Link GitHub Repository
[Điền link GitHub]

## B. Link Video Demo YouTube
[Điền link YouTube]

## C. Hướng dẫn chạy dự án (tóm tắt)
```bash
npm install
npm run seed
npm run ensure-admin
npm start
```

## D. Tài khoản demo
- Admin: `admin@phonestore.demo` / `admin123`
- User: [Tài khoản test của nhóm]

---

# KỊCH BẢN DEMO VIDEO 5–7 PHÚT (ĐÍNH KÈM)

## 0:00–0:30
Giới thiệu nhóm, đề tài, mục tiêu.

## 0:30–2:30
Demo luồng user: xem sản phẩm → lọc/sort/search → view detail → add cart → checkout.

## 2:30–3:30
Demo đăng nhập và phân quyền admin/user.

## 3:30–4:30
Demo admin CRUD + upload ảnh.

## 4:30–5:30
Demo chatbot: hỏi ngân sách, nhu cầu, so sánh mẫu.

## 5:30–6:00
Kết luận và hướng phát triển.

---

**HẾT**
