import { PrismaClient, Cart, Product } from '@prisma/client'
import { v4 as uuid } from 'uuid';

const prisma = new PrismaClient()

export const addProductToCart = async(productId: string, userId: string, quantity: number): Promise<string> => {
    const id:string = uuid();
    
    await prisma.product.findUnique({
        where: {
            id: id
        }
    })
    .then( product => {
        const stock = product?.stock || 0
        if(stock < quantity){
            throw new Error('Jumlah melebihi batas ketersediaan');
        }
    })

    await prisma.cart.create({
        data: {
            id,
            productId,
            userId,
            quantity
        }
    });
    return id;
}


export const findProductsInCart = async (userId: string):Promise<Product[]> => {
    const cartProducts:Array<any> = await prisma.cart.findMany({
        include: {
            products: true
        },
        where: {
            userId
        }
    });

    return cartProducts.map( cart => cart.products);
}

export const editCartById =async (id:string, quantity: number)=> {
    await prisma.cart.update({
        data: {
            quantity
        },
        where: {
            id
        }
    });
}

export const deleteCartById = async (id:string) => {
    await prisma.cart.delete({
        where: {
            id: id
        }
    });
}