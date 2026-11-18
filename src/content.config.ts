import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Fiche véhicule. Les champs correspondent au brief (§5) et au formulaire
 * « Véhicules » de l'admin (public/admin/config.yml) : garder les deux alignés.
 */
const vehicules = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/vehicules' }),
  schema: ({ image }) =>
    z.object({
      nom: z.string(),
      marque: z.string().optional(),
      modele: z.string().optional(),
      categorie: z.enum(['SUV / 4x4', 'Berline', 'Citadine', 'Pick-up', 'Minibus', 'Utilitaire', 'Autre']),
      places: z.number().int().positive().optional(),
      transmission: z.enum(['Manuelle', 'Automatique']).optional(),
      carburant: z.enum(['Essence', 'Diesel', 'Hybride', 'Électrique']).optional(),
      couverture: image().optional(),
      galerie: z.array(image()).max(3).default([]),
      // Tarifs en FCFA. Vide = « Sur devis ». N'afficher que des prix validés par IMAVAITA.
      prix_jour: z.number().positive().optional(),
      prix_semaine: z.number().positive().optional(),
      prix_mois: z.number().positive().optional(),
      options: z.array(z.string()).default([]),
      statut: z.enum(['brouillon', 'publie', 'masque']).default('brouillon'),
      nouveau: z.boolean().default(false),
      a_la_une: z.boolean().default(false),
      ordre: z.number().int().default(100),
      resume: z.string().max(160).optional(),
      // Version anglaise (pages /en/). Vide = le texte français est repris.
      resume_en: z.string().max(160).optional(),
      description_en: z.string().optional(),
    }),
});

/**
 * Véhicule du catalogue de vente (catalogue PDF 2024-2025). Pas de fiche détaillée :
 * chaque carte mène à une demande de prix sur WhatsApp. Formulaire « Véhicules en vente »
 * de l'admin (public/admin/config.yml) : garder les deux alignés.
 */
const vente = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/vente' }),
  schema: ({ image }) =>
    z.object({
      nom: z.string(),
      marque: z.string(),
      annee: z.string().optional(),
      categorie: z.enum(['SUV', 'Berline', 'Pick-up', 'Poids lourd', 'Autre']),
      energie: z.enum(['Essence', 'Diesel', 'Hybride', 'Hybride rechargeable', 'Électrique']).optional(),
      moteur: z.string().optional(),
      puissance: z.number().int().positive().optional(),
      boite: z.enum(['Manuelle', 'Automatique']).optional(),
      consommation: z.string().optional(),
      note: z.string().optional(),
      note_en: z.string().optional(),
      photo: image().optional(),
      // Prix en FCFA. Vide = « Prix sur demande ». N'afficher que des prix validés par IMAVAITA.
      prix: z.number().positive().optional(),
      statut: z.enum(['brouillon', 'publie', 'masque']).default('brouillon'),
      a_la_une: z.boolean().default(false),
      ordre: z.number().int().default(100),
    }),
});

export const collections = { vehicules, vente };
