/**
 * Curated directory of real neighborhoods the agency operates in, grouped by
 * city. Sourced from the agency's own neighborhood taxonomy on the live
 * site (most Casablanca entries, plus Guéliz/Hivernage/Agdal/Médina/etc. for
 * Marrakech), extended with well-known Marrakech villa routes/areas not yet
 * in that taxonomy (Route de l'Ourika, Targa, Amelkis, Route d'Amizmiz).
 *
 * Independent of which neighborhoods currently have published listings —
 * used for search filters and the homepage directory so the full coverage
 * area is discoverable and indexable even before every area has inventory.
 */
export const neighborhoodDirectory: { city: string; neighborhoods: string[] }[] = [
  {
    city: "Casablanca",
    neighborhoods: [
      "Anfa",
      "Ain Diab",
      "Ain Diab Extension",
      "Racine",
      "Gauthier",
      "Maarif",
      "Bourgogne",
      "CIL",
      "Casanearshore",
      "Sidi Belyout",
      "Bouskoura",
      "Dar Bouazza",
      "Casa Finance City- CFC",
    ],
  },
  {
    city: "Marrakech",
    neighborhoods: [
      "Guéliz",
      "Hivernage",
      "Agdal",
      "La Palmeraie Ennakhil",
      "Targa",
      "Route de l’Ourika",
      "Route de Fès",
      "Route d’Amizmiz",
      "Amelkis",
      "Médina",
      "Bab Doukkala",
      "Mouassine",
      "Kasbah",
    ],
  },
];

export function allNeighborhoods() {
  return neighborhoodDirectory.flatMap((g) => g.neighborhoods);
}
