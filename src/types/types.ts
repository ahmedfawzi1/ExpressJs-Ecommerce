import mongoose from "mongoose";

// User Type
export type UserType = {
    name: string,
    email: string,
    password: string
}

// Product Type
export type ProductType = {
    name: string,
    price: number,
    description: string,
    images: string[],
    color: string[],
    size: string[]
}

// Order Type
export type OrderType = {
    user: mongoose.Types.ObjectId,
    products: {
        product: mongoose.Types.ObjectId,
        quantity: number
    }[],
    total_price: number,
    status: string,
    address: mongoose.Types.ObjectId
}

// Cart Type
export type CartType = {
    user: mongoose.Types.ObjectId,
    products: {
        product: mongoose.Types.ObjectId,
        quantity: number
    }[],
}

// Wishlist Type
export type WishlistType = {
    user: mongoose.Types.ObjectId,
    products: {
        product: mongoose.Types.ObjectId,
    }[],
}

// Address Type
export type AddressType = {
    user: mongoose.Types.ObjectId,
    addressLine1: string,
    addressLine2: string,
    city: string,
    state: string,
    country: string,
    postalCode: string
}
