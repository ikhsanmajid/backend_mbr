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
const users = __importStar(require("../../controller/users/users_rb"));
const authentication = __importStar(require("../../middleware/authentication"));
const authorization_1 = require("../../middleware/authorization");
const authentication_middleware = [authentication.check_access_token];
const router = express_1.default.Router();
router.use(authentication_middleware);
// USERS
router.post("/addRequestRB", [authorization_1.check_user_has_department, authorization_1.get_user_department], users.add_request); // sudah dokumentasi
router.post("/editRequestRB", [authorization_1.check_user_has_department, authorization_1.get_user_department], users.edit_request); // sudah dokumentasi
router.put("/usedRequestRB/:id", [authorization_1.check_user_has_department, authorization_1.get_user_department], users.set_request_used); // sudah dokumentasi
router.get("/listRequestRB", [authorization_1.check_user_has_department, authorization_1.get_user_department], users.get_list_request); // sudah dokumentasi
router.get("/listDetailRequestRB/:id", [authorization_1.check_user_has_department, authorization_1.get_user_department], users.get_detail_request);
router.get("/getRBReturnByProduct/:id", [authorization_1.check_user_has_department, authorization_1.get_user_department, authorization_1.check_user_same_department], users.get_rb_return_by_product); // sudah dokumentasi
router.get("/getRBReturnByProduct/:id/:idPermintaan", [authorization_1.check_user_has_department, authorization_1.get_user_department, authorization_1.check_user_same_department], users.get_rb_return_by_product_and_permintaan); // sudah dokumentasi
router.get("/getRBReturnIdPermintaan/:idPermintaan", [authorization_1.check_user_has_department, authorization_1.get_user_department], users.get_rb_return_by_id_permintaan); // sudah dokumentasi
router.put("/updateNomorRBReturn/:idNomor", [authorization_1.check_user_has_department, authorization_1.get_user_department], users.set_nomor_rb_return); // sudah dokumentasi
exports.default = router;
