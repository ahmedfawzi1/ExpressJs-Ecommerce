import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/connectDB";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth";
import userRoute from "./routes/users";
import productRoute from "./routes/products";
import AddressRoute from "./routes/address";
import orderRoute from "./routes/orders";
import cartRoute from "./routes/cart";
import wishlistRoute from './routes/wishlist'
import { errorHandler } from './middlewares/error';
import verifyToken from "./middlewares/verifyToken";

const app = express();

dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use("/v1/api/auth", authRoute);
app.use("/v1/api/user", verifyToken, userRoute);
app.use("/v1/api/product", productRoute);
app.use("/v1/api/address", verifyToken, AddressRoute);
app.use("/v1/api/order", verifyToken, orderRoute);
app.use("/v1/api/cart", verifyToken, cartRoute);
app.use("/v1/api/wishlist", verifyToken, wishlistRoute);

app.use(errorHandler);

// const PORT = 3000;
app.listen(process.env.PORT, () => {
    connectDB();
    console.log(`RUNNING ON PORT ${process.env.PORT}`);
})