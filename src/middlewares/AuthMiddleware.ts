import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayLoad{
    id: number;
    email: string;
}

export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
){
    try{
        const authHeader = req.headers.authorization;

        if(!authHeader){
            return res.status(401).json({
                error: 'Token não fornecido'
            });
    }

    const [, token] = authHeader.split(' ');
    if(!token){
        return res.status(401).json({
            error: 'Token não fornecido'
        });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    const payload = decoded as TokenPayLoad;

    req.user={
        id: payload.id
    };

    next();
    }catch(error){
        return res.status(401).json({
            error: 'Token inválido'
        });
    }
}