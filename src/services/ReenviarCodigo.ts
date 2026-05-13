import { prisma } from "../prisma/Client";
import { EmailService } from "./EmailService";


export class ReenviarCodigoService{

    private emailService = new EmailService();
    
    async reenviar(data:{email: string;}){
        const usuario = await prisma.usuario.findUnique({
            where:{ email: data.email }
        });

        if(!usuario){
            throw new Error("Usuário não encontrado");
        }

        if(usuario.ativo){
            throw new Error("Conta já está ativa");
        }
        
        const codigo = Math.floor(100000 + Math.random()* 900000).toString();
        const expira = new Date(Date.now() + 10 * 60 * 1000); // expira em 15 minutos
        
        await prisma.usuario.update({
            where:{ email: data.email},

            data:{
                codigo,
                codigoExpiraEm: expira
            }
        });
        await this.emailService.enviarCodigo(
            usuario.email,
            codigo,
            usuario.nome
        );

        return {
            message:'Código de verificação reenviado'
        };
    }
}