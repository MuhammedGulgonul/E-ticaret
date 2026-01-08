const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Clear existing data
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();

    // Create admin user
    await prisma.user.create({
        data: {
            name: 'Admin',
            email: 'admin@gulgonul.com',
            password: '123456',
            role: 'ADMIN'
        }
    });

    console.log('✅ Admin user created');

    // Create products with generated images
    await prisma.product.createMany({
        data: [
            // PHONES
            {
                name: 'iPhone 15 Pro Max',
                description: 'En yeni iPhone modeli, 6.7 inç Super Retina XDR ekran, A17 Pro chip',
                price: 75000,
                category: 'PHONE',
                condition: 'NEW',
                images: JSON.stringify(['/images/phone_iphone15_1767281207682.png']),
                storage: '256GB',
                ram: '8GB',
                stock: 1
            },
            {
                name: 'Samsung Galaxy S24 Ultra',
                description: 'Flagship Android telefon, S Pen desteği, 200MP kamera',
                price: 65000,
                category: 'PHONE',
                condition: 'NEW',
                images: JSON.stringify(['/images/phone_samsung_1767281222256.png']),
                storage: '512GB',
                ram: '12GB',
                stock: 1
            },
            {
                name: 'iPhone 14 Pro (İkinci El)',
                description: 'Temiz ikinci el iPhone, garantili, test edilmiş',
                price: 45000,
                category: 'PHONE',
                condition: 'USED',
                images: JSON.stringify(['/images/phone_iphone14_1767281237067.png']),
                storage: '128GB',
                ram: '6GB',
                batteryHealth: '95',
                stock: 1
            },

            // ACCESSORIES
            {
                name: 'iPhone 15 Silikon Kılıf',
                description: 'Orijinal Apple silikon kılıf, lacivert renk',
                price: 450,
                category: 'ACCESSORY',
                subCategory: 'CASE',
                images: JSON.stringify(['/images/accessory_case_1767281252129.png']),
                stock: 20
            },
            {
                name: 'USB-C Hızlı Şarj 65W',
                description: 'PD destekli hızlı şarj adaptörü, 2 portlu',
                price: 350,
                category: 'ACCESSORY',
                subCategory: 'CHARGER',
                images: JSON.stringify(['/images/accessory_charger_1767281268427.png']),
                stock: 30
            },
            {
                name: 'AirPods Pro 2. Nesil',
                description: 'Aktif gürültü engelleme, kablosuz şarj',
                price: 8500,
                category: 'ACCESSORY',
                subCategory: 'HEADPHONE',
                images: JSON.stringify(['/images/accessory_headphones_1767281283390.png']),
                stock: 10
            },
        ]
    });

    console.log('✅ 6 ürün eklendi (gerçek görseller ile)');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
