import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LivraisonService } from '../../../services/livraison.service';
import { CommandeService } from '../../../services/commande.service';
import { PersonnelService } from '../../../services/personnel.service';
import { AuthService } from '../../../services/auth.service';
import { Livraison } from '../../../models/livraison.model';
import { Commande } from '../../../models/commande.model';
import { Personnel } from '../../../models/personnel.model';

@Component({
  selector: 'app-livraison-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './livraison-list.component.html',
  styleUrls: ['./livraison-list.component.css']
})
export class LivraisonListComponent implements OnInit {
  livraisons: Livraison[] = [];
  filteredLivraisons: Livraison[] = [];
  commandes: Commande[] = [];
  personnel: Personnel[] = [];
  searchTerm: string = '';
  loading: boolean = false;
  error: string = '';
  showModal: boolean = false;
  editMode: boolean = false;
  
  currentLivraison: Livraison = {
    commandId: '',
    deliveryDate: new Date(),
    deliveryPerson: '',
    paymentMode: '',
    status: 'en attente',
    delivererId: ''
  };

  constructor(
    private livraisonService: LivraisonService,
    private commandeService: CommandeService,
    private personnelService: PersonnelService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.loadLivraisons();
    this.loadCommandes();
    this.loadPersonnel();
  }

  loadLivraisons() {
    this.loading = true;
    this.error = '';
    this.livraisonService.getAll().subscribe({
      next: (data) => {
        this.livraisons = data;
        this.filteredLivraisons = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load deliveries';
        this.loading = false;
        console.error(err);
      }
    });
  }

  loadCommandes() {
    this.commandeService.getAll().subscribe({
      next: (data) => {
        this.commandes = data;
      },
      error: (err) => {
        console.error('Failed to load orders', err);
      }
    });
  }

  loadPersonnel() {
    this.personnelService.getAll().subscribe({
      next: (data) => {
        this.personnel = data.filter(p => p.role === 'livreur');
      },
      error: (err) => {
        console.error('Failed to load personnel', err);
      }
    });
  }

  searchLivraisons() {
    if (!this.searchTerm.trim()) {
      this.filteredLivraisons = this.livraisons;
      return;
    }
    
    const term = this.searchTerm.toLowerCase();
    this.filteredLivraisons = this.livraisons.filter(livraison =>
      livraison.deliveryPerson.toLowerCase().includes(term) ||
      livraison.status.toLowerCase().includes(term)
    );
  }

  openCreateModal() {
    this.editMode = false;
    this.currentLivraison = {
      commandId: '',
      deliveryDate: new Date(),
      deliveryPerson: '',
      paymentMode: '',
      status: 'en attente',
      delivererId: ''
    };
    this.showModal = true;
  }

  openEditModal(livraison: Livraison) {
    this.editMode = true;
    this.currentLivraison = { 
      ...livraison,
      deliveryDate: new Date(livraison.deliveryDate)
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  onDelivererChange() {
    const deliverer = this.personnel.find(p => p._id === this.currentLivraison.delivererId);
    if (deliverer) {
      this.currentLivraison.deliveryPerson = `${deliverer.nom} ${deliverer.prenom}`;
    }
  }

  saveLivraison() {
    if (!this.currentLivraison.commandId || !this.currentLivraison.delivererId) {
      this.error = 'Please select an order and a delivery person';
      return;
    }

    if (this.editMode && this.currentLivraison._id) {
      this.livraisonService.update(this.currentLivraison._id, this.currentLivraison).subscribe({
        next: () => {
          this.loadLivraisons();
          this.closeModal();
        },
        error: (err) => {
          this.error = 'Failed to update delivery';
          console.error(err);
        }
      });
    } else {
      this.livraisonService.create(this.currentLivraison).subscribe({
        next: () => {
          this.loadLivraisons();
          this.closeModal();
        },
        error: (err) => {
          this.error = 'Failed to create delivery';
          console.error(err);
        }
      });
    }
  }

  deleteLivraison(id: string | undefined) {
    if (!id) return;
    
    if (confirm('Are you sure you want to delete this delivery?')) {
      this.livraisonService.delete(id).subscribe({
        next: () => {
          this.loadLivraisons();
        },
        error: (err) => {
          this.error = 'Failed to delete delivery';
          console.error(err);
        }
      });
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'livrée': return 'status-delivered';
      case 'en cours': return 'status-progress';
      case 'en attente': return 'status-pending';
      case 'annulée': return 'status-cancelled';
      default: return '';
    }
  }
}

