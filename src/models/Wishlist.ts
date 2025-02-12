import mongoose, { Schema } from "mongoose";
import { WishlistType } from "../types/types";


const WishlistSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    products: [{
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    }], 
})

const Wishlist = mongoose.model<WishlistType>("Wishlist", WishlistSchema);

export default Wishlist;