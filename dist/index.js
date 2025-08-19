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
const express_1 = __importStar(require("express"));
const admin_aggregator_1 = __importDefault(require("./routes/admin_aggregator"));
const login_router_1 = __importDefault(require("./routes/login_router"));
const users_aggregator_1 = __importDefault(require("./routes/users_aggregator"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const corsOpttion = {
    credentials: true,
    origin: [
        "http://localhost:3000",
        "http://localhost:450",
        "https://konimex:450",
        "https://frontend-mbr.vercel.app",
    ],
};
const app = (0, express_1.default)();
const port = 3001;
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
const router = (0, express_1.Router)();
router.use((0, cors_1.default)(corsOpttion));
router.get("/", (req, res) => {
    res.send("It Works!");
});
router.get("/time", (req, res) => {
    res.json({ time: new Date().toISOString() });
});
router.use("/login", login_router_1.default);
router.use("/admin", admin_aggregator_1.default);
router.use("/users", users_aggregator_1.default);
app.use("/mbr_backend", router);
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
