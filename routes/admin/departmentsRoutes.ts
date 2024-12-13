import express, { Router } from "express";
import * as admin_department from "../../controller/admin/admin_department";
import * as authentication from "../../middleware/authentication";
import { check_is_authorized_admin } from "../../middleware/authorization";

const authentication_middleware = [authentication.check_access_token]

const router: Router = express.Router()

router.use(authentication_middleware)

// Bagian
router.post("/addDepartment", [check_is_authorized_admin], admin_department.add_department) // sudah dokumentasi
router.get("/findAll", admin_department.find_all) // sudah dokumentasi
router.get("/detail/:id", admin_department.detail_department) // sudah dokumentasi
router.get("/findDepartment", admin_department.find_department) //sudah dokumentasi
router.get("/findFixedDepartment", admin_department.find_fixed_department) //sudah dokumentasi
router.patch("/updateDepartment/:id", [check_is_authorized_admin],admin_department.update_department)
router.delete("/deleteDepartment/:id", [check_is_authorized_admin],admin_department.hard_delete_department) // sudah dokumentasi


export default router;