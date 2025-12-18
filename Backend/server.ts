import * as dotenv from "dotenv";
dotenv.config();
import app from "./app";

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`demarrage du serveur sur le port ${PORT}`));