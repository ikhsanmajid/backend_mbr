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
const admin_employment = __importStar(require("../../controller/admin/admin_employment"));
const authentication = __importStar(require("../../middleware/authentication"));
const authorization_1 = require("../../middleware/authorization");
const authentication_middleware = [authentication.check_access_token];
const router = express_1.default.Router();
router.use(authentication_middleware);
// EMPLOYMENT
router.post("/addEmployment", [authorization_1.check_is_authorized_admin], admin_employment.add_employment);
router.get("/findAll", admin_employment.find_all);
router.get("/findEmployment", admin_employment.find_employment);
router.get("/findFixedEmployment", admin_employment.find_fixed_employment);
router.get("/detail/:id", admin_employment.detail_employment);
router.patch("/updateEmployment/:id", [authorization_1.check_is_authorized_admin], admin_employment.update_employment);
router.delete("/deleteEmployment/:id", [authorization_1.check_is_authorized_admin], admin_employment.hard_delete_employment);
exports.default = router;
