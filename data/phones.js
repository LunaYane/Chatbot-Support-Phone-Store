const phones = [
  {
    id: 1,
    name: 'iPhone 16 Pro Max',
    brand: 'Apple',
    price: 34990000,
    image: 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-16-pro-max-1.jpg',
    shortDescription: 'Flagship iPhone mới nhất với chip A18 Pro và camera zoom mạnh.',
    fullDescription:
      'iPhone 16 Pro Max hướng tới người dùng cao cấp với hiệu năng đầu bảng, quay video chuyên nghiệp và pin cực bền.',
    description:
      'iPhone 16 Pro Max hướng tới người dùng cao cấp với hiệu năng đầu bảng, quay video chuyên nghiệp và pin cực bền.',
    tags: ['flagship', 'ios', 'camera', 'premium'],
    specifications: {
      display: '6.9-inch LTPO Super Retina XDR OLED 120Hz',
      processor: 'Apple A18 Pro',
      ram: '8 GB',
      storage: '256 GB',
      battery: '4685 mAh',
      camera: '48MP + 48MP + 12MP'
    }
  },
  {
    id: 2,
    name: 'iPhone 16 Pro',
    brand: 'Apple',
    price: 30990000,
    image: 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-16-pro-1.jpg',
    shortDescription: 'Bản Pro nhỏ gọn, hiệu năng mạnh và camera cao cấp.',
    fullDescription: 'iPhone 16 Pro phù hợp người thích máy gọn tay nhưng vẫn muốn sức mạnh flagship mới nhất của Apple.',
    description: 'iPhone 16 Pro phù hợp người thích máy gọn tay nhưng vẫn muốn sức mạnh flagship mới nhất của Apple.',
    tags: ['flagship', 'ios', 'compact'],
    specifications: {
      display: '6.3-inch LTPO Super Retina XDR OLED 120Hz',
      processor: 'Apple A18 Pro',
      ram: '8 GB',
      storage: '256 GB',
      battery: '3582 mAh',
      camera: '48MP + 48MP + 12MP'
    }
  },
  {
    id: 3,
    name: 'Samsung Galaxy S25 Ultra',
    brand: 'Samsung',
    price: 33990000,
    image: 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s25-ultra-1.jpg',
    shortDescription: 'Flagship Android mạnh nhất của Samsung năm nay.',
    fullDescription: 'Galaxy S25 Ultra nổi bật với AI, bút S Pen, camera zoom xa và màn hình siêu sáng.',
    description: 'Galaxy S25 Ultra nổi bật với AI, bút S Pen, camera zoom xa và màn hình siêu sáng.',
    tags: ['flagship', 'android', 'ai', 'zoom'],
    specifications: {
      display: '6.9-inch Dynamic AMOLED 2X 120Hz',
      processor: 'Snapdragon 8 Elite for Galaxy',
      ram: '12 GB',
      storage: '256 GB',
      battery: '5000 mAh',
      camera: '200MP + 50MP + 50MP + 12MP'
    }
  },
  {
    id: 4,
    name: 'Samsung Galaxy S25+',
    brand: 'Samsung',
    price: 25990000,
    image: 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s25-plus-1.jpg',
    shortDescription: 'Cân bằng giữa màn hình lớn, pin tốt và hiệu năng mạnh.',
    fullDescription: 'Galaxy S25+ là lựa chọn lý tưởng cho người cần flagship Android ổn định để dùng lâu dài.',
    description: 'Galaxy S25+ là lựa chọn lý tưởng cho người cần flagship Android ổn định để dùng lâu dài.',
    tags: ['flagship', 'android', 'big-screen'],
    specifications: {
      display: '6.7-inch Dynamic AMOLED 2X 120Hz',
      processor: 'Snapdragon 8 Elite for Galaxy',
      ram: '12 GB',
      storage: '256 GB',
      battery: '4900 mAh',
      camera: '50MP + 10MP + 12MP'
    }
  },
  {
    id: 5,
    name: 'Google Pixel 9 Pro XL',
    brand: 'Google',
    price: 28990000,
    image: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-pro-xl-1.jpg',
    shortDescription: 'Pixel cao cấp cho nhu cầu camera và AI.',
    fullDescription: 'Pixel 9 Pro XL cho trải nghiệm Android thuần, camera đẹp và nhiều tính năng AI mới.',
    description: 'Pixel 9 Pro XL cho trải nghiệm Android thuần, camera đẹp và nhiều tính năng AI mới.',
    tags: ['pixel', 'camera', 'ai'],
    specifications: {
      display: '6.8-inch LTPO OLED 120Hz',
      processor: 'Google Tensor G4',
      ram: '16 GB',
      storage: '256 GB',
      battery: '5060 mAh',
      camera: '50MP + 48MP + 48MP'
    }
  },
  {
    id: 6,
    name: 'Google Pixel 9',
    brand: 'Google',
    price: 20990000,
    image: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-1.jpg',
    shortDescription: 'Máy Pixel nhỏ gọn, chụp ảnh đẹp, dùng mượt.',
    fullDescription: 'Pixel 9 phù hợp người thích Android sạch, cập nhật nhanh và camera point-and-shoot chất lượng.',
    description: 'Pixel 9 phù hợp người thích Android sạch, cập nhật nhanh và camera point-and-shoot chất lượng.',
    tags: ['pixel', 'compact', 'camera'],
    specifications: {
      display: '6.3-inch OLED 120Hz',
      processor: 'Google Tensor G4',
      ram: '12 GB',
      storage: '128 GB',
      battery: '4700 mAh',
      camera: '50MP + 48MP'
    }
  },
  {
    id: 7,
    name: 'Xiaomi 15 Ultra',
    brand: 'Xiaomi',
    price: 31990000,
    image: 'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-15-ultra-1.jpg',
    shortDescription: 'Flagship camera phone hợp tác Leica.',
    fullDescription: 'Xiaomi 15 Ultra tập trung mạnh vào camera tele và hiệu năng cao cho cả game lẫn sáng tạo nội dung.',
    description: 'Xiaomi 15 Ultra tập trung mạnh vào camera tele và hiệu năng cao cho cả game lẫn sáng tạo nội dung.',
    tags: ['leica', 'camera', 'flagship'],
    specifications: {
      display: '6.73-inch LTPO AMOLED 120Hz',
      processor: 'Snapdragon 8 Elite',
      ram: '16 GB',
      storage: '512 GB',
      battery: '5410 mAh',
      camera: '50MP + 50MP + 50MP + 200MP'
    }
  },
  {
    id: 8,
    name: 'Xiaomi 15',
    brand: 'Xiaomi',
    price: 21990000,
    image: 'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-15-1.jpg',
    shortDescription: 'Flagship gọn nhẹ, hiệu năng mạnh, pin ngon.',
    fullDescription: 'Xiaomi 15 là máy cao cấp nhỏ gọn hiếm hoi với chip mới và thời lượng pin rất tốt.',
    description: 'Xiaomi 15 là máy cao cấp nhỏ gọn hiếm hoi với chip mới và thời lượng pin rất tốt.',
    tags: ['flagship', 'compact', 'value'],
    specifications: {
      display: '6.36-inch OLED 120Hz',
      processor: 'Snapdragon 8 Elite',
      ram: '12 GB',
      storage: '256 GB',
      battery: '5400 mAh',
      camera: '50MP + 50MP + 50MP'
    }
  },
  {
    id: 9,
    name: 'OnePlus 13',
    brand: 'OnePlus',
    price: 23990000,
    image: 'https://fdn2.gsmarena.com/vv/pics/oneplus/oneplus-13-1.jpg',
    shortDescription: 'Flagship hiệu năng cao, sạc nhanh, pin lớn.',
    fullDescription: 'OnePlus 13 phù hợp game thủ và người dùng thích máy mượt, ít lỗi, pin trâu.',
    description: 'OnePlus 13 phù hợp game thủ và người dùng thích máy mượt, ít lỗi, pin trâu.',
    tags: ['gaming', 'flagship', 'fast-charge'],
    specifications: {
      display: '6.82-inch LTPO AMOLED 120Hz',
      processor: 'Snapdragon 8 Elite',
      ram: '12 GB',
      storage: '256 GB',
      battery: '6000 mAh',
      camera: '50MP + 50MP + 50MP'
    }
  },
  {
    id: 10,
    name: 'OPPO Find X8 Pro',
    brand: 'OPPO',
    price: 27990000,
    image: 'https://fdn2.gsmarena.com/vv/pics/oppo/oppo-find-x8-pro-1.jpg',
    shortDescription: 'Flagship OPPO mới, camera mạnh, thiết kế đẹp.',
    fullDescription: 'Find X8 Pro nhắm tới người dùng cao cấp yêu cầu camera và trải nghiệm sử dụng mượt mà.',
    description: 'Find X8 Pro nhắm tới người dùng cao cấp yêu cầu camera và trải nghiệm sử dụng mượt mà.',
    tags: ['flagship', 'camera', 'premium'],
    specifications: {
      display: '6.82-inch LTPO AMOLED 120Hz',
      processor: 'MediaTek Dimensity 9400',
      ram: '16 GB',
      storage: '512 GB',
      battery: '5910 mAh',
      camera: '50MP + 50MP + 50MP + 50MP'
    }
  },
  {
    id: 11,
    name: 'vivo X200 Pro',
    brand: 'vivo',
    price: 27990000,
    image: 'https://fdn2.gsmarena.com/vv/pics/vivo/vivo-x200-pro-1.jpg',
    shortDescription: 'Flagship vivo nổi bật camera ZEISS.',
    fullDescription: 'vivo X200 Pro là lựa chọn mạnh cho người thích chụp chân dung và quay video chất lượng cao.',
    description: 'vivo X200 Pro là lựa chọn mạnh cho người thích chụp chân dung và quay video chất lượng cao.',
    tags: ['zeiss', 'camera', 'flagship'],
    specifications: {
      display: '6.78-inch LTPO AMOLED 120Hz',
      processor: 'MediaTek Dimensity 9400',
      ram: '16 GB',
      storage: '512 GB',
      battery: '6000 mAh',
      camera: '50MP + 200MP + 50MP'
    }
  },
  {
    id: 12,
    name: 'ASUS ROG Phone 9 Pro',
    brand: 'ASUS',
    price: 29990000,
    image: 'https://fdn2.gsmarena.com/vv/pics/asus/asus-rog-phone-9-pro-1.jpg',
    shortDescription: 'Gaming phone cao cấp cho game thủ hardcore.',
    fullDescription: 'ROG Phone 9 Pro tối ưu tản nhiệt, trigger gaming và pin lớn để chơi game lâu.',
    description: 'ROG Phone 9 Pro tối ưu tản nhiệt, trigger gaming và pin lớn để chơi game lâu.',
    tags: ['gaming', 'high-performance'],
    specifications: {
      display: '6.78-inch AMOLED 165Hz',
      processor: 'Snapdragon 8 Elite',
      ram: '16 GB',
      storage: '512 GB',
      battery: '5800 mAh',
      camera: '50MP + 13MP + 32MP'
    }
  },
  {
    id: 13,
    name: 'Samsung Galaxy A56 5G',
    brand: 'Samsung',
    price: 10990000,
    image: 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a56-1.jpg',
    shortDescription: 'Tầm trung hot, màn đẹp, pin tốt, camera ổn.',
    fullDescription: 'Galaxy A56 5G phù hợp số đông người dùng cần thương hiệu mạnh và trải nghiệm ổn định.',
    description: 'Galaxy A56 5G phù hợp số đông người dùng cần thương hiệu mạnh và trải nghiệm ổn định.',
    tags: ['midrange', 'popular', 'value'],
    specifications: {
      display: '6.7-inch Super AMOLED 120Hz',
      processor: 'Exynos 1580',
      ram: '8 GB',
      storage: '256 GB',
      battery: '5000 mAh',
      camera: '50MP + 12MP + 5MP'
    }
  },
  {
    id: 14,
    name: 'Xiaomi Redmi Note 14 Pro+',
    brand: 'Xiaomi',
    price: 9990000,
    image: 'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-note14-pro-plus-1.jpg',
    shortDescription: 'Mid-range mạnh trong tầm giá dưới 10 triệu.',
    fullDescription: 'Redmi Note 14 Pro+ có màn đẹp, sạc nhanh và camera độ phân giải cao phù hợp sinh viên.',
    description: 'Redmi Note 14 Pro+ có màn đẹp, sạc nhanh và camera độ phân giải cao phù hợp sinh viên.',
    tags: ['midrange', 'fast-charge', 'student'],
    specifications: {
      display: '6.67-inch AMOLED 120Hz',
      processor: 'Snapdragon 7s Gen 3',
      ram: '8 GB',
      storage: '256 GB',
      battery: '5110 mAh',
      camera: '200MP + 8MP + 2MP'
    }
  },
  {
    id: 15,
    name: 'realme GT 7 Pro',
    brand: 'realme',
    price: 16990000,
    image: 'https://fdn2.gsmarena.com/vv/pics/realme/realme-gt7-pro-1.jpg',
    shortDescription: 'Flagship killer hiệu năng cao trong tầm giá tốt.',
    fullDescription: 'realme GT 7 Pro cân bằng tốt giữa hiệu năng, pin và mức giá dễ tiếp cận hơn flagship truyền thống.',
    description: 'realme GT 7 Pro cân bằng tốt giữa hiệu năng, pin và mức giá dễ tiếp cận hơn flagship truyền thống.',
    tags: ['performance', 'value', 'gaming'],
    specifications: {
      display: '6.78-inch LTPO AMOLED 120Hz',
      processor: 'Snapdragon 8 Elite',
      ram: '12 GB',
      storage: '256 GB',
      battery: '6500 mAh',
      camera: '50MP + 50MP + 8MP'
    }
  },
  {
    id: 16,
    name: 'Nothing Phone (3a) Pro',
    brand: 'Nothing',
    price: 12990000,
    image: 'https://fdn2.gsmarena.com/vv/pics/nothing/nothing-phone-3a-pro-1.jpg',
    shortDescription: 'Thiết kế độc đáo, giao diện tối giản, hiệu năng ổn.',
    fullDescription: 'Nothing Phone (3a) Pro phù hợp người thích sự khác biệt trong thiết kế và trải nghiệm Android gọn gàng.',
    description: 'Nothing Phone (3a) Pro phù hợp người thích sự khác biệt trong thiết kế và trải nghiệm Android gọn gàng.',
    tags: ['design', 'midrange', 'unique'],
    specifications: {
      display: '6.77-inch AMOLED 120Hz',
      processor: 'Snapdragon 7s Gen 3',
      ram: '12 GB',
      storage: '256 GB',
      battery: '5000 mAh',
      camera: '50MP + 50MP + 8MP'
    }
  },
  {
    id: 17,
    name: 'iPhone 16',
    brand: 'Apple',
    price: 22990000,
    image: 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-16-1.jpg',
    shortDescription: 'iPhone mới dễ tiếp cận, hiệu năng tốt, camera nâng cấp.',
    fullDescription: 'iPhone 16 là lựa chọn hợp lý cho người muốn vào hệ sinh thái Apple với mức giá cân bằng.',
    description: 'iPhone 16 là lựa chọn hợp lý cho người muốn vào hệ sinh thái Apple với mức giá cân bằng.',
    tags: ['ios', 'mainstream', 'popular'],
    specifications: {
      display: '6.1-inch Super Retina XDR OLED',
      processor: 'Apple A18',
      ram: '8 GB',
      storage: '128 GB',
      battery: '3561 mAh',
      camera: '48MP + 12MP'
    }
  },
  {
    id: 18,
    name: 'iPhone 16 Plus',
    brand: 'Apple',
    price: 25990000,
    image: 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-16-plus-1.jpg',
    shortDescription: 'Màn lớn, pin tốt, phù hợp người dùng iOS thích giải trí.',
    fullDescription: 'iPhone 16 Plus phù hợp người cần màn hình lớn và pin bền nhưng không cần bản Pro.',
    description: 'iPhone 16 Plus phù hợp người cần màn hình lớn và pin bền nhưng không cần bản Pro.',
    tags: ['ios', 'big-screen', 'battery'],
    specifications: {
      display: '6.7-inch Super Retina XDR OLED',
      processor: 'Apple A18',
      ram: '8 GB',
      storage: '128 GB',
      battery: '4674 mAh',
      camera: '48MP + 12MP'
    }
  },
  {
    id: 19,
    name: 'HONOR Magic7 Pro',
    brand: 'HONOR',
    price: 24990000,
    image: 'https://fdn2.gsmarena.com/vv/pics/honor/honor-magic7-pro-1.jpg',
    shortDescription: 'Flagship mới với màn đẹp, pin bền và camera mạnh.',
    fullDescription: 'HONOR Magic7 Pro mang lại trải nghiệm cao cấp, tập trung AI và nhiếp ảnh trên di động.',
    description: 'HONOR Magic7 Pro mang lại trải nghiệm cao cấp, tập trung AI và nhiếp ảnh trên di động.',
    tags: ['flagship', 'ai', 'camera'],
    specifications: {
      display: '6.8-inch LTPO OLED 120Hz',
      processor: 'Snapdragon 8 Elite',
      ram: '12 GB',
      storage: '512 GB',
      battery: '5850 mAh',
      camera: '50MP + 200MP + 50MP'
    }
  },
  {
    id: 20,
    name: 'Huawei Pura 70 Ultra',
    brand: 'Huawei',
    price: 26990000,
    image: 'https://fdn2.gsmarena.com/vv/pics/huawei/huawei-pura70-ultra-1.jpg',
    shortDescription: 'Camera flagship độc đáo, thiết kế cao cấp.',
    fullDescription: 'Pura 70 Ultra nổi bật camera cảm biến lớn và chất ảnh ấn tượng, phù hợp người mê nhiếp ảnh.',
    description: 'Pura 70 Ultra nổi bật camera cảm biến lớn và chất ảnh ấn tượng, phù hợp người mê nhiếp ảnh.',
    tags: ['camera', 'flagship', 'premium'],
    specifications: {
      display: '6.8-inch LTPO OLED 120Hz',
      processor: 'Kirin 9010',
      ram: '16 GB',
      storage: '512 GB',
      battery: '5200 mAh',
      camera: '50MP + 50MP + 40MP'
    }
  }
];

module.exports = phones;
