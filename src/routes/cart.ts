import express, { NextFunction, Request, Response } from 'express';
import Cart from '../models/Cart';
import { CustomError } from '../middlewares/error';
const router = express.Router();

// Add To Cart
router.post("/add", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, productId, quantity } = req.body;
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = await Cart.create({ user: userId, products: [] });
        };

        const existingProductIndex = cart.products.findIndex(item => item.product.toString() === productId);
        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }
        await cart.save();

        res.status(201).json({ message: "Item Added To Cart Successfully!" })

    } catch (error) {
        next(error);
    }
})

// Remove From Cart
router.post("/remove", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, productId } = req.body;
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            throw new CustomError(404, "Cart Not Found!")
        }

        const productIndex = cart.products.findIndex(item => item.product.toString() === productId);
        if (productIndex !== -1) {

            if (cart.products[productIndex].quantity > 1) {
                cart.products[productIndex].quantity -= 1;
            } else {
                cart.products.splice(productIndex, 1);
            };

            await cart.save()
            res.status(200).json({ message: "Item Removed From Cart Successfully!" })

        }
        else {
            throw new CustomError(404, "Product Not Found In Cart!")
        }

    } catch (error) {
        next(error);
    }
})

// Get User Cart
router.get("/:userId", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;
        const cart = await Cart.findOne({ user: userId }).populate("products.product");
        if (!cart) {
            throw new CustomError(404, "Cart Not Found!")
        };

        res.status(200).json(cart);

    } catch (error) {
        next(error);
    }
})


export default router;