import { Request, Response, NextFunction } from 'express';
import { addOrder, findOrdersBySellerId } from '../../services/postgres/order';
import { verifySellerRole } from '../../services/postgres/user';
import { Order } from '@prisma/client';

interface ProductOrdered{
    id: string;
    quantity: number | 1;
    price?: number;
}

export const postOrderCheckout = async (req: Request, res: Response) => {
    try {
        const { userId } = (req as any)
        const paymentMethod: string = req.body?.paymentMethod as string | 'Cash'
        const arrOrder: Array<string> | ProductOrdered[] = req.body.products;
        const order = arrOrder.map( item => {
            const productOrdered: ProductOrdered = typeof item === 'string' ? {
                id: item,
                quantity: 1,
            } : {
                id: item.id,
                quantity: item.quantity
            }

            return productOrdered;
        })

        const orderId = await addOrder(userId, paymentMethod, order )

        res.json({
            code: 201,
            status: 'created',
            data: {
                id: orderId
            }
        })
    } catch (error) {
        res.json({
            err: error
        })
    }
}

export const getSellerOrder = async (req: Request, res: Response) => {
    try {
        const { userId } = (req as any)
        const sellerId = await verifySellerRole(userId);

        const orders:Order[] = await findOrdersBySellerId(sellerId);
        
        res.json({
            code: 200,
            status: 'ok',
            data: {
                orders
            }
        })
    } catch (error) {
        res.json({
            err: error
        })
    }
}