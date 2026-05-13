import type { Request, Response } from "express";
import { UsuarioService } from "../services/UsuarioService";

const usuarioService = new UsuarioService();

export class UsuarioController {
    async create(req: Request, res: Response) {
        const { nome, cpf, email, senha, telefone} = req.body;

        const usuario = await usuarioService.cadastrar({
            nome,
            cpf,
            email,
            senha_hash: req.body.senha,
            tel_user: req.body.telefone
        });
        return res.status(201).json(usuario);
    }
}
