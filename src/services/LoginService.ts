import { prisma } from "../prisma/Client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export class LoginService {
    async login(data: {
        identificador: string, //pode ser email ou cpf
        senha: string
    }){
        const usuario = await prisma.usuario.findFirst({
            where: {
                OR:[
                    {email: data.identificador},
                    {cpf: data.identificador}
                ]
            }
        });


        if(!usuario){
            throw new Error("Usuário não encontrado");
        }


        const senhaValida = await bcrypt.compare(data.senha, usuario.senha_hash);

        if(!senhaValida){
            throw new Error("Senha inválida");
        }

        if(!usuario.ativo){
            throw new Error("Conta não verificada");
        }

        const motorista = await prisma.motoristas.findFirst({
            where:{
                user_id: usuario.user_id
            }
        });

        const tipo = motorista ? "motorista" : "responsavel";

        const token = jwt.sign({
            id: usuario.user_id,
            email: usuario.email,
            tipo
            },
            process.env.JWT_SECRET as string,
            {
                expiresIn: "1h"
            }
        );
        return {
            usuario:{
                id: usuario.user_id,
                nome: usuario.nome,
                email: usuario.email,
            },
            tipo,
            token
        };
    }
}