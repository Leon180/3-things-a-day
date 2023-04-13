"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_connect_1 = __importDefault(require("../../config/sequelize-connect"));
const models_1 = require("../../models");
sequelize_connect_1.default.addModels([models_1.Card]);
class CardController {
    submit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { title, type, start, end, record } = req.body;
                if (record.length > 200)
                    throw new Error("length limit is 200 characters!");
                const create = yield models_1.Card.create(Object.assign({}, req.body));
                if (!create)
                    throw new Error("Create failed!");
                return res.json({
                    status: "success",
                    message: "Create successfully!"
                });
            }
            catch (error) {
                res.status(400).json({
                    status: "failure",
                    message: error.message
                });
            }
        });
    }
}
exports.default = CardController;
