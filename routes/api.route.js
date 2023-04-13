"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const card_controller_1 = __importDefault(require("../controllers/apis/card-controller"));
const route_1 = __importDefault(require("./route"));
class ApiRoute extends route_1.default {
    constructor() {
        super();
        this.cardController = new card_controller_1.default();
        this.prefix = '/api';
        this.setRoutes();
    }
    setRoutes() {
        this.router.post('/submit', this.cardController.submit);
    }
}
exports.default = ApiRoute;
