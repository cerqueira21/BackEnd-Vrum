import express, {Request,Response} from "express";
import { usuarioRoutes} from "./routes/UsuarioRoutes";
import "dotenv/config";

const app = express();

app.use(express.json());

// usando rotas de usuario
app.use("/usuarios", usuarioRoutes);

app.get("/", (req: Request, res: Response) => {
    return res.send("Servidor rodando!");
});

app.listen(3000,() => {
    console.log("Servidor rodando em http://localhost:3000");
});
