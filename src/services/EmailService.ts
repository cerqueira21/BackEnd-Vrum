import { info } from "console";
import nodemailer from "nodemailer";


export class EmailService{

    async enviarCodigo(
        email:string, 
        codigo:string, 
        nome:string
    ) {
        try {
            console.log(process.env.EMAIL_USER);
            console.log(process.env.EMAIL_PASS);
            const transporter = nodemailer.createTransport({
            service: 'gmail',

            auth:{
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Código de Verificação VRUM",

            html:`
                <H1>Olá, ${nome}!</H1>
                <h2>Está aqui seu código de verificação é: <strong>${codigo}</strong></h2>
            `
        });
        console.log("EMAIL ENVIADO");
        console.log(info);
        } catch (error){
            console.error(error);
            throw new Error("Erro ao enviar email de verificação");
        }
    }
}