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
const admin_department_employment = __importStar(require("../../controller/admin/admin_department_employment"));
const authentication = __importStar(require("../../middleware/authentication"));
const authorization_1 = require("../../middleware/authorization");
const authentication_middleware = [authentication.check_access_token];
const router = express_1.default.Router();
router.use(authentication_middleware);
// EMPLOYMENT
router.post("/addDepartmentEmployment", [authorization_1.check_is_authorized_admin], admin_department_employment.add_department_employment); // sudah dokumentasi
router.get("/findAll", admin_department_employment.find_all); // sudah dokumentasi
router.get("/findDepartmentEmployment", admin_department_employment.find_department_employment);
router.get("/findFixedDepartmentEmployment", admin_department_employment.find_fixed_department_employment);
router.get("/detail/:id", admin_department_employment.detail_department_employment); // sudah dokumentasi
router.get("/findJabatan/:id", admin_department_employment.find_bagian_department_employment); // sudah dokumentasi
router.patch("/updateDepartmentEmployment/:id", [authorization_1.check_is_authorized_admin], admin_department_employment.update_department_employment); // sudah dokumentasi
router.delete("/deleteDepartmentEmployment/:id", [authorization_1.check_is_authorized_admin], admin_department_employment.hard_delete_department_employment); // sudah dokumentasi
exports.default = router;
