"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication = __importStar(require("../../middleware/authentication"));
const authorization_1 = require("../../middleware/authorization");
const admin_product = __importStar(require("../../controller/admin/admin_product"));
const authentication_middleware = [authentication.check_access_token];
const router = express_1.default.Router();
router.use(authentication_middleware);
//Kategori
router.get("/getKategori", admin_product.get_kategori);
// Produk
router.post("/addProduct", [authorization_1.check_is_authorized_admin], admin_product.add_product);
router.get("/getProduct", [authorization_1.check_user_has_department, authorization_1.get_user_department], admin_product.get_product);
router.get("/checkProduct", admin_product.check_product);
router.delete("/deleteProduct/:id", [authorization_1.check_is_authorized_admin], admin_product.delete_product);
router.put("/editProduct/:id", [authorization_1.check_is_authorized_admin], admin_product.edit_product);
exports.default = router;
