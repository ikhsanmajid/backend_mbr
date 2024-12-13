import express, { Router } from "express";

import * as authentication from "../../middleware/authentication";
import { check_is_authorized_admin, check_user_has_department, get_user_department } from "../../middleware/authorization";
import * as admin_product from "../../controller/admin/admin_product";

const authentication_middleware = [authentication.check_access_token]

const router: Router = express.Router()

router.use(authentication_middleware)


//Kategori
router.get("/getKategori", admin_product.get_kategori)

// Produk
router.post("/addProduct", [check_is_authorized_admin], admin_product.add_product)
router.get("/getProduct", [check_user_has_department, get_user_department], admin_product.get_product)
router.get("/checkProduct", admin_product.check_product)
router.delete("/deleteProduct/:id", [check_is_authorized_admin], admin_product.delete_product)
router.put("/editProduct/:id", [check_is_authorized_admin], admin_product.edit_product)


export default router;