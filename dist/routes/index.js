"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable max-len */
const express_1 = require("express");
const middleware_1 = require("./middleware");
const Auth_1 = require("./Auth");
const AccountController_1 = require("../controllers/AccountController");
const AccountInfoController_1 = require("../controllers/AccountInfoController");
const ProductController_1 = require("../controllers/ProductController");
const BillController_1 = require("../controllers/BillController");
const CategoriesController_1 = require("../controllers/CategoriesController");
const RenderData_1 = require("../controllers/RenderData");
// Auth router
const authRouter = express_1.Router();
// eslint-disable-next-line @typescript-eslint/no-misused-promises
authRouter.post("/login", Auth_1.login);
authRouter.get("/logout", Auth_1.logout);
// Product-router
const productRouter = express_1.Router();
productRouter.post("/add", ProductController_1.addOneProduct);
productRouter.put("/update", ProductController_1.updateOneProduct);
productRouter.delete("/delete/:id", ProductController_1.deleteOneProduct);
productRouter.get("/filter", ProductController_1.filler);
productRouter.get("/getid/:ID", ProductController_1.getById);
productRouter.get("/all", ProductController_1.getAllProducts);
productRouter.get("/coc", RenderData_1.coc);
// Account-router 123 123 123
const accountRouter = express_1.Router();
accountRouter.get("/filter", AccountController_1.filter);
accountRouter.get("/all", AccountController_1.getAllAccounts);
accountRouter.post("/add", AccountController_1.addOneAccount);
accountRouter.put("/update", AccountController_1.updateOneAccount);
accountRouter.delete("/delete/:id", AccountController_1.deleteOneAccount);
accountRouter.get("/getid/:ID", AccountController_1.getOneById);
accountRouter.post("/login", AccountController_1.getLogin);
// AccountInfo-router
const accountInfoRouter = express_1.Router();
accountInfoRouter.get("/all", AccountInfoController_1.getAllAccountInfos);
accountInfoRouter.put("/update", AccountInfoController_1.updateOneAccountInfo);
// Product-router
const billRouter = express_1.Router();
billRouter.get("/all", BillController_1.getAllBills);
billRouter.post("/add", BillController_1.addOneBill);
billRouter.put("/update", BillController_1.updateOneBill);
billRouter.get("/getmany", BillController_1.GetManyById);
billRouter.get("/filter", BillController_1.filterBills);
//
const categoryRouter = express_1.Router();
categoryRouter.get("/all", CategoriesController_1.getCategoryById);
categoryRouter.post("/add", CategoriesController_1.addOneCategory);
categoryRouter.put("/update", CategoriesController_1.updateOneCategory);
categoryRouter.delete("/delete/:id", CategoriesController_1.deleteOneCategory);
// Export the base-router
const baseRouter = express_1.Router();
baseRouter.use("/auth", authRouter);
baseRouter.use("/accounts", middleware_1.adminMW, accountRouter);
baseRouter.use("/products", productRouter);
baseRouter.use("/accountinfos", accountInfoRouter);
baseRouter.use("/bills", billRouter);
baseRouter.use("/categories", categoryRouter);
exports.default = baseRouter;
