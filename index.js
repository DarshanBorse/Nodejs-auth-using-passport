import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import UserRoutes from "./routes/user.routes";
import passport from "passport"
import GoogleRoutes from "./routes/auth/google.routes";
import FacebookRoutes from "./routes/auth/facebook.routes";
import { config } from "dotenv";
import PasswordResetRoute from "./routes/auth/passwordReset.routes";

config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Database Connection 
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://127.0.0.1/${process.env.DB_NAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log(`Connected mongodb`);
}).catch((error) => {
    console.error(error);
});

// All Routes 
UserRoutes(app);
GoogleRoutes(app);
FacebookRoutes(app);
PasswordResetRoute(app);

app.get('/', (req, res) => {
    return res.send(`Node and express server running on port ${PORT}`);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});