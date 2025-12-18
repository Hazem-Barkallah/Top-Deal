import * as mongodb from "mongodb";
export interface IArticle extends Document {
designation: string;
quantite: number;
prix: number;
_id?: mongodb.ObjectId;
}
export const ARTICLE_COLLECTION = "article";