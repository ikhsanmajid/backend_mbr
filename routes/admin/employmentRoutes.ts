import express, { Router } from "express";
import * as admin_employment from "../../controller/admin/admin_employment";
import * as authentication from "../../middleware/authentication";
import { check_is_authorized_admin } from "../../middleware/authorization";

const authentication_middleware = [authentication.check_access_token]

const router: Router = express.Router()

router.use(authentication_middleware)

// EMPLOYMENT

router.post("/addEmployment", [check_is_authorized_admin], admin_employment.add_employment)
router.get("/findAll", admin_employment.find_all)
router.get("/findEmployment", admin_employment.find_employment)
router.get("/findFixedEmployment", admin_employment.find_fixed_employment) 
router.get("/detail/:id", admin_employment.detail_employment)
router.patch("/updateEmployment/:id", [check_is_authorized_admin], admin_employment.update_employment)
router.delete("/deleteEmployment/:id", [check_is_authorized_admin], admin_employment.hard_delete_employment)


export default router;