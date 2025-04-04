import httpStatus from "http-status";
import { IProduct } from "./productInterface";
import { ProductService } from "./productService";
import { Request, Response } from "express";
import { productFilterableFields } from "./productConstant";
import catchAsync from "../../../shared/cacheAsync";
import sendResponse from "../../../shared/sentResponse";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";

const createProduct = catchAsync(async (req: Request, res: Response) => {
  const payload: IProduct = req.body;
  const result = await ProductService.createProduct(payload);
  sendResponse<IProduct>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Product created successfully.`,
    data: result,
  });
});
const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields);
  const filters = pick(req.query, productFilterableFields);
  const result = await ProductService.getAllProducts(
    paginationOptions,
    filters,
  );
  sendResponse<IProduct[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Product created successfully.`,
    meta: result.meta || null,
    data: result.data || null,
  });
});
export const ProductController = { createProduct, getAllProducts };
