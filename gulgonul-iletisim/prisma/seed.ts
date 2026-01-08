import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const phones = [
    {
        name: 'iPhone 15 Pro Max',
        description: 'Apple A17 Pro çip, 48MP ana kamera, Titanium tasarım. En güçlü iPhone deneyimi.',
        price: 72999,
        category: 'PHONE',
        condition: 'NEW',
        storage: '256GB',
        ram: '8GB',
        batteryHealth: '100',
        images: JSON.stringify(['/images/iphone15pro.png'])
    },
    {
        name: 'iPhone 15 Pro',
        description: 'A17 Pro çip, ProMotion ekran, Titanium gövde. Profesyonel performans.',
        price: 64999,
        category: 'PHONE',
        condition: 'NEW',
        storage: '128GB',
        ram: '8GB',
        batteryHealth: '100',
        images: JSON.stringify(['/images/iphone15pro.png'])
    },
    {
        name: 'iPhone 14 Pro Max',
        description: 'Dynamic Island, 48MP kamera sistemi, A16 Bionic çip. Deep Purple renk.',
        price: 54999,
        category: 'PHONE',
        condition: 'NEW',
        storage: '256GB',
        ram: '6GB',
        batteryHealth: '100',
        images: JSON.stringify(['/images/iphone14pro.png'])
    },
    {
        name: 'iPhone 14 Pro',
        description: 'Dynamic Island özelliği, Always-On display, ProRes video.',
        price: 47999,
        category: 'PHONE',
        condition: 'USED',
        storage: '128GB',
        ram: '6GB',
        batteryHealth: '92',
        images: JSON.stringify(['/images/iphone14pro.png'])
    },
    {
        name: 'iPhone 13 Pro Max',
        description: 'A15 Bionic, ProMotion 120Hz ekran, 3 kameralı sistem.',
        price: 38999,
        category: 'PHONE',
        condition: 'USED',
        storage: '256GB',
        ram: '6GB',
        batteryHealth: '88',
        images: JSON.stringify(['/images/iphone14pro.png'])
    },
    {
        name: 'Samsung Galaxy S24 Ultra',
        description: 'Snapdragon 8 Gen 3, 200MP kamera, S Pen dahil. Galaxy AI özellikleri.',
        price: 69999,
        category: 'PHONE',
        condition: 'NEW',
        storage: '512GB',
        ram: '12GB',
        batteryHealth: '100',
        images: JSON.stringify(['/images/samsung_s24.png'])
    },
    {
        name: 'Samsung Galaxy S24+',
        description: 'Galaxy AI, 50MP üçlü kamera, 4900mAh pil. Akıllı deneyim.',
        price: 52999,
        category: 'PHONE',
        condition: 'NEW',
        storage: '256GB',
        ram: '12GB',
        batteryHealth: '100',
        images: JSON.stringify(['/images/samsung_s24.png'])
    },
    {
        name: 'Samsung Galaxy S23 Ultra',
        description: '200MP kamera, S Pen, Snapdragon 8 Gen 2. Phantom Black.',
        price: 44999,
        category: 'PHONE',
        condition: 'USED',
        storage: '256GB',
        ram: '8GB',
        batteryHealth: '94',
        images: JSON.stringify(['/images/samsung_s24.png'])
    },
    {
        name: 'Xiaomi 14 Ultra',
        description: 'Leica kamera sistemi, Snapdragon 8 Gen 3, 90W hızlı şarj.',
        price: 42999,
        category: 'PHONE',
        condition: 'NEW',
        storage: '512GB',
        ram: '16GB',
        batteryHealth: '100',
        images: JSON.stringify(['/images/xiaomi14.png'])
    },
    {
        name: 'Xiaomi 13 Pro',
        description: 'Leica optikleri, Snapdragon 8 Gen 2, AMOLED ekran.',
        price: 32999,
        category: 'PHONE',
        condition: 'NEW',
        storage: '256GB',
        ram: '12GB',
        batteryHealth: '100',
        images: JSON.stringify(['/images/xiaomi14.png'])
    },
    {
        name: 'Xiaomi Redmi Note 13 Pro+',
        description: '200MP kamera, 120W HyperCharge, AMOLED ekran. Uygun fiyat.',
        price: 14999,
        category: 'PHONE',
        condition: 'NEW',
        storage: '256GB',
        ram: '8GB',
        batteryHealth: '100',
        images: JSON.stringify(['/images/xiaomi14.png'])
    },
    {
        name: 'iPhone 12 Pro',
        description: 'A14 Bionic, LiDAR Scanner, Ceramic Shield. Pacific Blue.',
        price: 24999,
        category: 'PHONE',
        condition: 'USED',
        storage: '128GB',
        ram: '6GB',
        batteryHealth: '85',
        images: JSON.stringify(['/images/iphone14pro.png'])
    }
]

const accessories = [
    {
        name: 'Apple AirPods Pro 2',
        description: 'Aktif Gürültü Engelleme, H2 çip, MagSafe şarj kutusu. Premium ses deneyimi.',
        price: 8499,
        category: 'ACCESSORY',
        subCategory: 'HEADPHONE',
        condition: 'NEW',
        stock: 25,
        images: JSON.stringify(['/images/airpods.png'])
    },
    {
        name: 'Apple AirPods 3. Nesil',
        description: 'Spatial Audio, IPX4 su dayanıklılığı, 30 saat pil ömrü.',
        price: 5999,
        category: 'ACCESSORY',
        subCategory: 'HEADPHONE',
        condition: 'NEW',
        stock: 30,
        images: JSON.stringify(['/images/airpods.png'])
    },
    {
        name: 'Samsung Galaxy Buds2 Pro',
        description: '360 Audio, aktif gürültü engelleme, IPX7 su dayanıklılığı.',
        price: 4299,
        category: 'ACCESSORY',
        subCategory: 'HEADPHONE',
        condition: 'NEW',
        stock: 20,
        images: JSON.stringify(['/images/airpods.png'])
    },
    {
        name: 'Premium Silikon Kılıf - iPhone 15',
        description: 'MagSafe uyumlu, yumuşak microfiber astar, şık tasarım.',
        price: 399,
        category: 'ACCESSORY',
        subCategory: 'CASE',
        condition: 'NEW',
        stock: 100,
        images: JSON.stringify(['/images/phone_case.png'])
    },
    {
        name: 'Darbeye Dayanıklı Kılıf - Samsung S24',
        description: 'Askeri standart MIL-STD-810G, şeffaf arka, yükseltilmiş kenarlar.',
        price: 299,
        category: 'ACCESSORY',
        subCategory: 'CASE',
        condition: 'NEW',
        stock: 80,
        images: JSON.stringify(['/images/phone_case.png'])
    },
    {
        name: 'Cüzdan Kılıf - iPhone 14',
        description: 'Gerçek deri, 3 kart yuvası, manyetik kapak.',
        price: 549,
        category: 'ACCESSORY',
        subCategory: 'CASE',
        condition: 'NEW',
        stock: 45,
        images: JSON.stringify(['/images/phone_case.png'])
    },
    {
        name: '65W USB-C Hızlı Şarj Adaptörü',
        description: 'GaN teknolojisi, kompakt tasarım, laptop ve telefon uyumlu.',
        price: 899,
        category: 'ACCESSORY',
        subCategory: 'CHARGER',
        condition: 'NEW',
        stock: 60,
        images: JSON.stringify(['/images/charger.png'])
    },
    {
        name: '20W Apple USB-C Adaptör',
        description: 'Orijinal Apple, hızlı şarj desteği, kompakt.',
        price: 749,
        category: 'ACCESSORY',
        subCategory: 'CHARGER',
        condition: 'NEW',
        stock: 50,
        images: JSON.stringify(['/images/charger.png'])
    },
    {
        name: 'MagSafe Kablosuz Şarj Cihazı',
        description: '15W hızlı kablosuz şarj, manyetik hizalama.',
        price: 1299,
        category: 'ACCESSORY',
        subCategory: 'CHARGER',
        condition: 'NEW',
        stock: 35,
        images: JSON.stringify(['/images/charger.png'])
    },
    {
        name: 'Temperli Cam Ekran Koruyucu - iPhone 15',
        description: '9H sertlik, parmak izi önleyici kaplama, kolay uygulama.',
        price: 149,
        category: 'ACCESSORY',
        subCategory: 'SCREEN_PROTECTOR',
        condition: 'NEW',
        stock: 200,
        images: JSON.stringify(['/images/screen_protector.png'])
    },
    {
        name: 'Privacy Ekran Koruyucu',
        description: 'Gizlilik filtresi, 28° görüş açısı, anti-spy özellik.',
        price: 249,
        category: 'ACCESSORY',
        subCategory: 'SCREEN_PROTECTOR',
        condition: 'NEW',
        stock: 75,
        images: JSON.stringify(['/images/screen_protector.png'])
    },
    {
        name: 'UV Ekran Koruyucu - Samsung S24',
        description: 'UV yapıştırma, tam kaplama, parmak izi sensörü uyumlu.',
        price: 349,
        category: 'ACCESSORY',
        subCategory: 'SCREEN_PROTECTOR',
        condition: 'NEW',
        stock: 40,
        images: JSON.stringify(['/images/screen_protector.png'])
    },
    {
        name: 'USB-C to Lightning Kablo 2m',
        description: 'MFi sertifikalı, hızlı şarj ve veri aktarımı.',
        price: 299,
        category: 'ACCESSORY',
        subCategory: 'CHARGER',
        condition: 'NEW',
        stock: 150,
        images: JSON.stringify(['/images/charger.png'])
    },
    {
        name: 'Araç İçi Telefon Tutucu',
        description: 'Havalandırma klipsi, 360° döndürme, tek el kullanım.',
        price: 199,
        category: 'ACCESSORY',
        subCategory: 'OTHER',
        condition: 'NEW',
        stock: 90,
        images: JSON.stringify(['/images/phone_case.png'])
    },
    {
        name: 'Powerbank 20000mAh',
        description: '65W çıkış gücü, laptop şarj edebilir, LED gösterge.',
        price: 1499,
        category: 'ACCESSORY',
        subCategory: 'OTHER',
        condition: 'NEW',
        stock: 55,
        images: JSON.stringify(['/images/charger.png'])
    }
]

async function main() {
    console.log('Seeding database...')

    // Delete existing products and related items
    await prisma.orderItem.deleteMany()
    await prisma.cartItem.deleteMany()
    await prisma.review.deleteMany()
    await prisma.product.deleteMany()

    // Create phones
    for (const phone of phones) {
        await prisma.product.create({ data: phone })
        console.log(`Created phone: ${phone.name}`)
    }

    // Create accessories
    for (const accessory of accessories) {
        await prisma.product.create({ data: accessory })
        console.log(`Created accessory: ${accessory.name}`)
    }

    console.log(`\nSeeding completed!`)
    console.log(`Total phones: ${phones.length}`)
    console.log(`Total accessories: ${accessories.length}`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
