// Configuration des APIs
export const API_CONFIG = {
    GPT_URL: 'https://api.openai.com/v1/chat/completions',
    GPT_KEY: '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',
    GPT_MODEL: 'gpt-4o-mini'
};

// Constantes de l'application
export const MAX_SEO_CHARS = 150;
export const TIMEOUT_SECONDS = 120;

// Types de pages
export const PAGE_TYPES = {
    HEBERGEMENT: 1,
    SEJOUR: 2,
    WEEKEND: 3,
    DESTINATION: 4
};

// Types d'hébergements
export const HEBERGEMENT_TYPES = [
    { id: 1, name: "Gîte" },
    { id: 2, name: "Chambre d'hôtes" },
    { id: 3, name: "Hôtel" },
    { id: 4, name: "Camping" },
    { id: 5, name: "Location de vacances" },
    { id: 6, name: "Hébergement insolite" }
];

// Types de séjours
export const SEJOUR_TYPES = [
    { id: 1, name: "Séjour romantique" },
    { id: 2, name: "Séjour bien-être" },
    { id: 3, name: "Séjour nature" },
    { id: 4, name: "Séjour gastronomique" },
    { id: 5, name: "Séjour culturel" },
    { id: 6, name: "Séjour sportif" }
];