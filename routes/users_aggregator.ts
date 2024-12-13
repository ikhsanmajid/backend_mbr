import rb from "./users/rb"

import { Router } from "express"
import { errorHandler } from "../middleware/handlingError"

const router: Router = Router()

router.use("/rb", rb)

router.use(errorHandler)

export default router;