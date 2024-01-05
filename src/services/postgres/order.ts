import { PrismaClient, Order, OrderProduct, Product, Prisma } from '@prisma/client'
import { v4 as uuid } from 'uuid';

const prisma = new PrismaClient()

interface ProductOrdered{
    id: string,
    quantity: number
    price?: number
}

export const addOrder = async(userId: string, paymentMethod: string, productsOrdered: ProductOrdered[]): Promise<string> => {
    const id:string = uuid();
    const productsOrder: ProductOrdered[] = await Promise.all(productsOrdered.map(async (value) => {
        const product =  await prisma.product.findUnique({
          where: {
            id: value.id
          }
        })
        return {
            id: value.id,
            quantity: value.quantity,
            price: product?.price
        }
    }))

    const total: number = productsOrder.reduce((total, product) => {
        return product.price ? total + (product.price! * product.quantity) : total
    }, 0)

    const orderProducts: any = productsOrder.map( item => {
        return {
        orderId: id,
        productId: item.id,
        quantity: item.quantity
    }})

    await prisma.order.create({
        data: {
            id,
            userId,
            totalPrice: total,
            paymentMethod,
            orderProducts: orderProducts
        }
    })

    return id;
}