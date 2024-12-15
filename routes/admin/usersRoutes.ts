import express, { Router } from "express";
import * as admin_users from "../../controller/admin/admin_users";
import * as authentication from "../../middleware/authentication";
import { check_is_authorized_admin, check_user_has_department, get_user_department, get_user_id } from "../../middleware/authorization";

const authentication_middleware = [authentication.check_access_token]

const router: Router = express.Router()

router.use(authentication_middleware)

// USERS

router.post("/addUser", [check_is_authorized_admin], admin_users.add_user) // sudah dokumentasi
router.get("/checkEmail", admin_users.check_email) // sudah dokumentasi
router.get("/checkNIK", admin_users.check_nik) // sudah dokumentasi
router.post("/addUserJabatan", [check_is_authorized_admin], admin_users.add_user_department_employment)  // sudah dokumentasi
router.get("/findAll", admin_users.find_all) // sudah dokumentasi
router.get("/detail/:id", admin_users.detail_user) // sudah dokumentasi
router.get("/findUser", admin_users.find_user) // sudah dokumentasi
router.patch("/updateUser/:id", [check_is_authorized_admin], admin_users.update_user) // sudah dokumentasi
router.patch("/updateUserJabatan", [check_is_authorized_admin], admin_users.update_user_department_employment) // sudah dokumentasi
router.delete("/deleteUser/:id", [check_is_authorized_admin], admin_users.hard_delete_user)  // sudah dokumentasi
router.delete("/deleteJabatan/:id", [check_is_authorized_admin], admin_users.delete_user_department_employment)  // sudah dokumentasi

// update password
router.patch("/updatePassword/:id", [get_user_id], admin_users.update_password) // sudah dokumentasi

export default router;