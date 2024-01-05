import { Request, Response, NextFunction } from 'express';
import { addUser, verifyUserCredential } from '../../services/postgres/user'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken';

dotenv.config()

export const registNewUser = async (req: Request, res: Response) => {
    try {
  const { name, email, password} = req.body;

  const result = await addUser( name, email, password);
  res.json({
    code: 201,
    message: 'user created',
    data: {
        id: result
    }
  })        
    } catch (error) {
       res.json({
        err: error
       }) 
    }
};

export const loginUserAccount = async (req: Request, res: Response) => {
    try {
        const { email, password} = req.body;
        const userId = await verifyUserCredential(email, password);
        if(!userId){
            throw new Error('Gagal login..')
        }

        const secret: any = process.env.JWT_SECRET;
        const expiresIn = 60 * 60 * 1;
        const token = jwt.sign(userId, secret, {expiresIn: expiresIn})

        return res.json({
            data: {
                id: userId,
                token
            }
        })
    } catch (error) {
        res.json({
            err: error
        })
    }
}

