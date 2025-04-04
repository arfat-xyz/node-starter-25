import { Router } from 'express';
import { ProductController } from './productController';
import { productZodSchema } from './productZodValidation';
import zodValidateRequest from '../../middlewares/zodValidateRequest';

const router = Router();

router.post(
  '/',
  zodValidateRequest(productZodSchema.createProduct),
  ProductController.createProduct,
);
router.get('/', ProductController.getAllProducts);

export const ProductRoutes = router;
