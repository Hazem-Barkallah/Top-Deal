import { Request, Response } from "express";
import { ArticleService } from "../services/articleService";
const articleService = new ArticleService();
export class ArticleController {
    async create(req: Request, res: Response) {
        try {
            const Article = await
                articleService.createArticle(req.body);
            res.status(201).json(Article);

        } catch (err: any) {
            res.status(400).json({ message: err.message });
        }
    }
    async getAll(req: Request, res: Response) {
        const Articles = await articleService.getArticles();
        res.json(Articles);
    }
    async getById(req: Request, res: Response) {
        const Article = await
            articleService.getArticleById(req.params.id);
        if (!Article) return res.status(404).json({
            message:
                "Article Inexistant"
        });
        res.json(Article);
    }
    async update(req: Request, res: Response) {
        try {
            const Article = await
                articleService.updateArticle(req.params.id, req.body);
            if (!Article) return res.status(404).json({
                message:
                    "Article Inexistant"
            });
            res.json(Article);
        } catch (err: any) {
            res.status(400).json({ message: err.message });
        }
    }
    async delete(req: Request, res: Response) {
        const Article = await
            articleService.deleteArticle(req.params.id);
        if (!Article) return res.status(404).json({
            message:
                "Article Inexistant"
        });
        res.json({ message: "Article supprimé avec succès" });
    }
}