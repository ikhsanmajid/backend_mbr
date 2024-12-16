"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rb_1 = __importDefault(require("./users/rb"));
const express_1 = require("express");
const handlingError_1 = require("../middleware/handlingError");
const router = (0, express_1.Router)();
router.use("/rb", rb_1.default);
router.use(handlingError_1.errorHandler);
exports.default = router;
