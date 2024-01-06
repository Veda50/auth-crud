import { Request, Response, NextFunction } from 'express';
import { verifySellerRole } from '../../services/postgres/user'
import { addProduct, findAllProducts, findProductById, findProductsBySellerId } from '../../services/postgres/product';
import { Product } from '@prisma/client';
import { addProductToCart } from '../../services/postgres/cart';

export const addNewProduct = async (req: Request, res: Response) => {
    try {
    const { name, stock, price, category, description} = req.body;
    const { userId } = (req as any);
    const sellerId:string = (await verifySellerRole(userId)).toString();

    const productId = await addProduct(sellerId, name, stock, price, category, description);
    res.json({
        code: 201,
        status: 'created',
        data: {
            id: productId
        }
    })        
    } catch (error) {
        res.json({
            err: error
        })  
    }
}

export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products: Product[] = await findAllProducts()

        res.json({
            code: '200',
            status: 'ok',
            data: products
        })
    } catch (error) {
        res.json({
            err: error
        })
    }
}

export const getProductById = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;

        const product: Product = await findProductById(productId as string);
        res.json({
            code: 200,
            status: 'ok',
            data: product
        })
    } catch (error) {
        res.json({
            err: error
        })
    }
}

export const getAllProductsBySellerId =  async (req: Request, res: Response) => {
    try {
        const { sellerId } = req.query;
        
        const product = await findProductsBySellerId(sellerId as string);

        res.json({
            code: 200,
            status: 'ok',
            data: {
                products: product
            }
        })
    } catch (error) {
        res.json({
            err: error
        })
    }
}

export const postProductToUserCart = async (req: Request, res: Response) => {
    try {
        const {productId} = req.params;
        const { userId } = (req as any)
        const quantity: number = req.body.quantity | 1

        const cartId: string = await addProductToCart(productId, userId, quantity);

        res.json({
            code: 200,
            status: 'ok',
            data: {
                id: cartId
            }
        })
    } catch (error) {
        res.json({
            err: error
        })
    }
}