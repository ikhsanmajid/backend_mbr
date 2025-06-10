"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_aggregator_1 = __importDefault(require("./routes/admin_aggregator"));
const login_router_1 = __importDefault(require("./routes/login_router"));
const users_aggregator_1 = __importDefault(require("./routes/users_aggregator"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const corsOpttion = {
    credentials: true,
    origin: ["http://localhost:3000", "https://frontend-mbr.vercel.app", "http://localhost:8080", "https://mbr.ikhsanmajid.my.id", "http://10.42.0.1:3000", "http://10.42.0.243:3000"]
};
const app = (0, express_1.default)();
const port = 3001;
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)(corsOpttion));
app.get("/", (req, res) => {
    res.send("It Works!");
});
app.get("/time", (req, res) => {
    res.json({ time: new Date().toISOString() });
});
app.use("/login", login_router_1.default);
app.use("/admin", admin_aggregator_1.default);
app.use("/users", users_aggregator_1.default);
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
