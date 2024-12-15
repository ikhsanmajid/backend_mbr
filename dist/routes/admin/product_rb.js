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
const admin_product_rb = __importStar(require("../../controller/admin/admin_product_rb"));
const authentication_middleware = [authentication.check_access_token];
const router = express_1.default.Router();
router.use(authentication_middleware);
// Permintaan RB
router.get("/getRecap", [authorization_1.check_user_has_department], admin_product_rb.get_recap_request);
router.get("/listPermintaan", [authorization_1.check_is_authorized_admin], admin_product_rb.get_request_lists);
router.get("/listDetailPermintaan", admin_product_rb.get_request_by_id);
router.get("/listPermintaanByDepartment", [authorization_1.check_is_authorized_admin], admin_product_rb.get_request_by_department);
router.get("/listPermintaanByProduk", [authorization_1.check_is_authorized_admin], admin_product_rb.get_request_by_produk);
router.get("/listNomorByIdPermintaan", [authorization_1.check_is_authorized_admin], admin_product_rb.get_nomor_by_id);
router.get("/listNomorUrutByIdPermintaan", admin_product_rb.get_nomor_request_by_id);
router.post("/confirmPermintaan/:id", [authorization_1.check_is_authorized_admin], admin_product_rb.confirm_request);
// Pengembalian RB
router.get("/getRBReturnAdminByProduct/:id", [authorization_1.check_is_authorized_admin], admin_product_rb.get_rb_return_by_product); // sudah dokumentasi
router.get("/getRBReturnAdminByBagian/", [authorization_1.check_is_authorized_admin], admin_product_rb.get_rb_return_by_bagian); // sudah dokumentasi
router.get("/getRBReturnAdminByProduct/:id/:idPermintaan", [authorization_1.check_is_authorized_admin], admin_product_rb.get_rb_return_by_product_and_permintaan); // sudah dokumentasi
router.get("/getRBReturnAdminIdPermintaan/:idPermintaan", [authorization_1.check_is_authorized_admin], admin_product_rb.get_rb_return_by_id_permintaan); // sudah dokumentasi
router.put("/updateNomorRBReturnAdmin/:idNomor", [authorization_1.check_is_authorized_admin], admin_product_rb.set_nomor_rb_return); // sudah dokumentasi
router.post("/confirmRBReturnAdmin/:id", [authorization_1.check_is_authorized_admin], admin_product_rb.confirm_rb_return); // sudah dokumentasi
// Generate Laporan
router.get("/generateReport/", [authorization_1.check_is_authorized_admin], admin_product_rb.generate_report_rb_belum_kembali_perbagian);
router.get("/generateReportDashboadAdmin/", [authorization_1.check_is_authorized_admin], admin_product_rb.generate_report_dashboard_admin);
router.get("/generateReportPembuatanRB/", [authorization_1.check_is_authorized_admin], admin_product_rb.generate_report_pembuatan_rb);
exports.default = router;
