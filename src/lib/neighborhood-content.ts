/**
 * Short, general-knowledge profile of each neighborhood in the directory —
 * character/history plus nearby amenity categories (schools, green spaces,
 * dining). Deliberately kept at a well-known, defensible level of detail
 * (no invented business names, addresses or statistics) since this isn't
 * agency-verified copy.
 */
export type NeighborhoodProfile = {
  story: string;
  schools: string;
  parks: string;
  dining: string;
};

export const neighborhoodDescriptions: Record<string, NeighborhoodProfile> = {
  // Casablanca
  "Anfa": {
    story:
      "Anfa est l’un des quartiers résidentiels les plus prisés de Casablanca, réputé pour ses villas avec jardin, ses avenues arborées et sa proximité avec le centre d’affaires.",
    schools: "Écoles et lycées internationaux à proximité (programmes français et internationaux).",
    parks: "Jardins privés et avenues arborées caractéristiques du quartier.",
    dining: "Restaurants et cafés de standing dans les environs, notamment vers Gauthier et Racine.",
  },
  "Ain Diab": {
    story:
      "Ain Diab borde la Corniche et l’océan Atlantique, entre plages, restaurants et vie nocturne. Quartier balnéaire par excellence, il attire autant pour la résidence secondaire que pour un cadre de vie tourné vers la mer.",
    schools: "Établissements scolaires à proximité, côté Californie et CIL.",
    parks: "Accès direct à la plage et à la promenade de la Corniche.",
    dining: "Large choix de restaurants, beach clubs et cafés en bord de mer.",
  },
  "Ain Diab Extension": {
    story:
      "Extension plus récente d’Ain Diab, ce secteur offre des constructions contemporaines à proximité de la Corniche, dans un environnement plus résidentiel et aéré que le front de mer historique.",
    schools: "Proximité des écoles du secteur Ain Diab / Californie.",
    parks: "Quartier aéré, proche du littoral et de ses espaces de promenade.",
    dining: "Restaurants et commerces de la Corniche à quelques minutes.",
  },
  "Racine": {
    story:
      "Racine est un quartier central et résidentiel, apprécié pour son calme, ses écoles réputées et sa proximité avec Gauthier et le centre-ville.",
    schools: "Plusieurs écoles réputées, dont des établissements français, à proximité.",
    parks: "Rues arborées et espaces verts de voisinage.",
    dining: "Nombreux restaurants et cafés de quartier, notamment vers Gauthier.",
  },
  "Gauthier": {
    story:
      "Gauthier, au cœur de Casablanca, combine immeubles résidentiels de standing et dynamisme urbain : cafés, boutiques et bureaux se côtoient à deux pas des grands axes de la ville.",
    schools: "Écoles et établissements d’enseignement à proximité du centre-ville.",
    parks: "Quelques espaces verts urbains dans les environs.",
    dining: "Une des zones les plus denses en cafés, restaurants et commerces de Casablanca.",
  },
  "Maarif": {
    story:
      "Maarif est un quartier commerçant et animé, avec ses grandes artères, ses enseignes et sa vie de quartier dense. Bien desservi, il séduit par sa centralité.",
    schools: "Écoles publiques et privées dans un quartier résidentiel dense.",
    parks: "Espaces verts limités, compensés par l’animation du quartier.",
    dining: "Grand choix de commerces, cafés et restaurants le long des artères principales.",
  },
  "Bourgogne": {
    story:
      "La Bourgogne est un quartier résidentiel historique, structuré autour d’immeubles de standing proches du centre-ville et des institutions, apprécié pour son calme et sa centralité.",
    schools: "Écoles à proximité du centre-ville et des institutions voisines.",
    parks: "Quartier calme avec quelques espaces verts résidentiels.",
    dining: "Restaurants et commerces du centre-ville accessibles à pied.",
  },
  "CIL": {
    story:
      "Le quartier CIL (Casablanca Idéale) est un secteur résidentiel recherché, connu pour ses rues calmes, ses villas et sa proximité avec les grands axes reliant le centre-ville au littoral.",
    schools: "Proximité d’établissements scolaires reconnus du secteur Ain Diab / Californie.",
    parks: "Rues résidentielles calmes avec jardins privés.",
    dining: "Restaurants et cafés à quelques minutes, vers Ain Diab et Maarif.",
  },
  "Casanearshore": {
    story:
      "Casanearshore est un pôle d’affaires moderne tourné vers les métiers de l’offshoring et des services, avec bureaux, commodités et un cadre urbain contemporain.",
    schools: "Écoles des quartiers résidentiels voisins à proximité.",
    parks: "Espaces verts aménagés au sein du parc d’affaires.",
    dining: "Restaurants et cafés d’entreprise sur site et à proximité.",
  },
  "Sidi Belyout": {
    story:
      "Sidi Belyout se situe au cœur historique de Casablanca, à proximité du port et du centre-ville, dans un secteur dense mêlant activités commerciales et administratives.",
    schools: "Établissements scolaires du centre-ville à proximité.",
    parks: "Quartier urbain dense, proche du port et du centre historique.",
    dining: "Restaurants et commerces du centre-ville de Casablanca.",
  },
  "Bouskoura": {
    story:
      "Bouskoura, aux portes de Casablanca, s’est développé autour de résidences avec jardins, de golfs et d’espaces verts, offrant un cadre de vie plus aéré qu’en centre-ville.",
    schools: "Groupes scolaires et écoles internationales implantés dans les nouveaux quartiers résidentiels.",
    parks: "Golfs, espaces verts et résidences avec jardins caractérisent le secteur.",
    dining: "Restaurants et commerces en développement avec les nouveaux pôles résidentiels.",
  },
  "Dar Bouazza": {
    story:
      "Dar Bouazza, sur le littoral au sud de Casablanca, est devenu l’un des secteurs résidentiels les plus recherchés pour les villas avec piscine et jardin, entre plages et résidences sécurisées.",
    schools: "Écoles et établissements scolaires en développement avec la croissance résidentielle du secteur.",
    parks: "Plages, espaces verts et jardins privés caractérisent les résidences.",
    dining: "Restaurants et beach clubs en bord de littoral.",
  },
  "Casa Finance City- CFC": {
    story:
      "Casa Finance City est le quartier d’affaires de référence de Casablanca, rassemblant sièges d’entreprises, institutions financières et programmes résidentiels haut de gamme.",
    schools: "Proximité des écoles internationales de Bouskoura et Anfa.",
    parks: "Espaces verts aménagés au sein du quartier d’affaires.",
    dining: "Restaurants et cafés tournés vers une clientèle d’affaires.",
  },

  // Marrakech
  "Guéliz": {
    story:
      "Guéliz est le cœur de la ville moderne de Marrakech : boutiques, galeries, restaurants et immeubles résidentiels y cohabitent dans une ambiance urbaine et cosmopolite, à quelques minutes de la médina.",
    schools: "Écoles et établissements internationaux à proximité du centre-ville moderne.",
    parks: "Proche des jardins Majorelle et de nombreux espaces verts urbains.",
    dining: "L’une des zones les plus denses de Marrakech en restaurants, cafés et galeries.",
  },
  "Hivernage": {
    story:
      "L’Hivernage est un quartier résidentiel calme et verdoyant, réputé pour ses hôtels de standing, ses villas et sa proximité avec le centre-ville et les jardins de la Ménara.",
    schools: "Proximité des écoles internationales de Guéliz et Semlalia.",
    parks: "Quartier verdoyant, à deux pas des jardins de la Ménara.",
    dining: "Restaurants gastronomiques et hôtels de standing dans le quartier.",
  },
  "Agdal": {
    story:
      "Agdal est un quartier résidentiel prisé de Marrakech, apprécié pour ses larges avenues, ses villas et appartements de standing et son calme, à proximité de Guéliz et de l’Hivernage.",
    schools: "Écoles et établissements scolaires à proximité, entre Guéliz et l’Hivernage.",
    parks: "Larges avenues arborées et espaces verts résidentiels.",
    dining: "Restaurants et commerces de proximité le long des grands axes.",
  },
  "La Palmeraie Ennakhil": {
    story:
      "La Palmeraie est le secteur emblématique des villas de prestige à Marrakech, niché au milieu d’une palmeraie centenaire, entre domaines privés, golfs et résidences avec piscine.",
    schools: "Écoles internationales desservant les résidences de la Palmeraie.",
    parks: "Palmeraie centenaire, golfs et grands jardins privés.",
    dining: "Restaurants et clubs de golf au sein des domaines résidentiels.",
  },
  "Targa": {
    story:
      "Targa est un quartier résidentiel en développement à l’ouest de Marrakech, recherché pour ses villas avec jardin dans un cadre plus calme, à proximité du centre-ville.",
    schools: "Établissements scolaires à proximité du centre-ville de Marrakech.",
    parks: "Villas avec jardins dans un cadre résidentiel aéré.",
    dining: "Commerces et restaurants de quartier en développement.",
  },
  "Route de l’Ourika": {
    story:
      "La Route de l’Ourika, au sud de Marrakech, est bordée de domaines et villas avec grands jardins, prisés pour leur tranquillité et leur proximité avec la campagne et les contreforts de l’Atlas.",
    schools: "Écoles internationales de Marrakech accessibles en voiture.",
    parks: "Grands domaines et jardins privés en direction de l’Atlas.",
    dining: "Quelques restaurants et adresses champêtres le long de la route.",
  },
  "Route de Fès": {
    story:
      "La Route de Fès rassemble des villas et propriétés à proximité de golfs, dans un environnement résidentiel prisé au nord-est de la ville.",
    schools: "Proximité des écoles du nord-est de Marrakech.",
    parks: "Golfs et grands jardins caractérisent les propriétés du secteur.",
    dining: "Restaurants et clubs de golf à proximité des domaines résidentiels.",
  },
  "Route d’Amizmiz": {
    story:
      "La Route d’Amizmiz, à l’ouest de Marrakech, est recherchée pour ses propriétés avec grands terrains, dans un cadre rural préservé à proximité de la ville.",
    schools: "Écoles de Marrakech accessibles en voiture depuis ce secteur périphérique.",
    parks: "Grands terrains et cadre rural préservé.",
    dining: "Offre de restauration plus limitée, principalement en ville.",
  },
  "Amelkis": {
    story:
      "Amelkis est un domaine résidentiel organisé autour d’un golf, réputé pour ses villas de standing et son cadre sécurisé, au sud-est de Marrakech.",
    schools: "Proximité des écoles internationales du sud de Marrakech.",
    parks: "Golf et espaces verts aménagés au cœur du domaine.",
    dining: "Restaurant et club-house du golf sur place.",
  },
  "Médina": {
    story:
      "La Médina, cœur historique classé au patrimoine mondial de l’UNESCO, séduit par ses riads traditionnels, ses souks animés et son authenticité préservée.",
    schools: "Écoles traditionnelles et établissements de quartier au sein de la médina.",
    parks: "Jardins historiques (dont le Jardin Secret) à proximité.",
    dining: "Riads-restaurants, salons de thé et étals des souks à chaque ruelle.",
  },
  "Bab Doukkala": {
    story:
      "Bab Doukkala, dans la médina, est un quartier authentique prisé pour ses riads à rénover ou déjà restaurés, à proximité des souks et des grandes places de Marrakech.",
    schools: "Écoles de quartier au sein de la médina.",
    parks: "Proximité des jardins et places historiques de la médina.",
    dining: "Restaurants traditionnels et marchés locaux à proximité immédiate.",
  },
  "Mouassine": {
    story:
      "Mouassine, au cœur de la médina, est l’un des quartiers les plus recherchés pour les riads de charme, entre fontaines historiques, boutiques d’artisanat et ruelles typiques.",
    schools: "Écoles de la médina à proximité.",
    parks: "Jardins et fontaines historiques du quartier.",
    dining: "Riads-restaurants, salons de thé et artisanat à chaque coin de rue.",
  },
  "Kasbah": {
    story:
      "La Kasbah, quartier historique abritant notamment le palais El Badi et les tombeaux saadiens, offre un cadre authentique avec ses riads et sa proximité avec la médina royale.",
    schools: "Écoles de la médina et du quartier royal à proximité.",
    parks: "Jardins historiques proches du palais El Badi.",
    dining: "Restaurants traditionnels et adresses de charme dans un cadre authentique.",
  },
};
