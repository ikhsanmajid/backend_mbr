import express, { Router } from "express";

import * as authentication from "../../middleware/authentication";
import { check_is_authorized_admin, check_user_has_department } from "../../middleware/authorization";
import * as admin_product_rb from "../../controller/admin/admin_product_rb";

const authentication_middleware = [authentication.check_access_token]

const router: Router = express.Router()

router.use(authentication_middleware)

// Permintaan RB
router.get("/getRecap", [check_user_has_department], admin_product_rb.get_recap_request)
router.get("/listPermintaan", [check_is_authorized_admin], admin_product_rb.get_request_lists)
router.get("/listDetailPermintaan", admin_product_rb.get_request_by_id)
router.get("/listPermintaanByDepartment", [check_is_authorized_admin], admin_product_rb.get_request_by_department)
router.get("/listPermintaanByProduk", [check_is_authorized_admin], admin_product_rb.get_request_by_produk)
router.get("/listNomorByIdPermintaan", [check_is_authorized_admin], admin_product_rb.get_nomor_by_id)
router.get("/listNomorUrutByIdPermintaan", admin_product_rb.get_nomor_request_by_id)
router.post("/confirmPermintaan/:id", [check_is_authorized_admin], admin_product_rb.confirm_request)

// Pengembalian RB
router.get("/getRBReturnAdminByProduct/:id", [check_is_authorized_admin],  admin_product_rb.get_rb_return_by_product) // sudah dokumentasi
router.get("/getRBReturnAdminByProduct/:id/:idPermintaan", [check_is_authorized_admin],  admin_product_rb.get_rb_return_by_product_and_permintaan) // sudah dokumentasi
router.get("/getRBReturnAdminIdPermintaan/:idPermintaan", [check_is_authorized_admin],  admin_product_rb.get_rb_return_by_id_permintaan) // sudah dokumentasi
router.put("/updateNomorRBReturnAdmin/:idNomor", [check_is_authorized_admin],  admin_product_rb.set_nomor_rb_return) // sudah dokumentasi
router.post("/confirmRBReturnAdmin/:id", [check_is_authorized_admin],  admin_product_rb.confirm_rb_return) // sudah dokumentasi

// Generate Laporan
router.get("/generateReport/", [check_is_authorized_admin], admin_product_rb.generate_report_rb_belum_kembali_perbagian)
router.get("/generateReportDashboadAdmin/", [check_is_authorized_admin], admin_product_rb.generate_report_dashboard_admin)
router.get("/generateReportPembuatanRB/", [check_is_authorized_admin], admin_product_rb.generate_report_pembuatan_rb)



export default router;