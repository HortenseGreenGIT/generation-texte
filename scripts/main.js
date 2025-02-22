// main.js
import { GPTAPI } from './apiHandlers.js';
import uiManager from './uiManager.js';
import Utils from './utils.js';


// Fonction d'initialisation principale
async function initializeApp() {
    try {
        Utils.log('info', 'Démarrage de l\'application');
        addExtraFeatures();
    } catch (error) {
        Utils.log('error', 'Erreur d\'initialisation', error);
        uiManager.showError('Erreur lors du chargement de l\'application');
    }
}

// Fonctionnalités supplémentaires
function addExtraFeatures() {
    // Ajouter un bouton de copie
    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copier le texte';
    copyButton.className = 'copy-button';
    copyButton.addEventListener('click', async () => {
        const generatedText = document.getElementById('generatedText').textContent;
        if (await Utils.copyToClipboard(generatedText)) {
            uiManager.showAlert('Texte copié !', 'success');
        }
    });
    document.getElementById('result').appendChild(copyButton);

    // Ajouter un bouton de sauvegarde
const saveButton = document.createElement('button');
saveButton.textContent = 'Sauvegarder en fichier';
saveButton.className = 'save-button';
saveButton.addEventListener('click', () => {
    const generatedText = document.getElementById('generatedText').textContent;
    Utils.saveAsFile(generatedText);
});
document.getElementById('result').appendChild(saveButton);

}

// Gestionnaire d'erreurs global
window.addEventListener('error', (event) => {
    Utils.log('error', 'Erreur non gérée', {
        message: event.message,
        filename: event.filename,
        line: event.lineno,
        column: event.colno
    });
});

// Initialiser l'application quand le DOM est chargé
document.addEventListener('DOMContentLoaded', initializeApp);

// Exposer certaines fonctionnalités globalement pour le débogage
window.debug = {
    uiManager,
    Utils,
    GPTAPI
};