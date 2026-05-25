import {Router} from "express"; //pegando Router(é uma ferramenta) do express. Router é um organizador de rotas
import {UsuarioController} from "../controllers/UsuarioController"; // importando a classe que tem a logica de entrada
import { UsuarioService } from"../services/UsuarioService";
import { ConfirmacaoService } from "../services/CofirmacaoService";
import { ReenviarCodigoService } from "../services/ReenviarCodigo";
import { LoginService } from "../services/LoginService";
import { authMiddleware } from "../middlewares/AuthMiddleware";
import { RecuperaSenhaService } from "../services/RecuperaSenhaService";


const router = Router(); //criando uma instancia do Router, ou seja, um organizador de rotas

const usuarioController = new UsuarioController(); //criando uma instancia da classe UsuarioController, ou seja, um objeto que tem a logica de entrada
const usuarioService = new UsuarioService();
const confirmacaoService = new ConfirmacaoService();
const reenviarCodigoService = new ReenviarCodigoService();
const loginService = new LoginService();
const recuperaSenhaService = new RecuperaSenhaService();
//cadastro
router.post("/cadastro", async (req, res) => {
    try{
        const result = await usuarioService.cadastrar(req.body);
        res.json(result);
    } catch(error:any){
        res.status(400).json({error: error.message});
    }
});

//confirmação

router.post("/confirmar", async(req, res) => {
    try{
        const result = await confirmacaoService.confirmar(
            req.body
        );
        return res.json(result);
    } catch(error:any){
        return res.status(400).json({error: error.message});
    }
});

//reenviar codigo
router.post("/reenviar", async(req, res) =>{
    try{
        const result = await reenviarCodigoService.reenviar(
            req.body
        );
        return res.json(result);
    } catch(error:any){
        return res.status(400).json({error: error.message});
    }
});

// login
router.post("/login", async(req, res) => {
    try{
        const {identificador, senha} = req.body;
        const result = await loginService.login({
            identificador,
            senha
        });
        return res.json(result);
    } catch(error:any){
        return res.status(400).json({error: error.message});
    }
});

router.get(
    "/perfil",
    authMiddleware,
    async(req, res) => {

        return res.json({
            message: "Rota protegida funcionando",
            usuario: req.user
        });
    }
);

router.post("/recuperarSenha", async(req, res) => {
    try{
        const {email} = req.body;
        const result = await recuperaSenhaService.solicitarRecuperacao({email});

        return res.json(result);
    }catch(error:any){
        return res.status(400).json({error: error.message});
    }
});

router.post("/redefinirSenha", async(req, res) => {
    try{
        const result = await recuperaSenhaService.redefinirSenha(req.body);
        return res.json(result);
    }catch(error:any){
        return res.status(400).json({error: error.message});
    }
});



export { router as usuarioRoutes };
