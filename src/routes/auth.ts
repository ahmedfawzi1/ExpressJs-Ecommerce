import express, { NextFunction, Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt"
import { CustomError } from "../middlewares/error";
import jwt, { JwtPayload } from "jsonwebtoken";
const router = express.Router();


// Register
router.post("/register", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new CustomError(400, "User Already Exists!")
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hashSync(password, salt);
        const newUser = new User({ ...req.body, password: hashedPassword });
        const savedUser = newUser.save();
        res.status(201).json(savedUser);

    } catch (error) {
        next(error)
    }
})

// Login
router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            throw new CustomError(404, "User Not Found!")
        };

        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) {
            throw new CustomError(401, "Wrong Credentials!")
        };

        // استخراج القيم من env والتأكد من صحتها
        const JWT_SECRET = process.env.JWT_SECRET;
        const JWT_EXPIRE = process.env.JWT_EXPIRE || "3d";

        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in environment variables");
        }

        ///////////// Old Code
        // const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET as string, { expiresIn: process.env.JWT_EXPIRE as string })
        // res.cookie("token", token).status(200).json("Login successful!")
        /////////////

        ///////////// New Code
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRE as jwt.SignOptions["expiresIn"] }
        );
        res.cookie("token", token).status(200).json("Login successfull!")

    } catch (error) {
        next(error)
    }
})

// Logout
router.get("/logout", async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.clearCookie("token", { sameSite: "none", secure: true }).status(200).json("User Logged Out Successfully!")
    } catch (error) {
        next(error)
    }
})

// Fetch Current User
router.get("/refetch", async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
        const id = (decoded as JwtPayload)._id
        const user = await User.findById(id)
        res.status(200).json(user)
    } catch (error) {
        next(error)
    }
})





export default router;