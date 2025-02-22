// utils.js
// À placer dans le dossier scripts

class Utils {
   // Fonction pour formater le texte
   static formatText(text) {
       return text.trim();
   }

   // Fonction pour nettoyer le texte des caractères spéciaux
   static cleanText(text) {
       let cleanedText = text;
       
       // Remplacer les caractères spéciaux
       cleanedText = cleanedText.replace(/"/g, "'"); // Guillemets doubles
       cleanedText = cleanedText.replace(/\r\n|\r|\n/g, " "); // Retours à la ligne
       
       // Retirer les espaces multiples
       cleanedText = cleanedText.replace(/\s+/g, " ");
       
       return cleanedText.trim();
   }

   // Fonction pour logger les erreurs et événements
   static log(type, message, data = null) {
       const timestamp = new Date().toISOString();
       const logMessage = {
           timestamp,
           type,
           message,
           data
       };

       console.log(JSON.stringify(logMessage));
   }

   // Fonction pour vérifier si une chaîne est vide
   static isEmpty(text) {
       return !text || text.trim().length === 0;
   }

   // Fonction pour valider les entrées
   static validateInput(input, type) {
       switch(type) {
           case 'seo':
               return input.length <= MAX_SEO_CHARS;
           case 'pageType':
               return Object.values(PAGE_TYPES).includes(parseInt(input));
           case 'geoScale':
               return ['region', 'departement', 'ville'].includes(input);
           default:
               return true;
       }
   }

   // Fonction pour créer une alerte stylisée
   static createAlert(message, type = 'info') {
       const alert = document.createElement('div');
       alert.className = `alert alert-${type}`;
       alert.textContent = message;

       // Auto-destruction après 5 secondes
       setTimeout(() => {
           alert.remove();
       }, 5000);

       return alert;
   }

   // Fonction pour copier le texte dans le presse-papiers
   static async copyToClipboard(text) {
       try {
           await navigator.clipboard.writeText(text);
           return true;
       } catch (error) {
           console.error('Erreur lors de la copie:', error);
           return false;
       }
   }

   // Fonction pour sauvegarder le texte en fichier
   static saveAsFile(textContent) {
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'texte_genere.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}
}

export default Utils;