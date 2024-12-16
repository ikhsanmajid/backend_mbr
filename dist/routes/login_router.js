"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const authentication = __importStar(require("../middleware/authentication"));
const authorization = __importStar(require("../middleware/authorization"));
const BadRequestError_1 = __importDefault(require("../helper/errors/BadRequestError"));
const handlingError_1 = require("../middleware/handlingError");
passport_1.default.use(authentication.local);
const login = express_1.default.Router();
login.post("/", (req, res, next) => {
    try {
        if (req.body.email == undefined || req.body.email == "" || req.body.password == undefined || req.body.password == "")
            throw new BadRequestError_1.default({ message: "Empty Field", context: { code: 422, message: "Field Input Kosong" } });
        passport_1.default.authenticate('local', { session: false }, (err, user) => {
            try {
                if (user) {
                    res.locals.access_token = user;
                    return next();
                }
                else {
                    throw new BadRequestError_1.default({ message: err.message, context: { code: err.code } });
                }
            }
            catch (err) {
                return next(err);
            }
        })(req, res, next);
    }
    catch (err) {
        next(err);
    }
}, function (req, res) {
    return res.json({
        data: res.locals.access_token
    });
});
login.get("/check", authentication.check_access_token, authorization.check_is_authorized_admin, (req, res) => {
    res.json({
        user: res.locals.userinfo,
        status: "authenticated"
    });
});
login.use(handlingError_1.errorHandler);
exports.default = login;
