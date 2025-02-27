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
            specificPrompt = this.getHebergementPrompt(formData);
            break;
        case PAGE_TYPES.TYPE_DESTINATION:
            specificPrompt = this.getHebergementPrompt(formData);
            break;
        case PAGE_TYPES.TYPE_THEMATIQUE:
            specificPrompt = this.getTypeThematiquePrompt(formData);
            break;
        case PAGE_TYPES.THEMATIQUE_SEUL:
            specificPrompt = this.getSejourPrompt(formData);
            break;
        case PAGE_TYPES.THEMATIQUE_DESTINATION:
            specificPrompt = this.getSejourPrompt(formData);
            break;
        case PAGE_TYPES.WEEKEND_THEMATIQUE:
            specificPrompt = this.getWeekendThematiquePrompt(formData);
            break;
        case PAGE_TYPES.WEEKEND_DESTINATION:
            specificPrompt = this.getWeekendPrompt(formData);
            break;
        case PAGE_TYPES.DESTINATION_SEULE:
            specificPrompt = this.getDestinationPrompt(formData);
            break;
        default:
            console.error("Type de page non reconnu:", formData.pageType);
            return null;
    }

        return basePrompt + specificPrompt;
    }

    static getHebergementPrompt(formData) {
        return `Structure du texte pour hébergement :
1. Comment choisir votre ${formData.specificType} en ${formData.destination} ?
2. Avantages de choisir un ${formData.specificType}
3. Profitez de la tranquillité de ${formData.destination} dans votre ${formData.specificType}
4. À la découverte des ${formData.specificType}s authentiques de ${formData.destination}
5. Activités et expériences autour de votre ${formData.specificType}
6. Conseils pour réserver votre ${formData.specificType} idéal
Conclusion: Réservez votre ${formData.specificType} en ${formData.destination} avec Hortense
Incluez 4-5 références naturelles aux types de séjours possibles et destinations populaires`;
    }

    static getSejourPrompt(formData) {
        return `Structure du texte pour séjour :
1. Que faire lors d'un ${formData.specificType} ?
2. Bien choisir sa destination pour un ${formData.specificType}
3. Séjourner dans un hébergement typique
4. Découvrez les activités pour un ${formData.specificType}
5. Voyager de manière responsable pendant votre ${formData.specificType}
6. Détendez-vous et profitez
Conclusion: Organisez votre ${formData.specificType} avec Hortense
Incluez 4-5 références naturelles aux types d'hébergements adaptés et destinations recommandées`;
    }

    static getWeekendPrompt(formData) {
        return `Structure du texte pour week-end :
1. Que faire lors d'un week-end à ${formData.destination} ?
2. Séjourner dans un hébergement typique
3. Explorer des paysages époustouflants
4. Découvrir le patrimoine historique
5. Déguster les saveurs locales
6. Partager des moments uniques
Conclusion: Un week-end à ${formData.destination} avec Hortense
Incluez 4-5 références naturelles aux types d'hébergements locaux et activités thématiques possibles`;
    }

    static getDestinationPrompt(formData) {
        return `Structure du texte pour destination :
1. Découvrir ${formData.destination} : Guide complet
2. Où séjourner à ${formData.destination} ?
3. Les incontournables de ${formData.destination}
4. Activités et expériences uniques en ${formData.destination}
5. Saveurs et traditions de ${formData.destination}
6. Comment explorer ${formData.destination} de manière responsable ?
Conclusion: Planifiez votre séjour en ${formData.destination} avec Hortense
Incluez 4-5 références naturelles aux types d'hébergements disponibles et séjours populaires`;
    }

    static getTypeThematiquePrompt(formData) {
    return `Structure du texte pour type + thématique :
1. Découvrez les avantages du ${formData.specificType} combiné avec un séjour ${formData.specificTypeSelect}
2. Pourquoi choisir un ${formData.specificType} pour un séjour ${formData.specificTypeSelect} ?
3. Expériences uniques en ${formData.specificType} lors d'un séjour ${formData.specificTypeSelect}
4. Réservez dès maintenant votre ${formData.specificType} pour un séjour ${formData.specificTypeSelect}`;
}

    static getWeekendThematiquePrompt(formData) {
    return `Structure du texte pour week-end + thématique :
    Ecrire un titre : Que faire lors d'un week-end ${formData.specificThematique}
    Pour chaque partie écrire le titre de la partie (en respectant les modèles ci-dessous) puis rédiger un texte correspondant. Le titre peut être légèrement adapté pour convenir à une tournure de phrase naturelle.
1. Choisir un hébergement ${formData.specificThematique} 
2. Profitez d'expériences {ajouter ici une tournure de phrase naturelle en accord avec ${formData.specificThematique}}
3. Découvrir des lieux {ajouter ici une tournure de phrase naturelle en accord avec ${formData.specificThematique}}
4. Ajouter une touche d'originalité
5. Voyager de manière responsable
6. Planifier un moment de détente
Organisez votre week-end ${formData.specificThematique} avec Hortense`;
}

}

export { GPTAPI };