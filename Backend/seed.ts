import * as dotenv from "dotenv";
dotenv.config();
import { connectDB, getDB } from "../../../../../Downloads/ProjetWeb-main/ProjetWeb-main/Backend/src/database/index";

const seedData = async () => {
  try {
    await connectDB();
    const db = getDB();

    // Clear existing data
    await db.collection("articles").deleteMany({});
    await db.collection("clients").deleteMany({});
    await db.collection("personnels").deleteMany({});
    await db.collection("livraisons").deleteMany({});
    await db.collection("commandes").deleteMany({});

    // Seed Articles
    const articles = await db.collection("articles").insertMany([
      {
        nom: "Laptop Dell XPS 15",
        description: "Laptop haute performance avec écran 4K",
        prix: 1899.99,
        quantite: 25,
        categorie: "Électronique",
      },
      {
        nom: "Souris Logitech MX Master 3",
        description: "Souris ergonomique sans fil",
        prix: 99.99,
        quantite: 150,
        categorie: "Accessoires",
      },
      {
        nom: "Clavier Mécanique Corsair K95",
        description: "Clavier gaming RGB mécanique",
        prix: 199.99,
        quantite: 75,
        categorie: "Accessoires",
      },
      {
        nom: "Moniteur Samsung 27'' 4K",
        description: "Moniteur professionnel 4K UHD",
        prix: 449.99,
        quantite: 40,
        categorie: "Électronique",
      },
      {
        nom: "Webcam Logitech C920",
        description: "Webcam HD 1080p pour visioconférence",
        prix: 79.99,
        quantite: 100,
        categorie: "Accessoires",
      },
    ]);

    console.log(`${articles.insertedCount} articles insérés`);

    // Seed Clients
    const clients = await db.collection("clients").insertMany([
      {
        nom: "Dubois",
        prenom: "Pierre",
        email: "pierre.dubois@email.com",
        telephone: "0612345678",
        adresse: "15 Rue de la République, 75001 Paris",
      },
      {
        nom: "Martin",
        prenom: "Sophie",
        email: "sophie.martin@email.com",
        telephone: "0623456789",
        adresse: "28 Avenue des Champs, 69000 Lyon",
      },
      {
        nom: "Bernard",
        prenom: "Jean",
        email: "jean.bernard@email.com",
        telephone: "0634567890",
        adresse: "42 Boulevard Victor Hugo, 31000 Toulouse",
      },
      {
        nom: "Petit",
        prenom: "Marie",
        email: "marie.petit@email.com",
        telephone: "0645678901",
        adresse: "7 Rue du Commerce, 13000 Marseille",
      },
      {
        nom: "Durand",
        prenom: "Luc",
        email: "luc.durand@email.com",
        telephone: "0656789012",
        adresse: "33 Place de la Gare, 44000 Nantes",
      },
    ]);

    console.log(`${clients.insertedCount} clients insérés`);

    // Seed Personnel
    const personnels = await db.collection("personnels").insertMany([
      {
        nom: "Leclerc",
        prenom: "Thomas",
        poste: "Directeur",
        email: "thomas.leclerc@company.com",
        telephone: "0612341111",
        salaire: 5500,
      },
      {
        nom: "Moreau",
        prenom: "Claire",
        poste: "Chef de projet",
        email: "claire.moreau@company.com",
        telephone: "0612342222",
        salaire: 4200,
      },
      {
        nom: "Roux",
        prenom: "Antoine",
        poste: "Développeur",
        email: "antoine.roux@company.com",
        telephone: "0612343333",
        salaire: 3500,
      },
      {
        nom: "Girard",
        prenom: "Émilie",
        poste: "Comptable",
        email: "emilie.girard@company.com",
        telephone: "0612344444",
        salaire: 3200,
      },
      {
        nom: "Fontaine",
        prenom: "Marc",
        poste: "Livreur",
        email: "marc.fontaine@company.com",
        telephone: "0612345555",
        salaire: 2500,
      },
    ]);

    console.log(`${personnels.insertedCount} personnels insérés`);

    // Seed Commandes
    const commandes = await db.collection("commandes").insertMany([
      {
        clientId: clients.insertedIds[0].toString(),
        articles: [
          {
            articleId: articles.insertedIds[0].toString(),
            quantite: 2,
            prixUnitaire: 1899.99,
          },
        ],
        montantTotal: 3799.98,
        statut: "En cours",
        dateCommande: new Date("2025-12-10"),
      },
      {
        clientId: clients.insertedIds[1].toString(),
        articles: [
          {
            articleId: articles.insertedIds[1].toString(),
            quantite: 5,
            prixUnitaire: 99.99,
          },
          {
            articleId: articles.insertedIds[2].toString(),
            quantite: 3,
            prixUnitaire: 199.99,
          },
        ],
        montantTotal: 1099.92,
        statut: "Livrée",
        dateCommande: new Date("2025-12-08"),
      },
      {
        clientId: clients.insertedIds[2].toString(),
        articles: [
          {
            articleId: articles.insertedIds[3].toString(),
            quantite: 1,
            prixUnitaire: 449.99,
          },
        ],
        montantTotal: 449.99,
        statut: "En attente",
        dateCommande: new Date("2025-12-15"),
      },
    ]);

    console.log(`${commandes.insertedCount} commandes insérées`);

    // Seed Livraisons
    const livraisons = await db.collection("livraisons").insertMany([
      {
        commandeId: commandes.insertedIds[0].toString(),
        personnelId: personnels.insertedIds[4].toString(),
        adresseLivraison: "15 Rue de la République, 75001 Paris",
        statut: "En transit",
        dateLivraison: new Date("2025-12-18"),
      },
      {
        commandeId: commandes.insertedIds[1].toString(),
        personnelId: personnels.insertedIds[4].toString(),
        adresseLivraison: "28 Avenue des Champs, 69000 Lyon",
        statut: "Livrée",
        dateLivraison: new Date("2025-12-10"),
      },
    ]);

    console.log(`${livraisons.insertedCount} livraisons insérées`);

    console.log("\n✅ Base de données initialisée avec succès!");
    process.exit(0);
  } catch (error) {
    console.error("Erreur lors du seeding:", error);
    process.exit(1);
  }
};

seedData();
