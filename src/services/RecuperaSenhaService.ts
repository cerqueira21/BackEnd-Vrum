import { prisma } from "../prisma/Client";
import { EmailService } from "./EmailService";
import bcrypt from "bcrypt";


export class RecuperaSenhaService {

    private emailService: EmailService;

    constructor() {
        this.emailService = new EmailService();
    }

    async solicitarRecuperacao(data: { email: string }) {

        const usuario = await prisma.usuario.findUnique({
            where: {
                email: data.email
            }
        });

        if(!usuario){
            throw new Error("Usuário não encontrado");
        }

        const codigo = Math.floor(100000 + Math.random() * 900000).toString();
        const expira = new Date(Date.now() + 10 * 60 * 1000); // expira em 15 minutos

        await prisma.usuario.update({
            where:{
                user_id: usuario.user_id
            },
            data:{
                codigo: codigo,
                codigoExpiraEm: expira
            }
        });

        await this.emailService.enviarCodigo(
            usuario.email,
            codigo,
            usuario.nome
        );
        return {
            message: "Código de recuperação enviado para o email"
        };
    }

    async redefinirSenha(data:{
        email: string,
        codigo: string,
        novaSenha: string
    }){
        const usuario = await prisma.usuario.findUnique({
            where:{
                email: data.email
            }
        });

        if(!usuario){
            throw new Error("Usuário não encontrado");
        }

        if(usuario.codigo !== data.codigo){
            throw new Error("Código de recuperação inválido");
        }

        if(!usuario.codigoExpiraEm || 
            usuario.codigoExpiraEm < new Date()
        ){
            throw new Error("Código de recuperação expirado");
        }

        const senhaHash = await bcrypt.hash(
            data.novaSenha,
            10
        );

        await prisma.usuario.update({
            where:{
                user_id: usuario.user_id
            },
            data: {
                senha_hash: senhaHash,
                codigo: null,
                codigoExpiraEm: null
            } 
        });

        return {
            message: "Senha redefinida com sucesso"
        };
    }
}