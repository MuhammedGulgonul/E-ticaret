// iyzipay type declarations
declare module 'iyzipay' {
    interface IyzipayConfig {
        apiKey: string
        secretKey: string
        uri: string
    }

    interface CheckoutFormInitialize {
        create(request: any, callback: (err: any, result: any) => void): void
    }

    interface CheckoutForm {
        retrieve(request: any, callback: (err: any, result: any) => void): void
    }

    class Iyzipay {
        constructor(config: IyzipayConfig)
        checkoutFormInitialize: CheckoutFormInitialize
        checkoutForm: CheckoutForm

        static LOCALE: {
            TR: string
            EN: string
        }

        static CURRENCY: {
            TRY: string
            USD: string
            EUR: string
        }

        static PAYMENT_GROUP: {
            PRODUCT: string
            LISTING: string
            SUBSCRIPTION: string
        }

        static BASKET_ITEM_TYPE: {
            PHYSICAL: string
            VIRTUAL: string
        }
    }

    export = Iyzipay
}
