import { AppError } from "../utils/appError.js";

export function validarCamposMotorista(req, res, next) {
    const { nome, cpf } = req.body;

    if (!nome || !cpf) {
        return next(new AppError("nome e cpf são obrigatórios", 400));
    }
    next();
}
