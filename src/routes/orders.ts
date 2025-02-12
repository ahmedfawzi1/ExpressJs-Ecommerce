import express, { NextFunction, Request, Response } from 'express';
import Order from '../models/Order';
const router = express.Router();

// Create
router.post("/create", async (req: Request, res: Response, next: NextFunction) => {
    const newOrder = new Order(req.body);

    try {
        const saveOrder = await newOrder.save();
        res.status(201).json(saveOrder);
    } catch (error) {
        next(error);
    }
})

// Delete
router.delete("/cancel/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Order Cancelled!" });
    } catch (error) {
        next(error);
    }
})

// Get User Order
router.get("/:userId", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await Order.find({ user: req.params.userId }).populate("address")
        res.status(200).json(orders)
    }
    catch (error) {
        next(error)
    }
})


export default router;