import * as mongodb from "mongodb";
const uri = process.env.DB_URI ||"mongodb://localhost:27017";
export const client = new mongodb.MongoClient(uri);
let db: mongodb.Db;
export const connectDB = async () => {
try {
await client.connect();
db = client.db("erp");

console.log("MongoDB est connecte");
} catch (err) {
console.error("Erreur de connection MongoDB:", err);
}
};
export const getDB = () => db;