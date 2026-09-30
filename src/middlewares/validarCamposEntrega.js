import { AppError } from "../utils/appError";

export function validarCamposEntrega(req, res, next) {
    const { descricao,origem, destino } = req.body;

    if (!descricao || !origem || !destino) {
        return next(new AppErrpr("descrição, origem e destino são obrigatórios", 400));
    }
    nexxt();
}
