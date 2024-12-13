"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const usersRoutes_1 = __importDefault(require("./admin/usersRoutes"));
const departmentsRoutes_1 = __importDefault(require("./admin/departmentsRoutes"));
const employmentRoutes_1 = __importDefault(require("./admin/employmentRoutes"));
const departmentVsEmploymentRoutes_1 = __importDefault(require("./admin/departmentVsEmploymentRoutes"));
const product_rb_1 = __importDefault(require("./admin/product_rb"));
const product_1 = __importDefault(require("./admin/product"));
const express_1 = require("express");
const handlingError_1 = require("../middleware/handlingError");
const router = (0, express_1.Router)();
router.use("/users", usersRoutes_1.default);
router.use("/department", departmentsRoutes_1.default);
router.use("/employment", employmentRoutes_1.default);
router.use("/department_employment", departmentVsEmploymentRoutes_1.default);
router.use("/product_rb", product_rb_1.default);
router.use("/product", product_1.default);
router.get("/getservertime", (req, res) => {
    const dateNow = new Date().toLocaleString();
    return res.send(dateNow);
});
router.use(handlingError_1.errorHandler);
exports.default = router;
