import { PrismaClient, Product } from '@prisma/client'
import { v4 as uuid } from 'uuid';

const prisma = new PrismaClient()

export const addProduct =async (sellerId: string, name: string, stock: number, price: number, category: string, description:string) => {
    const id: string = uuid()

    await prisma.product.create({
        data: {
            id,
            sellerId,
            name,
            stock,
            price,
            category,
            description
        }
    })

    return id;
}

export const findAllProducts = async ():Promise<Product[]> => {
    const products: Product[] = await prisma.product.findMany();

    return products;
}

export const findProductById = async (id: string): Promise<Product> =>{
    const product:Product = await prisma.product.findUniqueOrThrow({
        where: {
            id: id
        }
    });

    return product;
}

export const findProductsBySellerId = async (sellerId: string): Promise<Product> =>{
    const product:Product = await prisma.product.findFirstOrThrow({
        where: {
            sellerId: sellerId
        }
    });

    return product;
}

export const editProductById =async (id:string, newData: Partial<Product>)=> {
    await prisma.product.update({
        data: {
            ...newData
        },
        where: {
            id: id
        }
    });
}

export const deleteProductById = async (id:string) => {
    await prisma.product.delete({
        where: {
            id: id
        }
    });
}