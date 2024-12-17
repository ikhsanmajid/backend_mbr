import express, { Router } from "express";
import * as users from "../../controller/users/users_rb";
import * as authentication from "../../middleware/authentication";
import {
    check_is_authorized_admin,
    check_user_has_department,
    get_user_department,
    check_user_same_department,
    get_user_id
} from "../../middleware/authorization";

const authentication_middleware = [authentication.check_access_token]

const router: Router = express.Router()

router.use(authentication_middleware)

// USERS
router.post("/addRequestRB", [check_user_has_department, get_user_department], users.add_request) // sudah dokumentasi
router.post("/editRequestRB", [check_user_has_department, get_user_department], users.edit_request) // sudah dokumentasi
router.put("/usedRequestRB/:id", [check_user_has_department, get_user_department], users.set_request_used) // sudah dokumentasi
router.get("/listRequestRB", [check_user_has_department, get_user_department], users.get_list_request) // sudah dokumentasi
router.get("/listDetailRequestRB/:id", [check_user_has_department, get_user_department], users.get_detail_request)
router.get("/getRBReturnByProduct/:id", [check_user_has_department, get_user_department, check_user_same_department], users.get_rb_return_by_product) // sudah dokumentasi
router.get("/getRBReturnByProduct/:id/:idPermintaan", [check_user_has_department, get_user_department, check_user_same_department], users.get_rb_return_by_product_and_permintaan) // sudah dokumentasi
router.get("/getRBReturnIdPermintaan/:idPermintaan", [check_user_has_department, get_user_department], users.get_rb_return_by_id_permintaan) // sudah dokumentasi
router.put("/updateNomorRBReturn/:idNomor", [check_user_has_department, get_user_department, get_user_id], users.set_nomor_rb_return) // sudah dokumentasi


// Report
router.get("/generateReportDashboadUser/", [check_user_has_department, get_user_department], users.generate_report_dashboard_user) // sudah dokumentasi
router.get("/generateReportSerahTerima/", [check_user_has_department, get_user_department, get_user_id], users.generate_report_serah_terima) // sudah dokumentasi

export default router;