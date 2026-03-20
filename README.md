# Project Demo Git - Nhóm 
## Thành viên
- Nguyễn Thanh Hải - MSSV: 1721030593
- Trần Đông Anh - MSSV: 1721030867
- Nguyễn Trọng Nghĩa - MSSV: 172100321
- Tô Văn Dương - MSSV: 1721001336

## 📱 Chatbot Thông Minh Hỗ Trợ Bán Hàng Điện Thoại

**Đề tài:** Phát triển Chatbot thông minh hỗ trợ bán hàng cho website kinh doanh điện thoại di động  
**Mã học phần:** 03700222  
**Giảng viên hướng dẫn:** TS. Phạm Đình Lâm  

## 📋 Mô tả dự án

Dự án xây dựng **chatbot AI** tích hợp trực tiếp vào website kinh doanh điện thoại di động. Chatbot có khả năng:
- Tư vấn sản phẩm thông minh theo nhu cầu, ngân sách và sở thích của khách hàng
- Trả lời nhanh các câu hỏi thường gặp (FAQ)
- Hỗ trợ quy trình mua hàng, thanh toán và theo dõi đơn hàng
- Chăm sóc khách hàng 24/7 mà không cần nhân viên trực tiếp

Chatbot giúp tăng tỷ lệ chuyển đổi (conversion rate), giảm thời gian chờ đợi và nâng cao trải nghiệm người dùng.

---

## ✨ Tính năng chính

- **Tư vấn cá nhân hóa**: Gợi ý điện thoại phù hợp (iPhone, Samsung, Xiaomi, Oppo...) dựa trên câu hỏi tự nhiên
- **Xử lý đơn hàng**: Thêm vào giỏ hàng, tạo đơn hàng, kiểm tra trạng thái
- **FAQ thông minh**: Hỗ trợ hơn 50+ câu hỏi phổ biến (giá, bảo hành, khuyến mãi, trả góp...)
- **Tích hợp đa nền tảng**: Website (React/Vue), Facebook Messenger, Zalo OA (tùy chọn)
- **Giao diện chat đẹp mắt**: Responsive, hỗ trợ emoji, nút nhanh (Quick Replies)
- **Phân tích dữ liệu**: Báo cáo số lượt chat, sản phẩm được quan tâm nhiều nhất

---

## 🛠 Công nghệ sử dụng

| Lớp | Công nghệ |
|-----|----------|
| **Frontend** | HTML5 + CSS3 + JavaScript (hoặc React.js) |
| **Backend** | Node.js + Express / Python + Flask |
| **AI/NLP** | Rasa Open Source hoặc OpenAI GPT-4o (API) |
| **Database** | MongoDB (hoặc MySQL) |
| **Tích hợp** | RESTful API, WebSocket (Socket.io), Dialogflow (tùy chọn) |
| **Version Control** | Git + GitHub (theo Git Flow) |
| **Deployment** | Vercel / Render / Railway |

---

## 🚀 Cài đặt & Chạy dự án

```bash
# 1. Clone repository
git clone https://github.com/[username]/chatbot-ban-hang-dien-thoai.git
cd chatbot-ban-hang-dien-thoai

# 2. Cài đặt dependencies
npm install          # hoặc pip install -r requirements.txt

# 3. Cấu hình biến môi trường
cp .env.example .env

# 4. Chạy chatbot
npm run dev          # hoặc python app.py
