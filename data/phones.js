const phones = [
  {
    id: 1,
    name: 'iPhone 15 Pro',
    brand: 'Apple',
    price: 28990000,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80',
    description: 'Flagship iPhone with A17 Pro chip, premium titanium design, and excellent camera quality.',
    specifications: {
      display: '6.1-inch Super Retina XDR OLED',
      processor: 'Apple A17 Pro',
      ram: '8 GB',
      storage: '256 GB',
      battery: '3274 mAh',
      camera: '48MP + 12MP + 12MP'
    }
  },
  {
    id: 2,
    name: 'Galaxy S24 Ultra',
    brand: 'Samsung',
    price: 27990000,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=1000&q=80',
    description: 'Large AMOLED display, S Pen support, and powerful performance for work and entertainment.',
    specifications: {
      display: '6.8-inch Dynamic AMOLED 2X',
      processor: 'Snapdragon 8 Gen 3 for Galaxy',
      ram: '12 GB',
      storage: '256 GB',
      battery: '5000 mAh',
      camera: '200MP + 12MP + 50MP + 10MP'
    }
  },
  {
    id: 3,
    name: 'Xiaomi 14',
    brand: 'Xiaomi',
    price: 17990000,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1000&q=80',
    description: 'High-value flagship with smooth performance, great display, and fast charging.',
    specifications: {
      display: '6.36-inch AMOLED 120Hz',
      processor: 'Snapdragon 8 Gen 3',
      ram: '12 GB',
      storage: '256 GB',
      battery: '4610 mAh',
      camera: '50MP + 50MP + 50MP'
    }
  },
  {
    id: 4,
    name: 'OPPO Reno11',
    brand: 'OPPO',
    price: 10990000,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80',
    description: 'Stylish design, strong portrait camera, and reliable battery for daily use.',
    specifications: {
      display: '6.7-inch AMOLED 120Hz',
      processor: 'MediaTek Dimensity 7050',
      ram: '8 GB',
      storage: '256 GB',
      battery: '5000 mAh',
      camera: '50MP + 8MP + 32MP'
    }
  },
  {
    id: 5,
    name: 'vivo V30',
    brand: 'vivo',
    price: 12990000,
    image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=1000&q=80',
    description: 'Slim phone with bright display, good selfie camera, and smooth multitasking.',
    specifications: {
      display: '6.78-inch AMOLED 120Hz',
      processor: 'Snapdragon 7 Gen 3',
      ram: '12 GB',
      storage: '256 GB',
      battery: '5000 mAh',
      camera: '50MP + 50MP + 50MP'
    }
  },
  {
    id: 6,
    name: 'Google Pixel 8',
    brand: 'Google',
    price: 18990000,
    image: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&w=1000&q=80',
    description: 'Clean Android experience with strong AI features and excellent computational photography.',
    specifications: {
      display: '6.2-inch OLED 120Hz',
      processor: 'Google Tensor G3',
      ram: '8 GB',
      storage: '128 GB',
      battery: '4575 mAh',
      camera: '50MP + 12MP'
    }
  },
  {
    id: 7,
    name: 'iPhone 15',
    brand: 'Apple',
    price: 21990000,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80',
    description: 'Balanced iPhone model with great cameras and smooth iOS experience.',
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
    id: 8,
    name: 'iPhone 14 Plus',
    brand: 'Apple',
    price: 19990000,
    image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=1000&q=80',
    description: 'Large display iPhone with long battery life and dual camera system.',
    specifications: {
      display: '6.7-inch Super Retina XDR OLED',
      processor: 'Apple A15 Bionic',
      ram: '6 GB',
      storage: '128 GB',
      battery: '4323 mAh',
      camera: '12MP + 12MP'
    }
  },
  {
    id: 9,
    name: 'Galaxy S24',
    brand: 'Samsung',
    price: 21990000,
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=1000&q=80',
    description: 'Compact flagship from Samsung with premium performance and camera.',
    specifications: {
      display: '6.2-inch Dynamic AMOLED 2X',
      processor: 'Exynos 2400',
      ram: '8 GB',
      storage: '256 GB',
      battery: '4000 mAh',
      camera: '50MP + 12MP + 10MP'
    }
  },
  {
    id: 10,
    name: 'Galaxy A55 5G',
    brand: 'Samsung',
    price: 9990000,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80',
    description: 'Popular mid-range phone with premium metal frame and great battery life.',
    specifications: {
      display: '6.6-inch Super AMOLED 120Hz',
      processor: 'Exynos 1480',
      ram: '8 GB',
      storage: '256 GB',
      battery: '5000 mAh',
      camera: '50MP + 12MP + 5MP'
    }
  },
  {
    id: 11,
    name: 'Xiaomi 13T Pro',
    brand: 'Xiaomi',
    price: 13990000,
    image: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&w=1000&q=80',
    description: 'Strong performance and Leica-tuned camera in a value flagship package.',
    specifications: {
      display: '6.67-inch AMOLED 144Hz',
      processor: 'MediaTek Dimensity 9200+',
      ram: '12 GB',
      storage: '512 GB',
      battery: '5000 mAh',
      camera: '50MP + 50MP + 12MP'
    }
  },
  {
    id: 12,
    name: 'Redmi Note 13 Pro+',
    brand: 'Xiaomi',
    price: 10990000,
    image: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=1000&q=80',
    description: 'Curved display phone with 200MP camera and fast charging.',
    specifications: {
      display: '6.67-inch AMOLED 120Hz',
      processor: 'MediaTek Dimensity 7200 Ultra',
      ram: '12 GB',
      storage: '512 GB',
      battery: '5000 mAh',
      camera: '200MP + 8MP + 2MP'
    }
  },
  {
    id: 13,
    name: 'OPPO Find X7',
    brand: 'OPPO',
    price: 20990000,
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1000&q=80',
    description: 'Premium OPPO phone with flagship camera and elegant design.',
    specifications: {
      display: '6.78-inch AMOLED 120Hz',
      processor: 'MediaTek Dimensity 9300',
      ram: '12 GB',
      storage: '256 GB',
      battery: '5000 mAh',
      camera: '50MP + 50MP + 64MP'
    }
  },
  {
    id: 14,
    name: 'OPPO A79 5G',
    brand: 'OPPO',
    price: 7290000,
    image: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&w=1000&q=80',
    description: 'Budget 5G smartphone suitable for daily social, study, and streaming needs.',
    specifications: {
      display: '6.72-inch LCD 90Hz',
      processor: 'MediaTek Dimensity 6020',
      ram: '8 GB',
      storage: '256 GB',
      battery: '5000 mAh',
      camera: '50MP + 2MP'
    }
  },
  {
    id: 15,
    name: 'vivo X100',
    brand: 'vivo',
    price: 20990000,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1000&q=80',
    description: 'Camera-focused flagship with ZEISS optics and smooth display.',
    specifications: {
      display: '6.78-inch AMOLED 120Hz',
      processor: 'MediaTek Dimensity 9300',
      ram: '12 GB',
      storage: '256 GB',
      battery: '5000 mAh',
      camera: '50MP + 64MP + 50MP'
    }
  },
  {
    id: 16,
    name: 'vivo Y100 5G',
    brand: 'vivo',
    price: 7990000,
    image: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&w=1000&q=80',
    description: 'Affordable 5G phone with slim design and good battery backup.',
    specifications: {
      display: '6.67-inch AMOLED 120Hz',
      processor: 'Snapdragon 4 Gen 2',
      ram: '8 GB',
      storage: '256 GB',
      battery: '5000 mAh',
      camera: '50MP + 2MP'
    }
  },
  {
    id: 17,
    name: 'Google Pixel 8 Pro',
    brand: 'Google',
    price: 24990000,
    image: 'https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?auto=format&fit=crop&w=1000&q=80',
    description: 'Google flagship with top camera AI features and pure Android updates.',
    specifications: {
      display: '6.7-inch LTPO OLED 120Hz',
      processor: 'Google Tensor G3',
      ram: '12 GB',
      storage: '128 GB',
      battery: '5050 mAh',
      camera: '50MP + 48MP + 48MP'
    }
  },
  {
    id: 18,
    name: 'Google Pixel 7a',
    brand: 'Google',
    price: 10990000,
    image: 'https://images.unsplash.com/photo-1598327106026-d9521da673d1?auto=format&fit=crop&w=1000&q=80',
    description: 'Mid-range Pixel with excellent camera performance and clean software.',
    specifications: {
      display: '6.1-inch OLED 90Hz',
      processor: 'Google Tensor G2',
      ram: '8 GB',
      storage: '128 GB',
      battery: '4385 mAh',
      camera: '64MP + 13MP'
    }
  },
  {
    id: 19,
    name: 'OnePlus 12',
    brand: 'OnePlus',
    price: 21990000,
    image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=1000&q=80',
    description: 'Fast and fluid flagship with strong battery and rapid charging.',
    specifications: {
      display: '6.82-inch LTPO AMOLED 120Hz',
      processor: 'Snapdragon 8 Gen 3',
      ram: '16 GB',
      storage: '512 GB',
      battery: '5400 mAh',
      camera: '50MP + 64MP + 48MP'
    }
  },
  {
    id: 20,
    name: 'OnePlus Nord CE 4',
    brand: 'OnePlus',
    price: 8990000,
    image: 'https://images.unsplash.com/photo-1600086827875-a63b01f1335c?auto=format&fit=crop&w=1000&q=80',
    description: 'Solid daily phone with big battery and smooth OxygenOS experience.',
    specifications: {
      display: '6.7-inch AMOLED 120Hz',
      processor: 'Snapdragon 7 Gen 3',
      ram: '8 GB',
      storage: '256 GB',
      battery: '5500 mAh',
      camera: '50MP + 8MP'
    }
  },
  {
    id: 21,
    name: 'realme GT 6',
    brand: 'realme',
    price: 12990000,
    image: 'https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00?auto=format&fit=crop&w=1000&q=80',
    description: 'Performance-focused phone with bright display and fast charging.',
    specifications: {
      display: '6.78-inch AMOLED 120Hz',
      processor: 'Snapdragon 8s Gen 3',
      ram: '12 GB',
      storage: '256 GB',
      battery: '5500 mAh',
      camera: '50MP + 8MP'
    }
  },
  {
    id: 22,
    name: 'realme 12 Pro+',
    brand: 'realme',
    price: 10990000,
    image: 'https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=1000&q=80',
    description: 'Stylish mid-range phone with periscope camera and premium look.',
    specifications: {
      display: '6.7-inch AMOLED 120Hz',
      processor: 'Snapdragon 7s Gen 2',
      ram: '12 GB',
      storage: '256 GB',
      battery: '5000 mAh',
      camera: '50MP + 64MP + 8MP'
    }
  },
  {
    id: 23,
    name: 'Nokia G42 5G',
    brand: 'Nokia',
    price: 5990000,
    image: 'https://images.unsplash.com/photo-1533228876829-65c94e7b5025?auto=format&fit=crop&w=1000&q=80',
    description: 'Durable and affordable 5G phone with clean Android experience.',
    specifications: {
      display: '6.56-inch LCD 90Hz',
      processor: 'Snapdragon 480+',
      ram: '6 GB',
      storage: '128 GB',
      battery: '5000 mAh',
      camera: '50MP + 2MP + 2MP'
    }
  },
  {
    id: 24,
    name: 'Nokia X30',
    brand: 'Nokia',
    price: 9990000,
    image: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1000&q=80',
    description: 'Eco-friendly design phone with OLED display and stable performance.',
    specifications: {
      display: '6.43-inch AMOLED 90Hz',
      processor: 'Snapdragon 695',
      ram: '8 GB',
      storage: '256 GB',
      battery: '4200 mAh',
      camera: '50MP + 13MP'
    }
  },
  {
    id: 25,
    name: 'Sony Xperia 1 V',
    brand: 'Sony',
    price: 26990000,
    image: 'https://images.unsplash.com/photo-1525598912003-663126343e1f?auto=format&fit=crop&w=1000&q=80',
    description: 'Premium multimedia phone with 4K display and pro camera controls.',
    specifications: {
      display: '6.5-inch 4K OLED 120Hz',
      processor: 'Snapdragon 8 Gen 2',
      ram: '12 GB',
      storage: '256 GB',
      battery: '5000 mAh',
      camera: '48MP + 12MP + 12MP'
    }
  },
  {
    id: 26,
    name: 'ASUS ROG Phone 8',
    brand: 'ASUS',
    price: 24990000,
    image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=1000&q=80',
    description: 'Gaming powerhouse with advanced cooling and ultra-smooth display.',
    specifications: {
      display: '6.78-inch AMOLED 165Hz',
      processor: 'Snapdragon 8 Gen 3',
      ram: '16 GB',
      storage: '512 GB',
      battery: '5500 mAh',
      camera: '50MP + 13MP + 32MP'
    }
  },
  {
    id: 27,
    name: 'Honor Magic6 Pro',
    brand: 'Honor',
    price: 22990000,
    image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=1000&q=80',
    description: 'Flagship with powerful camera zoom and premium curved display.',
    specifications: {
      display: '6.8-inch LTPO OLED 120Hz',
      processor: 'Snapdragon 8 Gen 3',
      ram: '12 GB',
      storage: '512 GB',
      battery: '5600 mAh',
      camera: '50MP + 180MP + 50MP'
    }
  },
  {
    id: 28,
    name: 'Huawei Pura 70',
    brand: 'Huawei',
    price: 19990000,
    image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=1000&q=80',
    description: 'Elegant flagship with strong camera processing and premium build.',
    specifications: {
      display: '6.6-inch OLED 120Hz',
      processor: 'Kirin 9000S1',
      ram: '12 GB',
      storage: '256 GB',
      battery: '4900 mAh',
      camera: '50MP + 13MP + 12MP'
    }
  },
  {
    id: 29,
    name: 'Motorola Edge 50 Pro',
    brand: 'Motorola',
    price: 11990000,
    image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=1000&q=80',
    description: 'Slim and stylish phone with fast charging and vivid pOLED display.',
    specifications: {
      display: '6.7-inch pOLED 144Hz',
      processor: 'Snapdragon 7 Gen 3',
      ram: '12 GB',
      storage: '256 GB',
      battery: '4500 mAh',
      camera: '50MP + 13MP + 10MP'
    }
  },
  {
    id: 30,
    name: 'Infinix Note 40 Pro',
    brand: 'Infinix',
    price: 7490000,
    image: 'https://images.unsplash.com/photo-1574672280600-4aec8453f2b4?auto=format&fit=crop&w=1000&q=80',
    description: 'Affordable phone with curved AMOLED display and decent performance.',
    specifications: {
      display: '6.78-inch AMOLED 120Hz',
      processor: 'MediaTek Helio G99 Ultimate',
      ram: '8 GB',
      storage: '256 GB',
      battery: '5000 mAh',
      camera: '108MP + 2MP + 2MP'
    }
  }
];

module.exports = phones;
