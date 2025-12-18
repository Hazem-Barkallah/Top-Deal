import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommandeService } from '../../../services/commande.service';
import { ClientService } from '../../../services/client.service';
import { ArticleService } from '../../../services/article.service';
import { AuthService } from '../../../services/auth.service';
import { Commande, ArticleInCommande } from '../../../models/commande.model';
import { Client } from '../../../models/client.model';
import { Article } from '../../../models/article.model';

@Component({
  selector: 'app-commande-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './commande-list.component.html',
  styleUrls: ['./commande-list.component.css']
})
export class CommandeListComponent implements OnInit {
  commandes: Commande[] = [];
  filteredCommandes: Commande[] = [];
  clients: Client[] = [];
  articles: Article[] = [];
  searchTerm: string = '';
  loading: boolean = false;
  error: string = '';
  showModal: boolean = false;
  editMode: boolean = false;
  
  currentCommande: Commande = {
    client: '',
    dateCommande: new Date(),
    statut: 'en cours',
    montantTotal: 0,
    articles: []
  };

  selectedArticle: string = '';
  selectedQuantity: number = 1;

  constructor(
    private commandeService: CommandeService,
    private clientService: ClientService,
    private articleService: ArticleService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.loadCommandes();
    this.loadClients();
    this.loadArticles();
  }

  loadCommandes() {
    this.loading = true;
    this.error = '';
    this.commandeService.getAll().subscribe({
      next: (data) => {
        // Recalculate montantTotal for each commande based on articles
        this.commandes = data.map(commande => ({
          ...commande,
          montantTotal: this.calculateCommandeTotal(commande)
        }));
        this.filteredCommandes = this.commandes;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load orders';
        this.loading = false;
        console.error(err);
      }
    });
  }

  loadClients() {
    this.clientService.getAll().subscribe({
      next: (data) => {
        this.clients = data;
      },
      error: (err) => {
        console.error('Failed to load clients', err);
      }
    });
  }

  loadArticles() {
    this.articleService.getAll().subscribe({
      next: (data) => {
        this.articles = data;
      },
      error: (err) => {
        console.error('Failed to load articles', err);
      }
    });
  }

  searchCommandes() {
    if (!this.searchTerm.trim()) {
      this.filteredCommandes = this.commandes;
      return;
    }
    
    const term = this.searchTerm.toLowerCase();
    this.filteredCommandes = this.commandes.filter(commande =>
      commande.client.toLowerCase().includes(term) ||
      commande.statut.toLowerCase().includes(term)
    );
  }

  openCreateModal() {
    this.editMode = false;
    const clientId = this.authService.getClientId();
    this.currentCommande = {
      client: clientId || '',
      dateCommande: new Date(),
      statut: 'en cours',
      montantTotal: 0,
      articles: []
    };
    this.showModal = true;
  }

  openEditModal(commande: Commande) {
    this.editMode = true;
    this.currentCommande = { 
      ...commande,
      dateCommande: new Date(commande.dateCommande)
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedArticle = '';
    this.selectedQuantity = 1;
  }

  addArticleToCommande() {
    if (!this.selectedArticle || this.selectedQuantity <= 0) {
      return;
    }

    const article = this.articles.find(a => a._id === this.selectedArticle);
    if (!article) return;

    // Check if article has sufficient stock
    if (article.quantite < this.selectedQuantity) {
      this.error = `Insufficient stock for ${article.designation}. Available: ${article.quantite}`;
      return;
    }

    // Check if adding this quantity would exceed available stock
    const existingArticle = this.currentCommande.articles.find(a => a._id === article._id);
    const totalRequested = existingArticle ? existingArticle.quantite + this.selectedQuantity : this.selectedQuantity;
    
    if (totalRequested > article.quantite) {
      this.error = `Cannot add ${this.selectedQuantity} more. Total requested (${totalRequested}) exceeds available stock (${article.quantite})`;
      return;
    }

    this.error = ''; // Clear any previous errors

    if (existingArticle) {
      existingArticle.quantite += this.selectedQuantity;
    } else {
      this.currentCommande.articles.push({
        _id: article._id!,
        designation: article.designation,
        quantite: this.selectedQuantity,
        prix: article.prix
      });
    }

    this.calculateTotal();
    this.selectedArticle = '';
    this.selectedQuantity = 1;
  }

  removeArticleFromCommande(index: number) {
    this.currentCommande.articles.splice(index, 1);
    this.calculateTotal();
  }

  calculateTotal() {
    this.currentCommande.montantTotal = this.currentCommande.articles.reduce(
      (total, article) => total + (article.prix * article.quantite),
      0
    );
  }

  calculateCommandeTotal(commande: Commande): number {
    return commande.articles.reduce(
      (total, article) => total + (article.prix * article.quantite),
      0
    );
  }

  saveCommande() {
    if (!this.currentCommande.client || this.currentCommande.articles.length === 0) {
      this.error = 'Please select a client and add at least one article';
      return;
    }

    if (this.editMode && this.currentCommande._id) {
      this.commandeService.update(this.currentCommande._id, this.currentCommande).subscribe({
        next: () => {
          this.loadCommandes();
          this.closeModal();
        },
        error: (err) => {
          this.error = 'Failed to update order';
          console.error(err);
        }
      });
    } else {
      this.commandeService.create(this.currentCommande).subscribe({
        next: () => {
          this.loadCommandes();
          this.closeModal();
        },
        error: (err) => {
          this.error = 'Failed to create order';
          console.error(err);
        }
      });
    }
  }

  deleteCommande(id: string | undefined) {
    if (!id) return;
    
    if (confirm('Are you sure you want to delete this order?')) {
      this.commandeService.delete(id).subscribe({
        next: () => {
          this.loadCommandes();
        },
        error: (err) => {
          this.error = 'Failed to delete order';
          console.error(err);
        }
      });
    }
  }

  getClientName(clientId: string): string {
    const client = this.clients.find(c => c._id === clientId);
    return client ? client.nom : clientId;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Validée': return 'status-validated';
      case 'en cours': return 'status-progress';
      case 'annulée': return 'status-cancelled';
      default: return '';
    }
  }
}



