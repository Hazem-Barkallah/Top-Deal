import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PersonnelService } from '../../../services/personnel.service';
import { Personnel } from '../../../models/personnel.model';

@Component({
  selector: 'app-personnel-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './personnel-list.component.html',
  styleUrls: ['./personnel-list.component.css']
})
export class PersonnelListComponent implements OnInit {
  personnel: Personnel[] = [];
  filteredPersonnel: Personnel[] = [];
  searchTerm: string = '';
  loading: boolean = false;
  error: string = '';
  showModal: boolean = false;
  editMode: boolean = false;
  
  currentPersonnel: Personnel = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    role: 'employé'
  };

  constructor(private personnelService: PersonnelService) {}

  ngOnInit() {
    this.loadPersonnel();
  }

  loadPersonnel() {
    this.loading = true;
    this.error = '';
    this.personnelService.getAll().subscribe({
      next: (data) => {
        this.personnel = data;
        this.filteredPersonnel = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load personnel';
        this.loading = false;
        console.error(err);
      }
    });
  }

  searchPersonnel() {
    if (!this.searchTerm.trim()) {
      this.filteredPersonnel = this.personnel;
      return;
    }
    
    const term = this.searchTerm.toLowerCase();
    this.filteredPersonnel = this.personnel.filter(person =>
      person.nom.toLowerCase().includes(term) ||
      person.prenom.toLowerCase().includes(term) ||
      person.role.toLowerCase().includes(term)
    );
  }

  openCreateModal() {
    this.editMode = false;
    this.currentPersonnel = {
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      role: 'employé'
    };
    this.showModal = true;
  }

  openEditModal(personnel: Personnel) {
    this.editMode = true;
    this.currentPersonnel = { ...personnel };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.currentPersonnel = {
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      role: 'employé'
    };
  }

  savePersonnel() {
    if (!this.currentPersonnel.nom || !this.currentPersonnel.prenom) {
      this.error = 'First name and last name are required';
      return;
    }

    if (this.editMode && this.currentPersonnel._id) {
      this.personnelService.update(this.currentPersonnel._id, this.currentPersonnel).subscribe({
        next: () => {
          this.loadPersonnel();
          this.closeModal();
        },
        error: (err) => {
          this.error = 'Failed to update personnel';
          console.error(err);
        }
      });
    } else {
      this.personnelService.create(this.currentPersonnel).subscribe({
        next: () => {
          this.loadPersonnel();
          this.closeModal();
        },
        error: (err) => {
          this.error = 'Failed to create personnel';
          console.error(err);
        }
      });
    }
  }

  deletePersonnel(id: string | undefined) {
    if (!id) return;
    
    if (confirm('Are you sure you want to delete this personnel?')) {
      this.personnelService.delete(id).subscribe({
        next: () => {
          this.loadPersonnel();
        },
        error: (err) => {
          this.error = 'Failed to delete personnel';
          console.error(err);
        }
      });
    }
  }

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'administrateur': return 'role-admin';
      case 'livreur': return 'role-deliverer';
      case 'employé': return 'role-employee';
      default: return '';
    }
  }
}
