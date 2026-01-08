import Iyzipay from 'iyzipay'

// İyzico konfigürasyonu - .env dosyasından alınmalı
export const iyzipay = new Iyzipay({
    apiKey: process.env.IYZICO_API_KEY!,
    secretKey: process.env.IYZICO_SECRET_KEY!,
    uri: process.env.NODE_ENV === 'production'
        ? 'https://api.iyzipay.com'
        : 'https://sandbox-api.iyzipay.com' // Test ortamı
})
