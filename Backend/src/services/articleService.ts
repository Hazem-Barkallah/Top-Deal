import * as mongodb from "mongodb";
import { getDB } from "../database/index";
import { IArticle, ARTICLE_COLLECTION } from "../models/articleModel";
export class ArticleService {
    private collection() {
        return getDB().collection<IArticle>(ARTICLE_COLLECTION);
    }

    async createArticle(data: IArticle) {
        const result = await this.collection().insertOne(data);
        return { _id: result.insertedId.toString(), ...data };
    }
    async getArticles() {
        return this.collection().find().toArray();
    }
    async getArticleById(id: string) {
        return this.collection().findOne({
            _id: new mongodb.ObjectId(id),
        });
    }
    async updateArticle(id: string, data:
        Partial<IArticle>) {
        await this.collection().updateOne(
            { _id: new mongodb.ObjectId(id) },
            { $set: data }
        );
        return this.getArticleById(id);

    }
    async deleteArticle(id: string) {
        return this.collection().deleteOne({
            _id: new mongodb.ObjectId(id),
        });
    }
}