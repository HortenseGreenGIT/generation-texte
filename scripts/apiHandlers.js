// apiHandlers.js

import { PAGE_TYPES } from './constants.js';


class GPTAPI {
    static async generateText(prompt) {
    try {
        console.log("Prompt envoyé au backend :", prompt); // ✅ Vérifie si le prompt est bien envoyé

        const response = await fetch('https://desolate-chamber-02022-367a0f7be239.herokuapp.com/generate-text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt }) // On envoie le prompt ici
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        return data.text;
    } catch (error) {
        console.error('Erreur lors de la génération du texte:', error);
        throw error;
    }
}


    static generatePrompt(formData) {
        const basePrompt = `Générez un texte de 800 à 1500 mots en français avec les caractéristiques suivantes :
- Utilisez uniquement la voix active
- Écrivez des phrases courtes (15-20 mots maximum)
- Adoptez un style direct et dynamique
- Utilisez un ton chaleureux et accueillant
- Rédigez de manière fluide et naturelle en respectant la grammaire et l'orthographe
- Faites en sorte que le texte semble écrit par un humain en adaptant le rythme et la structure des phrases
- Variez le vocabulaire et évitez les répétitions excessives (sauf pour la requête SEO dont la consigne est donnée ci-après)
- Adaptez les conjonctions de coordination et les mots de liaison en fonction du contexte
- Assurez une lecture agréable avec une structure logique et fluide
- Intégrez la requête SEO '${formData.seoQuery}' exactement 10 fois (pas une fois de moins), **de manière fluide et contextuelle**, sans altérer la qualité du texte.\n\n`;

        let specificPrompt = '';
    switch(parseInt(formData.pageType)) {
        case PAGE_TYPES.TYPE_SEUL:
            specificPrompt = this.getTypeSeulPrompt(formData);
            break;
        case PAGE_TYPES.TYPE_DESTINATION:
            specificPrompt = this.getTypeDestinationPrompt(formData);
            break;
        case PAGE_TYPES.TYPE_THEMATIQUE:
            specificPrompt = this.getTypeThematiquePrompt(formData);
            break;
        case PAGE_TYPES.THEMATIQUE_SEUL:
            specificPrompt = this.getThematiqueSeulPrompt(formData);
            break;
        case PAGE_TYPES.THEMATIQUE_DESTINATION:
            specificPrompt = this.getThematiqueDestinationPrompt(formData);
            break;
        case PAGE_TYPES.WEEKEND_THEMATIQUE:
            specificPrompt = this.getWeekendThematiquePrompt(formData);
            break;
        case PAGE_TYPES.WEEKEND_DESTINATION:
            specificPrompt = this.getWeekendDestinationPrompt(formData);
            break;
        case PAGE_TYPES.DESTINATION_SEULE:
            specificPrompt = this.getDestinationSeulPrompt(formData);
            break;
        default:
            console.error("Type de page non reconnu:", formData.pageType);
            return null;
    }

        return basePrompt + specificPrompt;
    }

    static getPardefaultPrompt(formData) {
        return `Structure du texte pour type + thématique :
LE PROMPT SERA BIENTOT DISPONIBLE.\n
EN ATTENDANT, ECRIRE "BIENTOT DISPONIBLE"`;
    }

    static getTypeSeulPrompt(formData) {
        return `Structure du texte pour type d'hébergement seul :
    IMPORTANT : Écrire un titre principal à adapter pour convenir à un titre écrit par un humain, de manière naturelle : "Pourquoi choisir un ${formData.specificType} pour vos prochaines vacances ?"
    Pour chaque partie, écrire le titre de la partie sur une ligne distincte, suivi d'un saut de ligne avant d'écrire le texte correspondant.
    IMPORTANT : Incluez 4-5 références naturelles aux destinations recommandées et aux thématiques de séjour adaptées. Inclure ${formData.specificType} de manière humaine, naturelle et fluide. 

1. Qu'est-ce qu'un ${formData.specificType} et pourquoi le choisir ?
2. Les avantages d’un séjour en ${formData.specificType}
3. À qui s’adresse un séjour en ${formData.specificType} ?
4. Les meilleures destinations pour séjourner en ${formData.specificType} {donner ici des idées de vrais noms de destinations en France, des noms de villes, de département ou de régions}
5. Comment bien choisir votre ${formData.specificType} ?
6. Organisez votre séjour en ${formData.specificType} avec Hortense`;
}

    static getTypeDestinationPrompt(formData) {
        return `Structure du texte pour type d'hébergement + destination :
    IMPORTANT : Écrire un titre principal à adapter pour convenir à un titre écrit par un humain, de manière naturelle : "Pourquoi séjourner dans un ${formData.specificType} en ${formData.destination} ?"
    Pour chaque partie, écrire le titre de la partie sur une ligne distincte, suivi d'un saut de ligne avant d'écrire le texte correspondant.
    IMPORTANT : Incluez 4-5 références naturelles aux thématiques de séjour adaptées et aux activités disponibles dans ${formData.destination}. Intègre ${formData.specificType} et ${formData.destination} de manière naturelle.

1. Pourquoi choisir un ${formData.specificType} pour un séjour en ${formData.destination} ?
2. Les avantages d’un ${formData.specificType} en ${formData.destination}
3. Les meilleures expériences à vivre autour de votre ${formData.specificType} en ${formData.destination}
4. Où trouver les plus beaux ${formData.specificType} en ${formData.destination} ?
5. Comment bien préparer son séjour en ${formData.specificType} en ${formData.destination} ?
6. Planifiez votre séjour en ${formData.specificType} en ${formData.destination} avec Hortense`;
}

    static getThematiqueSeulPrompt(formData) {
        return `Structure du texte pour thématique de séjour :
    IMPORTANT : Ecrire un titre principal à adapter pour convenir à un titre écrit par un humain, de manière naturelle : "QUE FAIRE LORS D'UN ${formData.thematique}"
    Pour chaque partie écrire le titre (en respectant les modèles ci-dessous) puis rédiger un texte correspondant. Les titres doivent être adapté pour convenir à une tournure de phrase naturelle. IMPORTANT : les titres et leurs parties correspondantes doivent avoir une ligne vide d'écart!! Les titres doivent toujours avoir leurs numéros correspondants devant eux.
    IMPORTANT : Incluez 4-5 références naturelles aux types d'hébergements adaptés et destinations recommandées. Intègre ${formData.thematique} de manière humaine, naturelle, en adaptant la casse des lettres.

1. Bien choisir sa destination pour un ${formData.thematique}
2. Séjourner dans un hébergement {mettre un adjectif en lien avec ${formData.thematique}}
3. Découvrez les activités pour un ${formData.thematique}
4. Voyager de manière responsable pendant votre ${formData.thematique}
5. Détendez-vous et profitez
6. Organisez votre ${formData.thematique} avec Hortense`;
    }

    static getWeekendDestinationPrompt(formData) {
        return `Structure du texte pour week-end + destination :
    IMPORTANT : Ecrire un titre principal à adapter pour convenir à un titre écrit par un humain, de manière naturelle : "DECOUVRIR ${formData.destination} LE TEMPS D'UN WEEK-END INOUBLIABLE ?"
    Pour chaque partie écrire le titre (en respectant les modèles ci-dessous) puis rédiger un texte correspondant. Les titres doivent être adapté pour convenir à une tournure de phrase naturelle. IMPORTANT : les titres et leurs parties correspondantes doivent avoir une ligne vide d'écart!! Les titres doivent toujours avoir leurs numéros correspondants devant eux.
    IMPORTANT : Incluez 4-5 références naturelles aux types d'hébergements adaptés et thématiques recommandées. Intègre ${formData.destination} de manière humaine, naturelle, en adaptant la casse des lettres.

1. Séjourner dans un hébergement de charme
2. Explorez des paysages époustouflants
3. S'imprégner du patrimoine historique
4. Déguster les saveurs de ${formData.destination}
5. Vivre des expériences uniques
6. Adoptez un tourisme responsable
7. Organisez votre week-end en ${formData.destination} avec Hortense`;
    }

    static getDestinationSeulPrompt(formData) {
        return `Structure du texte pour destination seule :
    IMPORTANT : Ecrire un titre principal à adapter pour convenir à un titre écrit par un humain, de manière naturelle : "DECOUVREZ ${formData.destination}, {ajouter en majuscule une tournure de phrase personnalisée par destination, inspirée de ${formData.destination}"
    Pour chaque partie écrire le titre (en respectant les modèles ci-dessous) puis rédiger un texte correspondant. Les titres doivent être adapté pour convenir à une tournure de phrase naturelle. IMPORTANT : les titres et leurs parties correspondantes doivent avoir une ligne vide d'écart!! Les titres doivent toujours avoir leurs numéros correspondants devant eux.
    IMPORTANT : Incluez 4-5 références naturelles aux types d'hébergements adaptés et thématiques recommandées. Intègre ${formData.destination} de manière humaine, naturelle, en adaptant la casse des lettres.

1. Découvrir ${formData.destination} : Guide complet
2. Où séjourner à ${formData.destination} ?
3. Les incontournables de ${formData.destination}
4. Activités et expériences uniques en ${formData.destination}
5. Saveurs et traditions de ${formData.destination}
6. Comment explorer ${formData.destination} de manière responsable ?
Conclusion: Planifiez votre séjour en ${formData.destination} avec Hortense`;
    }

    static getTypeThematiquePrompt(formData) {
    return `Structure du texte pour type d'hébergement + thématique :
    IMPORTANT : Écrire un titre principal à adapter pour convenir à un titre écrit par un humain, de manière naturelle : "Pourquoi choisir un ${formData.specificType} pour un ${formData.thematique} ?"
    Pour chaque partie, écrire le titre de la partie sur une ligne distincte, suivi d'un saut de ligne avant d'écrire le texte correspondant.
    IMPORTANT : Incluez 4-5 références naturelles aux destinations adaptées et aux expériences en lien avec ${formData.thematique}. Intègre ${formData.specificType} et ${formData.thematique} de manière naturelle.

1. Pourquoi choisir un ${formData.specificType} pour un ${formData.thematique} ?
2. Les avantages d’un ${formData.specificType} pour un séjour ${formData.thematique}
3. Les meilleures expériences ${formData.thematique} en ${formData.specificType}
4. Où trouver les plus beaux ${formData.specificType} pour un ${formData.thematique} ?
5. Comment bien organiser son séjour ${formData.thematique} en ${formData.specificType} ?
6. Planifiez votre séjour ${formData.thematique} en ${formData.specificType} avec Hortense`;
}


    static getWeekendThematiquePrompt(formData) {
    return `Structure du texte pour week-end + thématique :
    IMPORTANT : Ecrire un titre principal à adapter pour convenir à un titre écrit par un humain, de manière naturelle : "QUE FAIRE LORS D'UN WEEK-END ${formData.thematique} ?"
    Pour chaque partie écrire le titre (en respectant les modèles ci-dessous) puis rédiger un texte correspondant. Les titres doivent être adapté pour convenir à une tournure de phrase naturelle. IMPORTANT : les titres et leurs parties correspondantes doivent avoir une ligne vide d'écart!! Les titres doivent toujours avoir leurs numéros correspondants devant eux.
    IMPORTANT : Incluez 4-5 références naturelles aux types d'hébergements adaptés et destinations recommandées. Intègre ${formData.thematique} de manière humaine, naturelle, en adaptant la casse des lettres.

1. Choisir un hébergement ${formData.thematique}
2. Profitez d'expériences {ajouter ici une tournure de phrase naturelle en accord avec ${formData.thematique}}
3. Découvrir des lieux {ajouter ici une tournure de phrase naturelle en accord avec ${formData.thematique}}
4. Ajouter une touche d'originalité
5. Voyager de manière responsable
6. Planifier un moment de détente
7. Organisez votre week-end ${formData.thematique} avec Hortense`;
}

    static getThematiqueDestinationPrompt(formData) {
        return `Structure du texte pour thématique + destination :
    IMPORTANT : Ecrire un titre principal à adapter pour convenir à un titre écrit par un humain, de manière naturelle : "POURQUOI CHOISIR UN ${formData.thematique} EN ${formData.destination}?"
    Pour chaque partie écrire le titre (en respectant les modèles ci-dessous) puis rédiger un texte correspondant. Les titres doivent être adapté pour convenir à une tournure de phrase naturelle. IMPORTANT : les titres et leurs parties correspondantes doivent avoir une ligne vide d'écart!! Les titres doivent toujours avoir leurs numéros correspondants devant eux.
    IMPORTANT : Incluez 4-5 références naturelles aux types d'hébergements adaptés. Intègre ${formData.thematique} et ${formData.destination} de manière humaine, naturelle, en adaptant la casse des lettres.

1. Les incontournables pour un ${formData.thematique} en ${formData.destination}
2. Des activités à vivre pour un ${formData.thematique} inoubliable en ${formData.destination}
3. Quand partir pour un ${formData.thematique} en ${formData.destination}
4. Où séjourner pour un ${formData.thematique} en ${formData.destination}
5. Un ${formData.thematique} en ${formData.destination} pour des vacances ressourçantes
6. Organisez votre ${formData.thematique} en ${formData.destination} avec Hortense !`;
    }
}

export { GPTAPI };
