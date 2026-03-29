require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const connectDatabase = require('../src/config/db');
const Product = require('../src/models/Product');
const Faq = require('../src/models/Faq');

const sampleProducts = [
  {
    name: 'iPhone 14 128GB',
    brand: 'iphone',
    price: 17990000,
    ram: 6,
    rom: 128,
    battery: 3279,
    camera: 12,
    chipset: 'Apple A15 Bionic',
    description: 'Hiệu năng ổn định, quay video tốt, phù hợp người dùng iOS.',
    imageUrl: 'https://images.unsplash.com/photo-1663763811548-89cf6f2ec6b1?auto=format&fit=crop&w=800&q=80',
    tags: ['camera', 'hoc-tap']
  },
  {
    name: 'iPhone 15 128GB',
    brand: 'iphone',
    price: 21990000,
    ram: 6,
    rom: 128,
    battery: 3349,
    camera: 48,
    chipset: 'Apple A16 Bionic',
    description: 'Camera 48MP, hiệu năng mạnh, thiết kế cao cấp.',
    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
    tags: ['camera', 'premium']
  },
  {
    name: 'Samsung Galaxy A55 5G',
    brand: 'samsung',
    price: 9990000,
    ram: 8,
    rom: 256,
    battery: 5000,
    camera: 50,
    chipset: 'Exynos 1480',
    description: 'Màn hình đẹp, pin tốt, phù hợp học tập và giải trí.',
    imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
    tags: ['hoc-tap', 'pin-trau', 'camera']
  },
  {
    name: 'Samsung Galaxy S24',
    brand: 'samsung',
    price: 19990000,
    ram: 8,
    rom: 256,
    battery: 4000,
    camera: 50,
    chipset: 'Snapdragon 8 Gen 3 for Galaxy',
    description: 'Flagship nhỏ gọn, hiệu năng mạnh, camera tốt.',
    imageUrl: 'https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00?auto=format&fit=crop&w=800&q=80',
    tags: ['gaming', 'camera', 'premium']
  },
  {
    name: 'Xiaomi Redmi Note 13 Pro 5G',
    brand: 'xiaomi',
    price: 8990000,
    ram: 8,
    rom: 256,
    battery: 5100,
    camera: 200,
    chipset: 'Snapdragon 7s Gen 2',
    description: 'Camera 200MP nổi bật trong phân khúc tầm trung.',
    imageUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80',
    tags: ['camera', 'pin-trau', 'hoc-tap']
  },
  {
    name: 'Xiaomi POCO X6 Pro',
    brand: 'xiaomi',
    price: 9490000,
    ram: 12,
    rom: 512,
    battery: 5000,
    camera: 64,
    chipset: 'Dimensity 8300 Ultra',
    description: 'Hiệu năng rất mạnh trong tầm giá, phù hợp chơi game.',
    imageUrl: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=800&q=80',
    tags: ['gaming', 'pin-trau']
  },
  {
    name: 'OPPO Reno11 F 5G',
    brand: 'oppo',
    price: 8990000,
    ram: 8,
    rom: 256,
    battery: 5000,
    camera: 64,
    chipset: 'Dimensity 7050',
    description: 'Thiết kế đẹp, camera chân dung tốt, pin bền.',
    imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
    tags: ['camera', 'pin-trau']
  },
  {
    name: 'realme 12+ 5G',
    brand: 'realme',
    price: 8390000,
    ram: 8,
    rom: 256,
    battery: 5000,
    camera: 50,
    chipset: 'Dimensity 7050',
    description: 'Cấu hình cân bằng, hợp sinh viên và người dùng phổ thông.',
    imageUrl: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80',
    tags: ['hoc-tap', 'pin-trau']
  },
  {
    name: 'vivo V30 5G',
    brand: 'vivo',
    price: 11990000,
    ram: 12,
    rom: 256,
    battery: 5000,
    camera: 50,
    chipset: 'Snapdragon 7 Gen 3',
    description: 'Chụp chân dung đẹp, pin tốt, thiết kế mỏng nhẹ.',
    imageUrl: 'https://images.unsplash.com/photo-1611746869696-d09bce200020?auto=format&fit=crop&w=800&q=80',
    tags: ['camera', 'pin-trau']
  },
  {
    name: 'iPhone 13 128GB',
    brand: 'iphone',
    price: 13990000,
    ram: 4,
    rom: 128,
    battery: 3240,
    camera: 12,
    chipset: 'Apple A15 Bionic',
    description: 'Giá dễ tiếp cận hơn trong hệ sinh thái iPhone.',
    imageUrl: 'https://images.unsplash.com/photo-1632661674596-618e8b13b56b?auto=format&fit=crop&w=800&q=80',
    tags: ['hoc-tap', 'camera']
  },
  {
    name: 'Samsung Galaxy M55 5G',
    brand: 'samsung',
    price: 10990000,
    ram: 12,
    rom: 256,
    battery: 5000,
    camera: 50,
    chipset: 'Snapdragon 7 Gen 1',
    description: 'RAM lớn, pin trâu, màn hình AMOLED đẹp.',
    imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80',
    tags: ['gaming', 'pin-trau', 'hoc-tap']
  },
  {
    name: 'Xiaomi 13T',
    brand: 'xiaomi',
    price: 12990000,
    ram: 12,
    rom: 256,
    battery: 5000,
    camera: 50,
    chipset: 'Dimensity 8200 Ultra',
    description: 'Hiệu năng tốt, camera hợp tác Leica, pin ổn.',
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
    tags: ['gaming', 'camera', 'pin-trau']
  }
];

const sampleFaqs = [
  {
    question: 'Sản phẩm được bảo hành bao lâu?',
    answer: 'Tất cả điện thoại chính hãng được bảo hành 12 tháng tại trung tâm bảo hành hãng.',
    keywords: ['bao hanh', 'bao hành', 'thoi gian bao hanh'],
    category: 'warranty'
  },
  {
    question: 'Có hỗ trợ bảo hành rơi vỡ không?',
    answer: 'Gói bảo hành rơi vỡ phụ thuộc từng hãng và gói mở rộng, bạn có thể mua thêm khi đặt hàng.',
    keywords: ['roi vo', 'bảo hành rơi vỡ'],
    category: 'warranty'
  },
  {
    question: 'Lỗi nhà sản xuất có được đổi máy không?',
    answer: 'Nếu lỗi phần cứng do nhà sản xuất trong thời gian quy định, cửa hàng hỗ trợ đổi mới theo chính sách.',
    keywords: ['doi may', 'loi nha san xuat'],
    category: 'warranty'
  },
  {
    question: 'Có bảo hành pin không?',
    answer: 'Pin được bảo hành theo chính sách chính hãng, thường từ 6 đến 12 tháng tùy điều kiện sử dụng.',
    keywords: ['bao hanh pin', 'pin'],
    category: 'warranty'
  },
  {
    question: 'Mua online có được bảo hành như mua tại cửa hàng không?',
    answer: 'Có. Mọi đơn hàng online đều được hưởng bảo hành chính hãng như mua trực tiếp.',
    keywords: ['mua online bao hanh', 'bao hanh online'],
    category: 'warranty'
  },
  {
    question: 'Thời gian giao hàng nội thành là bao lâu?',
    answer: 'Nội thành thường giao trong 2-4 giờ tùy khu vực và thời điểm đặt hàng.',
    keywords: ['giao hang', 'noi thanh', 'ship'],
    category: 'shipping'
  },
  {
    question: 'Giao hàng đi tỉnh mất bao lâu?',
    answer: 'Đơn đi tỉnh thường mất 2-5 ngày làm việc tùy địa chỉ nhận hàng.',
    keywords: ['di tinh', 'thoi gian giao'],
    category: 'shipping'
  },
  {
    question: 'Phí vận chuyển được tính như thế nào?',
    answer: 'Phí ship phụ thuộc khu vực, nhiều đơn hàng có thể được miễn phí vận chuyển theo chương trình.',
    keywords: ['phi ship', 'van chuyen', 'phi giao hang'],
    category: 'shipping'
  },
  {
    question: 'Có được kiểm tra hàng khi nhận không?',
    answer: 'Bạn được kiểm tra ngoại quan sản phẩm trước khi thanh toán cho đơn hàng COD.',
    keywords: ['kiem tra hang', 'nhan hang'],
    category: 'shipping'
  },
  {
    question: 'Nếu giao hàng trễ thì sao?',
    answer: 'Nếu giao trễ so với dự kiến, bộ phận CSKH sẽ chủ động liên hệ và hỗ trợ cập nhật đơn hàng.',
    keywords: ['giao tre', 'tre don'],
    category: 'shipping'
  },
  {
    question: 'Cửa hàng có hỗ trợ trả góp không?',
    answer: 'Có. Cửa hàng hỗ trợ trả góp qua công ty tài chính và qua thẻ tín dụng.',
    keywords: ['tra gop', 'gop'],
    category: 'installment'
  },
  {
    question: 'Có trả góp 0% không?',
    answer: 'Nhiều sản phẩm hỗ trợ trả góp 0% qua thẻ tín dụng của ngân hàng liên kết.',
    keywords: ['tra gop 0', '0 phan tram'],
    category: 'installment'
  },
  {
    question: 'Thủ tục trả góp cần giấy tờ gì?',
    answer: 'Thông thường cần CCCD/CMND còn hiệu lực và một số thông tin xác minh theo bên tài chính.',
    keywords: ['thu tuc tra gop', 'giay to tra gop'],
    category: 'installment'
  },
  {
    question: 'Sinh viên có mua trả góp được không?',
    answer: 'Sinh viên vẫn có thể trả góp nếu đáp ứng điều kiện duyệt hồ sơ từ đối tác tài chính.',
    keywords: ['sinh vien tra gop', 'hoc sinh tra gop'],
    category: 'installment'
  },
  {
    question: 'Có thể tất toán trả góp trước hạn không?',
    answer: 'Có thể tất toán trước hạn, phí tất toán sẽ theo chính sách của bên tài chính hoặc ngân hàng.',
    keywords: ['tat toan', 'truoc han'],
    category: 'installment'
  },
  {
    question: 'Cửa hàng có hỗ trợ đổi trả trong bao lâu?',
    answer: 'Cửa hàng hỗ trợ đổi trả trong 7 ngày nếu sản phẩm lỗi hoặc không đúng mô tả theo quy định.',
    keywords: ['doi tra', 'tra hang'],
    category: 'return'
  },
  {
    question: 'Điều kiện để đổi trả là gì?',
    answer: 'Sản phẩm cần còn đầy đủ phụ kiện, hộp, hóa đơn và không bị tác động ngoại lực.',
    keywords: ['dieu kien doi tra', 'dieu kien tra hang'],
    category: 'return'
  },
  {
    question: 'Máy đã kích hoạt có được đổi trả không?',
    answer: 'Máy đã kích hoạt vẫn xem xét đổi trả theo chính sách riêng của từng hãng và tình trạng máy.',
    keywords: ['kich hoat', 'doi tra may da kich hoat'],
    category: 'return'
  },
  {
    question: 'Hoàn tiền mất bao lâu khi trả hàng?',
    answer: 'Thời gian hoàn tiền thường từ 3-7 ngày làm việc tùy hình thức thanh toán ban đầu.',
    keywords: ['hoan tien', 'bao lau hoan tien'],
    category: 'return'
  },
  {
    question: 'Có thu phí khi đổi trả không?',
    answer: 'Một số trường hợp đổi trả có thể áp dụng phí theo quy định, bạn sẽ được báo rõ trước khi xử lý.',
    keywords: ['phi doi tra', 'mat phi doi tra'],
    category: 'return'
  },
  {
    question: 'Cửa hàng chấp nhận các hình thức thanh toán nào?',
    answer: 'Cửa hàng hỗ trợ tiền mặt, chuyển khoản, quẹt thẻ và ví điện tử.',
    keywords: ['thanh toan', 'hinh thuc thanh toan'],
    category: 'payment'
  },
  {
    question: 'Có thể thanh toán khi nhận hàng (COD) không?',
    answer: 'Có, cửa hàng hỗ trợ COD cho đa số khu vực đủ điều kiện giao hàng.',
    keywords: ['cod', 'thanh toan khi nhan hang'],
    category: 'payment'
  },
  {
    question: 'Chuyển khoản trước có ưu đãi gì không?',
    answer: 'Tùy chương trình từng thời điểm, chuyển khoản trước có thể nhận ưu đãi thêm.',
    keywords: ['chuyen khoan', 'uu dai chuyen khoan'],
    category: 'payment'
  },
  {
    question: 'Thanh toán bằng thẻ tín dụng có mất phí không?',
    answer: 'Phần lớn giao dịch thẻ tín dụng không mất phí, trừ một số chương trình đặc biệt có thông báo riêng.',
    keywords: ['the tin dung', 'phi the'],
    category: 'payment'
  },
  {
    question: 'Có xuất hóa đơn VAT không?',
    answer: 'Có. Cửa hàng hỗ trợ xuất hóa đơn VAT theo thông tin khách hàng cung cấp.',
    keywords: ['hoa don vat', 'xuat hoa don'],
    category: 'payment'
  }
];

async function runSeed() {
  try {
    await connectDatabase();

    await Product.deleteMany({});
    await Faq.deleteMany({});

    await Product.insertMany(sampleProducts);
    await Faq.insertMany(sampleFaqs);

    console.log('✅ Seed dữ liệu thành công');
    console.log(`📱 Products: ${sampleProducts.length}`);
    console.log(`❓ FAQs: ${sampleFaqs.length}`);
  } catch (error) {
    console.error('❌ Seed dữ liệu thất bại:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

runSeed();
