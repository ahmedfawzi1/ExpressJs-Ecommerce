import express, { NextFunction, Request, Response } from 'express';
import Wishlist from '../models/Wishlist';
import { CustomError } from '../middlewares/error';
const router = express.Router();

// Add
router.post("/add", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, productId } = req.body;
        let wishlist = await Wishlist.findOne({ user: userId });
        if (!wishlist) {
            wishlist = await Wishlist.create({ user: userId, products: [] });
        };

        if (wishlist.products.find(item => item.product.toString() === productId)) {
            throw new CustomError(400, "Product Already Exists In The Wishlist!")
        };  
        wishlist.products.push({ product: productId });
        await wishlist.save();
        res.status(200).json({ message: "Product Added To Wishlist Successfully!" });

    } catch (error) {
        next(error);
    }
})

//Remove From Wishlist
router.post("/remove", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, productId } = req.body;
        let wishlist = await Wishlist.findOne({ user: userId });
        if (!wishlist) {
            throw new CustomError(404, "Wishlist Not Found!");
        };
        wishlist.products = wishlist.products.filter(item => item.product.toString() !== productId);
        await wishlist.save();
        res.status(200).json({ message: "Product Removed From Wishlist!" });
    }
    catch (error) {
        next(error);
    }
})

//Get User Wishlist
router.get("/:userId", async (req: Request, res: Response, next: NextFunction) => {

    try {
        const wishlist = await Wishlist.findOne({ user: req.params.userId }).populate("products.product");
        if (!wishlist) {
            throw new CustomError(404, "Wishlist Not Found!");
        };

        res.status(200).json(wishlist);
    }
    catch (error) {
        next(error);
    }
})


export default router;