/* eslint-disable max-len */
import { Router } from "express";
import { adminMW } from "./middleware";
import { login, logout } from "./Auth";
import {
  getAllAccounts,
  addOneAccount,
  updateOneAccount,
  deleteOneAccount,
} from "../controllers/AccountController";
import {
  getAllAccountInfos,
  updateOneAccountInfo,
} from "src/controllers/AccountInfoController";
import {
  getAllProducts,
  addOneProduct,
  updateOneProduct,
  deleteOneProduct,
  filler
} from "../controllers/ProductController";

// Auth router
const authRouter = Router();
// eslint-disable-next-line @typescript-eslint/no-misused-promises
authRouter.post("/login", login);
authRouter.get("/logout", logout);

// Product-router

const productRouter = Router();
productRouter.get("/all", getAllProducts);
productRouter.post("/add", addOneProduct);
productRouter.put("/update", updateOneProduct);
productRouter.delete("/delete/:id", deleteOneProduct);
productRouter.get("/filter",filler);

// Account-router
const accountRouter = Router();
accountRouter.get("/all", getAllAccounts);
accountRouter.post("/add", addOneAccount);
accountRouter.put("/update", updateOneAccount);
accountRouter.delete("/delete/:id", deleteOneAccount);

// AccountInfo-router
const accountInfoRouter = Router();
accountInfoRouter.get("/all", getAllAccountInfos);
accountInfoRouter.put("/update", updateOneAccountInfo);

// Export the base-router
const baseRouter = Router();
baseRouter.use("/auth", authRouter);
baseRouter.use("/accounts", adminMW, accountRouter);
baseRouter.use("/products", productRouter);
baseRouter.use("/accountinfos", accountInfoRouter);
export default baseRouter;
