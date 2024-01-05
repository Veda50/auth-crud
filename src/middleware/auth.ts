import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const accessValidation = (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization;

    if (!authorization) {
        return res.status(401).json({ message: 'User belum login' });
    }

    const token = authorization.split(' ')[1];
    const secret = process.env.JWT_SECRET!;

    try {
        const jwtDecode = jwt.verify(token, secret);

        if (typeof jwtDecode !== 'string') {
            (req as any).userId = jwtDecode;
        }
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    next();
}

export default accessValidation;
