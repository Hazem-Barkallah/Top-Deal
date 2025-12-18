import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ArticleService } from '../../../services/article.service';
import { AuthService } from '../../../services/auth.service';
import { Article } from '../../../models/article.model';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css']
})
export class ArticleListComponent implements OnInit {
  articles: Article[] = [];
  filteredArticles: Article[] = [];
  searchTerm: string = '';
  loading: boolean = false;
  error: string = '';
  showModal: boolean = false;
  editMode: boolean = false;

  currentArticle: Article = {
    designation: '',
    quantite: 0,
    prix: 0
  };

  constructor(
    private articleService: ArticleService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.loadArticles();
  }

  loadArticles() {
    this.loading = true;
    this.error = '';
    this.articleService.getAll().subscribe({
      next: (data) => {
        this.articles = data;
        this.filteredArticles = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load articles';
        this.loading = false;
        console.error(err);
      }
    });
  }

  searchArticles() {
    if (!this.searchTerm.trim()) {
      this.filteredArticles = this.articles;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredArticles = this.articles.filter(article =>
      article.designation.toLowerCase().includes(term)
    );
  }

  isInStock(article: Article): boolean {
    return article.quantite > 0;
  }

  getStockStatus(article: Article): string {
    if (article.quantite === 0) return 'Out of Stock';
    if (article.quantite < 10) return 'Low Stock';
    return 'In Stock';
  }

  openCreateModal() {
    this.editMode = false;
    this.currentArticle = {
      designation: '',
      quantite: 0,
      prix: 0
    };
    this.showModal = true;
  }

  openEditModal(article: Article) {
    this.editMode = true;
    this.currentArticle = { ...article };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.currentArticle = {
      designation: '',
      quantite: 0,
      prix: 0
    };
  }

  saveArticle() {
    if (!this.currentArticle.designation || this.currentArticle.prix < 0 || this.currentArticle.quantite < 0) {
      this.error = 'Please fill all required fields with valid values';
      return;
    }

    if (this.editMode && this.currentArticle._id) {
      this.articleService.update(this.currentArticle._id, this.currentArticle).subscribe({
        next: () => {
          this.loadArticles();
          this.closeModal();
        },
        error: (err) => {
          this.error = 'Failed to update article';
          console.error(err);
        }
      });
    } else {
      this.articleService.create(this.currentArticle).subscribe({
        next: () => {
          this.loadArticles();
          this.closeModal();
        },
        error: (err) => {
          this.error = 'Failed to create article';
          console.error(err);
        }
      });
    }
  }

  deleteArticle(id: string | undefined) {
    if (!id) return;

    if (confirm('Are you sure you want to delete this article?')) {
      this.articleService.delete(id).subscribe({
        next: () => {
          this.loadArticles();
        },
        error: (err) => {
          this.error = 'Failed to delete article';
          console.error(err);
        }
      });
    }
  }
}
