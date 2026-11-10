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
    }),
});

export const collections = { vehicules };
