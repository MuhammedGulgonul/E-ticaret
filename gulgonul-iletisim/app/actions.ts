'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { createSession, getSession } from '@/lib/session'

export async function submitRepairRequest(formData: FormData) {
    // Require login for repair requests
    const session = await getSession()

    if (!session) {
        return {
            success: false,
            message: 'Tamir talebi oluşturmak için giriş yapmanız gerekmektedir.',
            requireLogin: true
        }
    }

    const model = formData.get('model') as string
    const issue = formData.get('issue') as string
    const contact = formData.get('contact') as string

    if (!model || !issue || !contact) {
        return { success: false, message: 'Lütfen tüm alanları doldurunuz.' }
    }

    try {
        await prisma.repairRequest.create({
            data: {
                model,
                description: issue,
                contactInfo: contact,
                status: 'PENDING',
                userId: session.userId, // Link to logged in user
            },
        })

        revalidatePath('/admin')
        return { success: true, message: 'Talebiniz başarıyla alındı. En kısa sürede size dönüş yapacağız.' }
    } catch (error) {
        console.error('Repair Request Error:', error)
        return { success: false, message: 'Bir hata oluştu. Lütfen tekrar deneyiniz.' }
    }
}

export async function getDashboardStats() {
    try {
        const repairCount = await prisma.repairRequest.count({ where: { status: 'PENDING' } });
        const productCount = await prisma.product.count();
        const userCount = await prisma.user.count();
        const orderCount = 0;

        return {
            repairCount,
            productCount,
            userCount,
            orderCount
        }
    } catch (error) {
        console.error("Failed to fetch stats", error);
        return { repairCount: 0, productCount: 0, userCount: 0, orderCount: 0 }
    }
}

export async function registerUser(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!name || !email || !password) {
        return { success: false, message: 'Lütfen tüm alanları doldurunuz.' };
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return { success: false, message: 'Bu e-posta adresi zaten kayıtlı.' };
        }

        // Hash password before saving
        const { hashPassword } = await import('@/lib/password')
        const hashedPassword = await hashPassword(password)

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'USER'
            }
        });

        // Create session for new user
        await createSession({
            userId: newUser.id,
            email: newUser.email,
            name: newUser.name || 'Kullanıcı',
            role: newUser.role
        });

        revalidatePath('/admin/kullanicilar');
        return { success: true, message: 'Kayıt başarılı! Yönlendiriliyorsunuz...' };
    } catch (error) {
        console.error('Register error:', error);
        return { success: false, message: 'Kayıt sırasında bir hata oluştu.' };
    }
}

// Helper function to save images
async function saveImages(images: string[]): Promise<string[]> {
    const savedPaths: string[] = [];

    for (const imageData of images) {
        if (!imageData || !imageData.startsWith('data:image')) continue;

        try {
            const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
            const buffer = Buffer.from(base64Data, 'base64');
            const filename = `product-${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
            const filepath = join(process.cwd(), 'public', 'images', filename);

            await writeFile(filepath, buffer);
            savedPaths.push(`/images/${filename}`);
        } catch (error) {
            console.error('Error saving image:', error);
        }
    }

    return savedPaths;
}

export async function addProduct(formData: FormData) {
    try {
        const name = formData.get('name') as string;
        const price = parseFloat(formData.get('price') as string);
        const category = formData.get('category') as string;
        const description = formData.get('description') as string;
        const condition = formData.get('condition') as string || 'NEW';
        const imagesJson = formData.get('images') as string;

        // New Fields
        const subCategory = formData.get('subCategory') as string;
        const storage = formData.get('storage') as string;
        const ram = formData.get('ram') as string;
        const batteryHealth = formData.get('batteryHealth') as string;
        const stock = formData.get('stock') ? parseInt(formData.get('stock') as string) : 1;

        if (!name || isNaN(price)) {
            return { success: false, message: 'Lütfen geçerli isim ve fiyat giriniz.' };
        }

        // Parse and save images
        let imagePaths: string[] = [];
        if (imagesJson) {
            try {
                const imagesData = JSON.parse(imagesJson);
                imagePaths = await saveImages(imagesData);
            } catch (e) {
                console.error('Image parse error:', e);
            }
        }

        await prisma.product.create({
            data: {
                name,
                price,
                description,
                category,
                condition: condition === 'USED' ? 'USED' : 'NEW',
                images: JSON.stringify(imagePaths),
                stock: category === 'ACCESSORY' ? stock : 1, // Stock only for accessories
                subCategory: subCategory || null,
                storage: storage || null,
                ram: ram || null,
                batteryHealth: batteryHealth || null
            }
        });

        revalidatePath('/admin/urunler');
        revalidatePath('/telefon');
        revalidatePath('/aksesuar');
        return { success: true, message: 'Ürün başarıyla eklendi.' };
    } catch (error) {
        console.error("Create error:", error);
        return { success: false, message: 'Ürün eklenirken hata oluştu.' };
    }
}

export async function updateProduct(formData: FormData) {
    try {
        const id = parseInt(formData.get('id') as string);
        const name = formData.get('name') as string;
        const price = parseFloat(formData.get('price') as string);
        const category = formData.get('category') as string;
        const description = formData.get('description') as string;
        const condition = formData.get('condition') as string;
        const imagesJson = formData.get('images') as string;

        const subCategory = formData.get('subCategory') as string;
        const storage = formData.get('storage') as string;
        const ram = formData.get('ram') as string;
        const batteryHealth = formData.get('batteryHealth') as string;
        const stock = formData.get('stock') ? parseInt(formData.get('stock') as string) : 1;

        if (!id || !name || isNaN(price)) {
            return { success: false, message: 'Geçersiz veri.' };
        }

        // Handle images
        let imagePaths: string[] = [];
        if (imagesJson) {
            try {
                const imagesData = JSON.parse(imagesJson);
                // Filter URLs vs base64
                const existingUrls = imagesData.filter((img: string) => img.startsWith('http') || img.startsWith('/'));
                const newImages = imagesData.filter((img: string) => img.startsWith('data:image'));

                const savedNewImages = await saveImages(newImages);
                imagePaths = [...existingUrls, ...savedNewImages];
            } catch (e) {
                console.error('Image parse error:', e);
            }
        }

        await prisma.product.update({
            where: { id },
            data: {
                name,
                price,
                description,
                category,
                condition,
                images: JSON.stringify(imagePaths),
                stock: category === 'ACCESSORY' ? stock : 1,
                subCategory: subCategory || null,
                storage: storage || null,
                ram: ram || null,
                batteryHealth: batteryHealth || null
            }
        });

        revalidatePath('/admin/urunler');
        revalidatePath('/telefon');
        revalidatePath('/aksesuar');
        return { success: true, message: 'Ürün başarıyla güncellendi.' };
    } catch (error) {
        console.error("Update error:", error);
        return { success: false, message: 'Ürün güncellenirken hata oluştu.' };
    }
}

export async function deleteProduct(id: number) {
    try {
        // First delete related cart items
        await prisma.cartItem.deleteMany({ where: { productId: id } });

        // Then delete the product
        await prisma.product.delete({ where: { id } });

        revalidatePath('/admin/urunler');
        revalidatePath('/telefon');
        revalidatePath('/aksesuar');
        return { success: true, message: 'Ürün başarıyla silindi.' };
    } catch (error) {
        console.error("Delete error:", error);
        return { success: false, message: 'Ürün silinirken hata oluştu. Ürün bir siparişte kullanılıyor olabilir.' };
    }
}

export async function submitReview(productId: number, rating: number, comment: string) {
    const session = await getSession()

    if (!session) {
        return { success: false, error: 'Değerlendirme yapmak için giriş yapmalısınız.' }
    }

    if (rating < 1 || rating > 5) {
        return { success: false, error: 'Geçersiz puan.' }
    }

    try {
        // Check if user already reviewed this product
        const existingReview = await prisma.review.findFirst({
            where: {
                userId: session.userId,
                productId: productId
            }
        })

        if (existingReview) {
            return { success: false, error: 'Bu ürünü zaten değerlendirdiniz.' }
        }

        const review = await prisma.review.create({
            data: {
                rating,
                comment: comment || null,
                userId: session.userId,
                productId
            },
            include: {
                user: {
                    select: { name: true }
                }
            }
        })

        revalidatePath(`/aksesuar/${productId}`)
        revalidatePath(`/telefon/${productId}`)

        return {
            success: true,
            review: {
                id: review.id,
                rating: review.rating,
                comment: review.comment,
                createdAt: review.createdAt,
                user: {
                    name: review.user.name
                }
            }
        }
    } catch (error) {
        console.error('Review submission error:', error)
        return { success: false, error: 'Bir hata oluştu. Lütfen tekrar deneyin.' }
    }
}
