import bcrypt from 'bcrypt';
import express, { NextFunction, Request, Response } from 'express';
import User from '../models/User';
import { CustomError } from '../middlewares/error';
const router = express.Router();

// Update
router.put("/update/:userId", async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hashSync(req.body.password, salt);
            req.body.password = hashedPassword;
        }

        const user = await User.findById(req.params.userId);
        if (!user) {
            throw new CustomError(404, "User Not Found!")
        }

        const updateUser = await User.findByIdAndUpdate(req.params.userId, { $set: req.body }, { new: true });
        res.status(200).json(updateUser);

    } catch (error) {
        next(error);
    }
})

// Get
router.get("/:userId", async (req: Request, res: Response, next: NextFunction) => {
    // const userId = req.params.userId; same code below
    const { userId } = req.params;

    try {

        const user = await User.findById(userId);
        if (!user) {
            throw new CustomError(404, "User Not Found!")
        }

        res.status(200).json(user);

    } catch (error) {
        next(error);
    }
})

// Delete
router.delete("/delete/:userId", async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    try {
        const deleteUser = await User.findById(userId);
        if (!deleteUser) {
            throw new CustomError(404, "User Not Found!")
        }
        await deleteUser.deleteOne()

        res.status(200).json({message: "User Deleted Successfully!"})
        
    } catch (error) {
        next(error);
    }
})

export default router;