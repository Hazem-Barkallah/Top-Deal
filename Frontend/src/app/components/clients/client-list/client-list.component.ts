import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../../services/client.service';
import { Client } from '../../../models/client.model';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {
  clients: Client[] = [];
  filteredClients: Client[] = [];
  searchTerm: string = '';
  loading: boolean = false;
  error: string = '';
  showModal: boolean = false;
  editMode: boolean = false;
  
  currentClient: Client = {
    nom: '',
    email: '',
    telephone: '',
    adresse: ''
  };

  constructor(private clientService: ClientService) {}

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    this.loading = true;
    this.error = '';
    this.clientService.getAll().subscribe({
      next: (data) => {
        this.clients = data;
        this.filteredClients = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load clients';
        this.loading = false;
        console.error(err);
      }
    });
  }

  searchClients() {
    if (!this.searchTerm.trim()) {
      this.filteredClients = this.clients;
      return;
    }
    
    const term = this.searchTerm.toLowerCase();
    this.filteredClients = this.clients.filter(client =>
      client.nom.toLowerCase().includes(term) ||
      client.email.toLowerCase().includes(term)
    );
  }

  openCreateModal() {
    this.editMode = false;
    this.currentClient = {
      nom: '',
      email: '',
      telephone: '',
      adresse: ''
    };
    this.showModal = true;
  }

  openEditModal(client: Client) {
    this.editMode = true;
    this.currentClient = { ...client };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.currentClient = {
      nom: '',
      email: '',
      telephone: '',
      adresse: ''
    };
  }

  saveClient() {
    if (!this.currentClient.nom || !this.currentClient.email) {
      this.error = 'Name and email are required';
      return;
    }

    if (this.editMode && this.currentClient._id) {
      this.clientService.update(this.currentClient._id, this.currentClient).subscribe({
        next: () => {
          this.loadClients();
          this.closeModal();
        },
        error: (err) => {
          this.error = 'Failed to update client';
          console.error(err);
        }
      });
    } else {
      this.clientService.create(this.currentClient).subscribe({
        next: () => {
          this.loadClients();
          this.closeModal();
        },
        error: (err) => {
          this.error = 'Failed to create client';
          console.error(err);
        }
      });
    }
  }

  deleteClient(id: string | undefined) {
    if (!id) return;
    
    if (confirm('Are you sure you want to delete this client?')) {
      this.clientService.delete(id).subscribe({
        next: () => {
          this.loadClients();
        },
        error: (err) => {
          this.error = 'Failed to delete client';
          console.error(err);
        }
      });
    }
  }
}
