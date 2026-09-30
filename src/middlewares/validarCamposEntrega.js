import { AppError } from "../utils/appError.js";

export function validarCamposEntrega(req, res, next) {
    const { descricao,origem, destino } = req.body;

    if (!descricao || !origem || !destino) {
        return next(new AppError("descrição, origem e destino são obrigatórios", 400));
    }
    next();
}
