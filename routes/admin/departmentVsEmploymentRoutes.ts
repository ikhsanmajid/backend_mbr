import express, { Router } from "express";
import * as admin_department_employment from "../../controller/admin/admin_department_employment";
import * as authentication from "../../middleware/authentication";
import { check_is_authorized_admin } from "../../middleware/authorization";

const authentication_middleware = [authentication.check_access_token]

const router: Router = express.Router()

router.use(authentication_middleware)

// EMPLOYMENT

router.post("/addDepartmentEmployment", [check_is_authorized_admin], admin_department_employment.add_department_employment) // sudah dokumentasi
router.get("/findAll", admin_department_employment.find_all) // sudah dokumentasi
router.get("/findDepartmentEmployment", admin_department_employment.find_department_employment)
router.get("/findFixedDepartmentEmployment", admin_department_employment.find_fixed_department_employment)
router.get("/detail/:id", admin_department_employment.detail_department_employment) // sudah dokumentasi
router.get("/findJabatan/:id", admin_department_employment.find_bagian_department_employment) // sudah dokumentasi
router.patch("/updateDepartmentEmployment/:id", [check_is_authorized_admin], admin_department_employment.update_department_employment) // sudah dokumentasi
router.delete("/deleteDepartmentEmployment/:id", [check_is_authorized_admin], admin_department_employment.hard_delete_department_employment) // sudah dokumentasi

export default router;