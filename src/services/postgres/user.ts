import { PrismaClient } from '@prisma/client'
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export const addUser = async (name: string, email: string, password: string): Promise<string> => {
  const id: string = uuid()
  const hashedPassword = await bcrypt.hash(password, 15);

  await prisma.user.create({
    data: { 
      id,
      name,
      email,
      password: hashedPassword,
    }
  })

  return id;
}

export const verifyUserCredential = async (email: string, password: string): Promise<string> => {
  const user = await prisma.user.findFirst({
    where: {
      email: {
        equals: email
      }
    }
  })
  if(!user){
    throw new Error('User Tidak ditemukan')
  }
  const result:boolean = await bcrypt.compare(password, user.password);
  if(!result){
    throw new Error('Password tidak sesuai')
  }
  return user.id
}

export const addSellerRole = async (userId: string): Promise<string> => {
  const id: string = uuid()

  await prisma.seller.create({
    data: {
      id,
      userId
    }
  })

  return id;
}

export const createSellerUser = async (name: string, email: string, password: string) => {
  const userId: string = uuid()
  const sellerId: string = uuid()
  const hashedPassword = await bcrypt.hash(password, 15);

  await prisma.user.create({
    data: { 
      id: userId,
      name,
      email,
      password: hashedPassword,
      seller: {
        create: {
          id: sellerId,
        }
      }
    }
  })

  return {
    userId,
    sellerId
  };
}

export const verifySellerRole =async (userId:string): Promise<string> => {
  const seller = await prisma.seller.findFirst({
    where: {
      userId: {
        equals: userId
      }
    }
  })
  if(seller){
    return seller.id
  }
  throw new Error('Penjual tidak ditemukan')
}