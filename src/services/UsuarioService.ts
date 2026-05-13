import { prisma } from "../prisma/Client"; //importando conexão com o banco de dados
import bcrypt from "bcrypt"; //importando biblioteca para criptografar a senha
import { EmailService } from "./EmailService"; //importando serviço de email

// Serviço para criar um novo usuário
export class UsuarioService {
    private emailService = new EmailService();

    async cadastrar(data:{
        nome: string; 
        cpf: string; 
        email:string; 
        senha_hash: string; 
        tel_user: string
    }) {

        // Validação básica
        if(!data.nome || !data.cpf || !data.email || !data.senha_hash || !data.tel_user) {
            throw new Error("Campos obrigatórios não preenchidos");
        }

        if(data.senha_hash.length < 6) {
            throw new Error("A senha deve conter pelo menos 6 caracteres");
        }


        // primeira regra: verificar se o email ou CPF já existe
        const usuarioExistente = await prisma.usuario.findFirst({
            where: {
                OR:[
                    {email: data.email},
                    {cpf: data.cpf}
                ]
            }
        });

        if (usuarioExistente){
            if(usuarioExistente.email === data.email) {
                throw new Error("Email já cadastrado");
            }

            if(usuarioExistente.cpf === data.cpf) {
                throw new Error("CPF já cadastrado");
            }
        }

        // criptografar a senha
        const senhaHash = await bcrypt.hash(data.senha_hash, 10);

        //gerar codigo
        const codigo = Math.floor(100000 + Math.random() * 900000).toString();
        const expira = new Date(Date.now() + 10 * 60 * 1000); // expira em 15 minutos

        

        // salvar no banco de dados
        const usuario = await prisma.usuario.create({
            data: {
                nome: data.nome,
                cpf: data.cpf,
                email: data.email,
                senha_hash: senhaHash,
                tel_user: data.tel_user,
                ativo: false,
                codigo,
                codigoExpiraEm: expira
            }
        });

        try{
            console.log("chegou no email service") //teste
            await this.emailService.enviarCodigo(
                data.email, 
                codigo, 
                data.nome
            );
        } catch{
            throw new Error(
                "Usuário criado, mas falha ao enviar email de verificação."
            )
        }
        

        console.log("Código:", codigo) //teste

        return{
            message:"Usuario criado. verifique o codigo",
            user_id: usuario.user_id
        };
    }
}