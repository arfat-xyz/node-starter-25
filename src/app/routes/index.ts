import { Router } from "express";
import { ProductRoutes } from "../modules/products/productRoute";

const router = Router();
const modulesRoute = [
  {
    path: "/products",
    route: ProductRoutes,
  },
];
modulesRoute.filter(mR => router.use(mR.path, mR.route));
export default router;
