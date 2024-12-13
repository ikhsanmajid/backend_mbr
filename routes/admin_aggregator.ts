import admin_users from "./admin/usersRoutes"
import admin_department from "./admin/departmentsRoutes"
import admin_employment from "./admin/employmentRoutes"
import admin_department_employment from "./admin/departmentVsEmploymentRoutes"
import admin_product_rb from "./admin/product_rb"
import admin_product from "./admin/product"

import { Router } from "express"
import { errorHandler } from "../middleware/handlingError"
import { Request, Response } from "express"

const router: Router = Router()

router.use("/users", admin_users)
router.use("/department", admin_department)
router.use("/employment", admin_employment)
router.use("/department_employment", admin_department_employment)
router.use("/product_rb", admin_product_rb)
router.use("/product", admin_product)

router.get("/getservertime", (req: Request, res: Response) => {
    const dateNow = new Date().toLocaleString()
    return res.send(dateNow)
})

router.use(errorHandler)

export default router;