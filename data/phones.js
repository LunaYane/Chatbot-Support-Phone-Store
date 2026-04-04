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
    name: 'Samsung Galaxy Z Fold6',
    brand: 'Samsung',
    price: 39990000,
    image: 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-z-fold6-1.jpg',
    shortDescription: 'Điện thoại gập cao cấp cho trải nghiệm đa nhiệm flagship.',
    fullDescription: 'Galaxy Z Fold6 phù hợp người dùng cần màn hình lớn dạng tablet, đa nhiệm mạnh và trải nghiệm cao cấp.',
    description: 'Galaxy Z Fold6 phù hợp người dùng cần màn hình lớn dạng tablet, đa nhiệm mạnh và trải nghiệm cao cấp.',
    tags: ['foldable', 'flagship', 'premium'],
    specifications: {
      display: '7.6-inch Dynamic LTPO AMOLED 2X 120Hz',
      processor: 'Snapdragon 8 Gen 3 for Galaxy',
      ram: '12 GB',
      storage: '256 GB',
      battery: '4400 mAh',
      camera: '50MP + 10MP + 12MP'
    }
  },
  {
    id: 4,
    name: 'Samsung Galaxy Z Flip6',
    brand: 'Samsung',
    price: 26990000,
    image: 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-z-flip6-1.jpg',
    shortDescription: 'Smartphone gập vỏ sò thời trang, cấu hình mạnh.',
    fullDescription: 'Galaxy Z Flip6 phù hợp người dùng trẻ thích thiết kế gập độc đáo, camera ổn và hiệu năng cao cấp.',
    description: 'Galaxy Z Flip6 phù hợp người dùng trẻ thích thiết kế gập độc đáo, camera ổn và hiệu năng cao cấp.',
    tags: ['foldable', 'style', 'flagship'],
    specifications: {
      display: '6.7-inch Dynamic LTPO AMOLED 2X 120Hz',
      processor: 'Snapdragon 8 Gen 3 for Galaxy',
      ram: '12 GB',
      storage: '256 GB',
      battery: '4000 mAh',
      camera: '50MP + 12MP'
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
    name: 'Xiaomi 14 Ultra',
    brand: 'Xiaomi',
    price: 27990000,
    image: 'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-14-ultra-1.jpg',
    shortDescription: 'Flagship camera phone Leica rất hot ở phân khúc cao cấp.',
    fullDescription: 'Xiaomi 14 Ultra nổi bật với camera Leica mạnh, hiệu năng cao và màn hình đẹp cho nhu cầu sáng tạo nội dung.',
    description: 'Xiaomi 14 Ultra nổi bật với camera Leica mạnh, hiệu năng cao và màn hình đẹp cho nhu cầu sáng tạo nội dung.',
    tags: ['leica', 'camera', 'flagship'],
    specifications: {
      display: '6.73-inch LTPO AMOLED 120Hz',
      processor: 'Snapdragon 8 Gen 3',
      ram: '16 GB',
      storage: '512 GB',
      battery: '5000 mAh',
      camera: '50MP + 50MP + 50MP + 50MP'
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
    name: 'OPPO Find X8',
    brand: 'OPPO',
    price: 22990000,
    image: 'https://fdn2.gsmarena.com/vv/pics/oppo/oppo-find-x8-1.jpg',
    shortDescription: 'Flagship OPPO mới với thiết kế đẹp và camera chất lượng.',
    fullDescription: 'Find X8 phù hợp người muốn flagship cân bằng giữa camera, pin và hiệu năng cao.',
    description: 'Find X8 phù hợp người muốn flagship cân bằng giữa camera, pin và hiệu năng cao.',
    tags: ['flagship', 'camera', 'premium'],
    specifications: {
      display: '6.59-inch LTPO AMOLED 120Hz',
      processor: 'MediaTek Dimensity 9400',
      ram: '12 GB',
      storage: '256 GB',
      battery: '5630 mAh',
      camera: '50MP + 50MP + 50MP'
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
    name: 'Xiaomi POCO F6 Pro',
    brand: 'Xiaomi',
    price: 11990000,
    image: 'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-poco-f6-pro-1.jpg',
    shortDescription: 'Hiệu năng cao trong tầm giá, rất hợp game thủ sinh viên.',
    fullDescription: 'POCO F6 Pro tập trung sức mạnh chip, màn đẹp và sạc nhanh để tối ưu trải nghiệm chơi game/giải trí.',
    description: 'POCO F6 Pro tập trung sức mạnh chip, màn đẹp và sạc nhanh để tối ưu trải nghiệm chơi game/giải trí.',
    tags: ['midrange', 'gaming', 'value'],
    specifications: {
      display: '6.67-inch AMOLED 120Hz',
      processor: 'Snapdragon 8 Gen 2',
      ram: '12 GB',
      storage: '256 GB',
      battery: '5000 mAh',
      camera: '50MP + 8MP + 2MP'
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
  },
  {
    id: 21,
    name: 'Samsung Galaxy A55 5G',
    brand: 'Samsung',
    price: 9490000,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80',
    shortDescription: 'Tầm trung quốc dân, màn đẹp và pin khỏe.',
    fullDescription: 'Galaxy A55 phù hợp học tập, làm việc và giải trí hằng ngày với màn AMOLED và pin bền.',
    description: 'Galaxy A55 phù hợp học tập, làm việc và giải trí hằng ngày với màn AMOLED và pin bền.',
    tags: ['midrange', 'popular', 'battery'],
    specifications: {
      display: '6.6-inch Super AMOLED 120Hz',
      processor: 'Exynos 1480',
      ram: '8 GB',
      storage: '128 GB',
      battery: '5000 mAh',
      camera: '50MP + 12MP + 5MP'
    }
  },
  {
    id: 22,
    name: 'Samsung Galaxy S24 FE',
    brand: 'Samsung',
    price: 14990000,
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=1000&q=80',
    shortDescription: 'Fan Edition cấu hình mạnh, giá dễ chịu.',
    fullDescription: 'S24 FE là lựa chọn hợp lý cho người muốn hiệu năng gần flagship nhưng tối ưu chi phí.',
    description: 'S24 FE là lựa chọn hợp lý cho người muốn hiệu năng gần flagship nhưng tối ưu chi phí.',
    tags: ['fan-edition', 'performance', 'value'],
    specifications: {
      display: '6.7-inch Dynamic AMOLED 2X 120Hz',
      processor: 'Exynos 2400e',
      ram: '8 GB',
      storage: '256 GB',
      battery: '4700 mAh',
      camera: '50MP + 8MP + 12MP'
    }
  },
  {
    id: 23,
    name: 'Xiaomi 14T Pro',
    brand: 'Xiaomi',
    price: 15990000,
    image: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&w=1000&q=80',
    shortDescription: 'Hiệu năng mạnh, camera tốt, sạc siêu nhanh.',
    fullDescription: 'Xiaomi 14T Pro phù hợp game thủ và người thích chụp ảnh với mức giá cạnh tranh.',
    description: 'Xiaomi 14T Pro phù hợp game thủ và người thích chụp ảnh với mức giá cạnh tranh.',
    tags: ['performance', 'fast-charge', 'camera'],
    specifications: {
      display: '6.67-inch AMOLED 144Hz',
      processor: 'Dimensity 9300+',
      ram: '12 GB',
      storage: '256 GB',
      battery: '5000 mAh',
      camera: '50MP + 50MP + 12MP'
    }
  },
  {
    id: 24,
    name: 'Xiaomi Redmi Note 13 Pro',
    brand: 'Xiaomi',
    price: 7490000,
    image: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=1000&q=80',
    shortDescription: 'Giá mềm, màn đẹp, camera ổn cho sinh viên.',
    fullDescription: 'Redmi Note 13 Pro cân bằng tốt cho người cần máy bền, chụp ảnh ổn và pin lâu.',
    description: 'Redmi Note 13 Pro cân bằng tốt cho người cần máy bền, chụp ảnh ổn và pin lâu.',
    tags: ['student', 'midrange', 'value'],
    specifications: {
      display: '6.67-inch AMOLED 120Hz',
      processor: 'Snapdragon 7s Gen 2',
      ram: '8 GB',
      storage: '256 GB',
      battery: '5100 mAh',
      camera: '200MP + 8MP + 2MP'
    }
  },
  {
    id: 25,
    name: 'OPPO Reno12 Pro',
    brand: 'OPPO',
    price: 13990000,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80',
    shortDescription: 'Thiết kế mỏng nhẹ, camera chân dung đẹp.',
    fullDescription: 'Reno12 Pro phù hợp người thích máy đẹp, chụp ảnh chân dung ổn và dùng mượt.',
    description: 'Reno12 Pro phù hợp người thích máy đẹp, chụp ảnh chân dung ổn và dùng mượt.',
    tags: ['camera', 'style', 'midrange'],
    specifications: {
      display: '6.7-inch AMOLED 120Hz',
      processor: 'Dimensity 7300',
      ram: '12 GB',
      storage: '256 GB',
      battery: '5000 mAh',
      camera: '50MP + 8MP + 50MP'
    }
  },
  {
    id: 26,
    name: 'vivo V40',
    brand: 'vivo',
    price: 12990000,
    image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=1000&q=80',
    shortDescription: 'Màn đẹp, selfie ngon, pin bền.',
    fullDescription: 'vivo V40 là lựa chọn tốt cho người hay chụp ảnh và cần pin dùng lâu cả ngày.',
    description: 'vivo V40 là lựa chọn tốt cho người hay chụp ảnh và cần pin dùng lâu cả ngày.',
    tags: ['selfie', 'camera', 'battery'],
    specifications: {
      display: '6.78-inch AMOLED 120Hz',
      processor: 'Snapdragon 7 Gen 3',
      ram: '12 GB',
      storage: '256 GB',
      battery: '5500 mAh',
      camera: '50MP + 50MP'
    }
  },
  {
    id: 27,
    name: 'Google Pixel 8a',
    brand: 'Google',
    price: 12990000,
    image: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&w=1000&q=80',
    shortDescription: 'Pixel giá tốt, chụp ảnh đẹp, Android thuần.',
    fullDescription: 'Pixel 8a phù hợp người yêu Android gọn gàng và thích chụp ảnh point-and-shoot.',
    description: 'Pixel 8a phù hợp người yêu Android gọn gàng và thích chụp ảnh point-and-shoot.',
    tags: ['pixel', 'camera', 'value'],
    specifications: {
      display: '6.1-inch OLED 120Hz',
      processor: 'Google Tensor G3',
      ram: '8 GB',
      storage: '128 GB',
      battery: '4492 mAh',
      camera: '64MP + 13MP'
    }
  },
  {
    id: 28,
    name: 'OnePlus Nord 4',
    brand: 'OnePlus',
    price: 10990000,
    image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=1000&q=80',
    shortDescription: 'Máy tầm trung mượt, pin trâu, sạc nhanh.',
    fullDescription: 'Nord 4 cho trải nghiệm ổn định, giao diện nhẹ và hiệu năng tốt trong tầm giá.',
    description: 'Nord 4 cho trải nghiệm ổn định, giao diện nhẹ và hiệu năng tốt trong tầm giá.',
    tags: ['midrange', 'battery', 'fast-charge'],
    specifications: {
      display: '6.74-inch AMOLED 120Hz',
      processor: 'Snapdragon 7+ Gen 3',
      ram: '8 GB',
      storage: '256 GB',
      battery: '5500 mAh',
      camera: '50MP + 8MP'
    }
  },
  {
    id: 29,
    name: 'HONOR 200 Pro',
    brand: 'HONOR',
    price: 13990000,
    image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=1000&q=80',
    shortDescription: 'Chụp chân dung đẹp, màn hình sáng, pin tốt.',
    fullDescription: 'HONOR 200 Pro hướng tới người dùng thích camera portrait và thiết kế cao cấp.',
    description: 'HONOR 200 Pro hướng tới người dùng thích camera portrait và thiết kế cao cấp.',
    tags: ['camera', 'portrait', 'midrange'],
    specifications: {
      display: '6.78-inch OLED 120Hz',
      processor: 'Snapdragon 8s Gen 3',
      ram: '12 GB',
      storage: '512 GB',
      battery: '5200 mAh',
      camera: '50MP + 50MP + 12MP'
    }
  },
  {
    id: 30,
    name: 'Huawei Nova 13 Pro',
    brand: 'Huawei',
    price: 14990000,
    image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=1000&q=80',
    shortDescription: 'Máy đẹp, selfie tốt, pin bền.',
    fullDescription: 'Nova 13 Pro phù hợp người dùng trẻ, cần ngoại hình đẹp và camera selfie chất lượng.',
    description: 'Nova 13 Pro phù hợp người dùng trẻ, cần ngoại hình đẹp và camera selfie chất lượng.',
    tags: ['selfie', 'style', 'midrange'],
    specifications: {
      display: '6.76-inch OLED 120Hz',
      processor: 'Kirin 9010 Lite',
      ram: '12 GB',
      storage: '256 GB',
      battery: '5000 mAh',
      camera: '50MP + 12MP + 8MP'
    }
  },
  {
    id: 31,
    name: 'ASUS Zenfone 11 Ultra',
    brand: 'ASUS',
    price: 23990000,
    image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=1000&q=80',
    shortDescription: 'Flagship Android mượt, pin khỏe, camera ổn.',
    fullDescription: 'Zenfone 11 Ultra cân bằng giữa hiệu năng mạnh, màn đẹp và pin tốt cho người dùng cao cấp.',
    description: 'Zenfone 11 Ultra cân bằng giữa hiệu năng mạnh, màn đẹp và pin tốt cho người dùng cao cấp.',
    tags: ['flagship', 'performance', 'battery'],
    specifications: {
      display: '6.78-inch AMOLED 144Hz',
      processor: 'Snapdragon 8 Gen 3',
      ram: '12 GB',
      storage: '256 GB',
      battery: '5500 mAh',
      camera: '50MP + 13MP + 32MP'
    }
  },
  {
    id: 32,
    name: 'iPhone 15',
    brand: 'Apple',
    price: 18990000,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80',
    shortDescription: 'iPhone đời gần mới, tối ưu giá/hiệu năng.',
    fullDescription: 'iPhone 15 vẫn rất mạnh cho đa số nhu cầu, camera tốt và pin ổn định.',
    description: 'iPhone 15 vẫn rất mạnh cho đa số nhu cầu, camera tốt và pin ổn định.',
    tags: ['ios', 'value', 'popular'],
    specifications: {
      display: '6.1-inch Super Retina XDR OLED',
      processor: 'Apple A16 Bionic',
      ram: '6 GB',
      storage: '128 GB',
      battery: '3349 mAh',
      camera: '48MP + 12MP'
    }
  },
  {
    id: 33,
    name: 'iPhone 15 Plus',
    brand: 'Apple',
    price: 21990000,
    image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=1000&q=80',
    shortDescription: 'Màn lớn, pin trâu, phù hợp giải trí.',
    fullDescription: 'iPhone 15 Plus thích hợp người dùng iOS muốn pin lâu và màn hình to dễ xem phim/chơi game.',
    description: 'iPhone 15 Plus thích hợp người dùng iOS muốn pin lâu và màn hình to dễ xem phim/chơi game.',
    tags: ['ios', 'battery', 'big-screen'],
    specifications: {
      display: '6.7-inch Super Retina XDR OLED',
      processor: 'Apple A16 Bionic',
      ram: '6 GB',
      storage: '128 GB',
      battery: '4383 mAh',
      camera: '48MP + 12MP'
    }
  },
  {
    id: 34,
    name: 'MacBook Air M3 13',
    brand: 'Apple',
    price: 27990000,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=80',
    shortDescription: 'Laptop mỏng nhẹ, pin lâu, làm việc văn phòng cực ổn.',
    fullDescription: 'MacBook Air M3 phù hợp sinh viên và dân văn phòng cần laptop nhẹ, mượt, ổn định.',
    description: 'MacBook Air M3 phù hợp sinh viên và dân văn phòng cần laptop nhẹ, mượt, ổn định.',
    tags: ['laptop', 'ultrabook', 'student'],
    specifications: {
      display: '13.6-inch Liquid Retina',
      processor: 'Apple M3',
      ram: '8 GB',
      storage: '256 GB SSD',
      battery: '18 hours',
      camera: '1080p FaceTime HD'
    }
  },
  {
    id: 35,
    name: 'MacBook Pro M3 14',
    brand: 'Apple',
    price: 42990000,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=80',
    shortDescription: 'Laptop cao cấp cho dev, design, dựng video.',
    fullDescription: 'MacBook Pro 14 inch M3 cho hiệu năng mạnh, màn hình đẹp và pin bền cho công việc nặng.',
    description: 'MacBook Pro 14 inch M3 cho hiệu năng mạnh, màn hình đẹp và pin bền cho công việc nặng.',
    tags: ['laptop', 'pro', 'creator'],
    specifications: {
      display: '14.2-inch Liquid Retina XDR',
      processor: 'Apple M3 Pro',
      ram: '18 GB',
      storage: '512 GB SSD',
      battery: '22 hours',
      camera: '1080p FaceTime HD'
    }
  },
  {
    id: 36,
    name: 'ASUS ROG Zephyrus G16',
    brand: 'ASUS',
    price: 46990000,
    image: 'https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?auto=format&fit=crop&w=1000&q=80',
    shortDescription: 'Gaming laptop mỏng nhẹ, hiệu năng khủng.',
    fullDescription: 'ROG Zephyrus G16 phù hợp game thủ và creator cần GPU mạnh nhưng vẫn cần thiết kế gọn.',
    description: 'ROG Zephyrus G16 phù hợp game thủ và creator cần GPU mạnh nhưng vẫn cần thiết kế gọn.',
    tags: ['laptop', 'gaming', 'creator'],
    specifications: {
      display: '16-inch OLED 240Hz',
      processor: 'Intel Core Ultra 9',
      ram: '32 GB',
      storage: '1 TB SSD',
      battery: '90Wh',
      camera: '1080p IR Camera'
    }
  },
  {
    id: 37,
    name: 'ASUS Vivobook S 15 OLED',
    brand: 'ASUS',
    price: 21990000,
    image: 'https://images.unsplash.com/photo-1593642634443-44adaa06623a?auto=format&fit=crop&w=1000&q=80',
    shortDescription: 'Laptop OLED đẹp, học tập và văn phòng tốt.',
    fullDescription: 'Vivobook S 15 OLED cho chất lượng hiển thị tốt, phù hợp học tập, làm việc và giải trí.',
    description: 'Vivobook S 15 OLED cho chất lượng hiển thị tốt, phù hợp học tập, làm việc và giải trí.',
    tags: ['laptop', 'oled', 'office'],
    specifications: {
      display: '15.6-inch OLED 120Hz',
      processor: 'Intel Core Ultra 7',
      ram: '16 GB',
      storage: '512 GB SSD',
      battery: '75Wh',
      camera: '1080p Camera'
    }
  },
  {
    id: 38,
    name: 'Dell XPS 14',
    brand: 'Dell',
    price: 41990000,
    image: 'https://images.unsplash.com/photo-1522199710521-72d69614c702?auto=format&fit=crop&w=1000&q=80',
    shortDescription: 'Ultrabook cao cấp, màn đẹp, build cứng cáp.',
    fullDescription: 'Dell XPS 14 phù hợp người dùng chuyên nghiệp cần laptop sang trọng và hiệu năng tốt.',
    description: 'Dell XPS 14 phù hợp người dùng chuyên nghiệp cần laptop sang trọng và hiệu năng tốt.',
    tags: ['laptop', 'premium', 'ultrabook'],
    specifications: {
      display: '14.5-inch OLED 120Hz',
      processor: 'Intel Core Ultra 7',
      ram: '16 GB',
      storage: '1 TB SSD',
      battery: '69.5Wh',
      camera: '1080p Camera'
    }
  },
  {
    id: 39,
    name: 'Dell Inspiron 14 Plus',
    brand: 'Dell',
    price: 24990000,
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1000&q=80',
    shortDescription: 'Laptop đa dụng cho học tập, làm việc, chỉnh ảnh nhẹ.',
    fullDescription: 'Inspiron 14 Plus là mẫu laptop cân bằng tốt cho sinh viên và dân văn phòng.',
    description: 'Inspiron 14 Plus là mẫu laptop cân bằng tốt cho sinh viên và dân văn phòng.',
    tags: ['laptop', 'office', 'student'],
    specifications: {
      display: '14-inch 2.2K',
      processor: 'Intel Core Ultra 5',
      ram: '16 GB',
      storage: '512 GB SSD',
      battery: '64Wh',
      camera: '1080p Camera'
    }
  },
  {
    id: 40,
    name: 'HP Spectre x360 14',
    brand: 'HP',
    price: 35990000,
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1000&q=80',
    shortDescription: 'Laptop 2-in-1 cao cấp, linh hoạt cho công việc.',
    fullDescription: 'Spectre x360 phù hợp người cần laptop đẹp, mỏng nhẹ và có thể xoay gập dùng bút cảm ứng.',
    description: 'Spectre x360 phù hợp người cần laptop đẹp, mỏng nhẹ và có thể xoay gập dùng bút cảm ứng.',
    tags: ['laptop', '2-in-1', 'premium'],
    specifications: {
      display: '14-inch OLED Touch',
      processor: 'Intel Core Ultra 7',
      ram: '16 GB',
      storage: '1 TB SSD',
      battery: '68Wh',
      camera: '9MP IR Camera'
    }
  },
  {
    id: 41,
    name: 'HP Victus 16',
    brand: 'HP',
    price: 23990000,
    image: 'https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?auto=format&fit=crop&w=1000&q=80',
    shortDescription: 'Gaming laptop giá tốt, hiệu năng ổn.',
    fullDescription: 'HP Victus 16 đáp ứng tốt nhu cầu game phổ thông, học tập và làm việc nặng.',
    description: 'HP Victus 16 đáp ứng tốt nhu cầu game phổ thông, học tập và làm việc nặng.',
    tags: ['laptop', 'gaming', 'value'],
    specifications: {
      display: '16.1-inch 144Hz',
      processor: 'Intel Core i7-14650HX',
      ram: '16 GB',
      storage: '1 TB SSD',
      battery: '83Wh',
      camera: '1080p Camera'
    }
  },
  {
    id: 42,
    name: 'Lenovo Legion 5i',
    brand: 'Lenovo',
    price: 31990000,
    image: 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?auto=format&fit=crop&w=1000&q=80',
    shortDescription: 'Gaming laptop quốc dân, tản tốt, hiệu năng mạnh.',
    fullDescription: 'Legion 5i được đánh giá cao ở độ ổn định khi chơi game và làm việc đồ họa.',
    description: 'Legion 5i được đánh giá cao ở độ ổn định khi chơi game và làm việc đồ họa.',
    tags: ['laptop', 'gaming', 'performance'],
    specifications: {
      display: '16-inch WQXGA 165Hz',
      processor: 'Intel Core i7-14650HX',
      ram: '16 GB',
      storage: '1 TB SSD',
      battery: '80Wh',
      camera: '1080p Camera'
    }
  },
  {
    id: 43,
    name: 'Lenovo Yoga Pro 7',
    brand: 'Lenovo',
    price: 28990000,
    image: 'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?auto=format&fit=crop&w=1000&q=80',
    shortDescription: 'Laptop mỏng nhẹ, màn đẹp, pin ổn cho dân sáng tạo.',
    fullDescription: 'Yoga Pro 7 hướng tới người dùng cần máy nhẹ mà vẫn đủ sức cho công việc sáng tạo nội dung.',
    description: 'Yoga Pro 7 hướng tới người dùng cần máy nhẹ mà vẫn đủ sức cho công việc sáng tạo nội dung.',
    tags: ['laptop', 'creator', 'ultrabook'],
    specifications: {
      display: '14.5-inch 3K 120Hz',
      processor: 'AMD Ryzen 7 8845HS',
      ram: '32 GB',
      storage: '1 TB SSD',
      battery: '73Wh',
      camera: '1080p Camera'
    }
  },
  {
    id: 44,
    name: 'Acer Nitro V 15',
    brand: 'Acer',
    price: 20990000,
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80',
    shortDescription: 'Gaming laptop dễ tiếp cận cho sinh viên.',
    fullDescription: 'Nitro V 15 phù hợp người cần laptop chơi game tầm trung và làm việc đa tác vụ.',
    description: 'Nitro V 15 phù hợp người cần laptop chơi game tầm trung và làm việc đa tác vụ.',
    tags: ['laptop', 'gaming', 'student'],
    specifications: {
      display: '15.6-inch FHD 144Hz',
      processor: 'Intel Core i5-13420H',
      ram: '16 GB',
      storage: '512 GB SSD',
      battery: '57Wh',
      camera: '720p Camera'
    }
  },
  {
    id: 45,
    name: 'Acer Swift Go 14',
    brand: 'Acer',
    price: 19990000,
    image: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?auto=format&fit=crop&w=1000&q=80',
    shortDescription: 'Ultrabook mỏng nhẹ, màn OLED đẹp.',
    fullDescription: 'Swift Go 14 phù hợp cho dân văn phòng và sinh viên thích máy gọn nhẹ, pin khá.',
    description: 'Swift Go 14 phù hợp cho dân văn phòng và sinh viên thích máy gọn nhẹ, pin khá.',
    tags: ['laptop', 'ultrabook', 'office'],
    specifications: {
      display: '14-inch OLED 90Hz',
      processor: 'Intel Core Ultra 5',
      ram: '16 GB',
      storage: '512 GB SSD',
      battery: '65Wh',
      camera: '1440p Camera'
    }
  },
  {
    id: 46,
    name: 'MSI Katana 15',
    brand: 'MSI',
    price: 27990000,
    image: 'https://images.unsplash.com/photo-1640955014216-75201056c829?auto=format&fit=crop&w=1000&q=80',
    shortDescription: 'Gaming laptop hiệu năng cao, giá hợp lý.',
    fullDescription: 'MSI Katana 15 cho trải nghiệm game mượt và khả năng nâng cấp tốt trong tương lai.',
    description: 'MSI Katana 15 cho trải nghiệm game mượt và khả năng nâng cấp tốt trong tương lai.',
    tags: ['laptop', 'gaming', 'performance'],
    specifications: {
      display: '15.6-inch FHD 144Hz',
      processor: 'Intel Core i7-13620H',
      ram: '16 GB',
      storage: '1 TB SSD',
      battery: '53.5Wh',
      camera: '720p Camera'
    }
  },
  {
    id: 47,
    name: 'MSI Prestige 14 AI Studio',
    brand: 'MSI',
    price: 33990000,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1000&q=80',
    shortDescription: 'Laptop mỏng nhẹ cho công việc sáng tạo chuyên sâu.',
    fullDescription: 'Prestige 14 AI Studio phù hợp designer và content creator cần hiệu năng AI/đồ họa tốt.',
    description: 'Prestige 14 AI Studio phù hợp designer và content creator cần hiệu năng AI/đồ họa tốt.',
    tags: ['laptop', 'creator', 'ai'],
    specifications: {
      display: '14-inch QHD+',
      processor: 'Intel Core Ultra 7',
      ram: '32 GB',
      storage: '1 TB SSD',
      battery: '72Wh',
      camera: '1080p IR Camera'
    }
  },
  {
    id: 48,
    name: 'LG Gram 16',
    brand: 'LG',
    price: 31990000,
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1000&q=80',
    shortDescription: 'Laptop siêu nhẹ, pin tốt, màn lớn.',
    fullDescription: 'LG Gram 16 là lựa chọn tối ưu cho người hay di chuyển nhưng vẫn muốn màn hình rộng.',
    description: 'LG Gram 16 là lựa chọn tối ưu cho người hay di chuyển nhưng vẫn muốn màn hình rộng.',
    tags: ['laptop', 'lightweight', 'office'],
    specifications: {
      display: '16-inch WQXGA',
      processor: 'Intel Core Ultra 7',
      ram: '16 GB',
      storage: '1 TB SSD',
      battery: '80Wh',
      camera: '1080p Camera'
    }
  },
  {
    id: 49,
    name: 'Razer Blade 14',
    brand: 'Razer',
    price: 57990000,
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1000&q=80',
    shortDescription: 'Gaming laptop cao cấp, build đẹp, hiệu năng cực mạnh.',
    fullDescription: 'Razer Blade 14 dành cho game thủ cao cấp và người dùng cần thiết kế sang trọng + hiệu năng mạnh.',
    description: 'Razer Blade 14 dành cho game thủ cao cấp và người dùng cần thiết kế sang trọng + hiệu năng mạnh.',
    tags: ['laptop', 'gaming', 'premium'],
    specifications: {
      display: '14-inch QHD+ 240Hz',
      processor: 'AMD Ryzen 9 8945HS',
      ram: '32 GB',
      storage: '1 TB SSD',
      battery: '68Wh',
      camera: '1080p Camera'
    }
  },
  {
    id: 50,
    name: 'Microsoft Surface Laptop 7',
    brand: 'Microsoft',
    price: 35990000,
    image: 'https://images.unsplash.com/photo-1516387938699-a93567ec168e?auto=format&fit=crop&w=1000&q=80',
    shortDescription: 'Laptop mỏng nhẹ cao cấp cho công việc và học tập.',
    fullDescription: 'Surface Laptop 7 phù hợp người cần máy đẹp, pin tốt, bàn phím ngon và trải nghiệm Windows mượt.',
    description: 'Surface Laptop 7 phù hợp người cần máy đẹp, pin tốt, bàn phím ngon và trải nghiệm Windows mượt.',
    tags: ['laptop', 'premium', 'office'],
    specifications: {
      display: '13.8-inch PixelSense',
      processor: 'Snapdragon X Elite',
      ram: '16 GB',
      storage: '512 GB SSD',
      battery: 'up to 20 hours',
      camera: '1080p Studio Camera'
    }
  }
];

module.exports = phones;
