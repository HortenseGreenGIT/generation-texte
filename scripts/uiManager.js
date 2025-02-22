// uiManager.js
import { GPTAPI } from './apiHandlers.js';
import { LOCATIONS } from '../data/locations.js';
import { PAGE_TYPES, HEBERGEMENT_TYPES, SEJOUR_TYPES, MAX_SEO_CHARS } from './constants.js';

class UIManager {
   constructor() {
       // Éléments du formulaire
       this.form = document.getElementById('generationForm');
       this.pageTypeSelect = document.getElementById('pageType');
       this.specificTypeGroup = document.getElementById('specificTypeGroup');
       this.specificTypeSelect = document.getElementById('specificType');
       this.specificThematiqueGroup = document.getElementById('specificThematiqueGroup');
       this.specificThematiqueSelect = document.getElementById('specificThematique');
       this.geoScaleGroup = document.getElementById('geoScaleGroup');
       this.geoScaleSelect = document.getElementById('geoScale');
       this.destinationGroup = document.getElementById('destinationGroup');
       this.destinationSelect = document.getElementById('destination');
       this.villeInput = document.getElementById('villeInput');
       this.seoQueryInput = document.getElementById('seoQuery');
       this.charCount = document.getElementById('charCount');
       this.resultArea = document.getElementById('result');
       this.generatedText = document.getElementById('generatedText');

       this.initializeEventListeners();
   }

   initializeEventListeners() {
       console.log('Initialisation des événements'); // Debug
       this.pageTypeSelect.addEventListener('change', () => this.handlePageTypeChange());
       this.geoScaleSelect.addEventListener('change', () => this.handleGeoScaleChange());
       this.seoQueryInput.addEventListener('input', () => this.updateCharCount());
       this.form.addEventListener('submit', (e) => this.handleSubmit(e));
   }

   handlePageTypeChange() {
    const selectedType = parseInt(this.pageTypeSelect.value);

    // Masquer tous les champs par défaut
    this.specificTypeGroup.style.display = 'none';
    this.specificThematiqueGroup.style.display = 'none';
    this.geoScaleGroup.style.display = 'none';
    this.destinationGroup.style.display = 'none';
    this.villeInput.style.display = 'none'

    // Réinitialiser le required des champs destination et ville
    this.destinationSelect.required = false;
    this.villeInput.required = false;

    // Afficher les bons champs en fonction du type sélectionné
    switch (selectedType) {
        case PAGE_TYPES.TYPE_SEUL:
            this.specificTypeGroup.style.display = 'block';
            this.loadSpecificTypes(HEBERGEMENT_TYPES, this.specificTypeSelect);
            break;

        case PAGE_TYPES.TYPE_DESTINATION:
    this.specificTypeGroup.style.display = 'block'; // Ajout pour afficher le type d’hébergement
    this.loadSpecificTypes(HEBERGEMENT_TYPES, this.specificTypeSelect);
    this.geoScaleGroup.style.display = 'block';
    this.destinationGroup.style.display = 'block';
    this.destinationSelect.required = true;
    break;

case PAGE_TYPES.THEMATIQUE_DESTINATION:
    this.specificThematiqueGroup.style.display = 'block'; // Ajout pour afficher la thématique
    this.loadSpecificTypes(SEJOUR_TYPES, this.specificThematiqueSelect);
    this.geoScaleGroup.style.display = 'block';
    this.destinationGroup.style.display = 'block';
    this.destinationSelect.required = true;
    break;

        case PAGE_TYPES.WEEKEND_DESTINATION:
        case PAGE_TYPES.DESTINATION_SEULE:
            this.geoScaleGroup.style.display = 'block';
            this.destinationGroup.style.display = 'block';
            this.destinationSelect.required = true;
            break;

        case PAGE_TYPES.TYPE_THEMATIQUE:
            this.specificTypeGroup.style.display = 'block';
            this.loadSpecificTypes(HEBERGEMENT_TYPES, this.specificTypeSelect);
            this.specificThematiqueGroup.style.display = 'block';
            this.loadSpecificTypes(SEJOUR_TYPES, this.specificThematiqueSelect);
            break;

        case PAGE_TYPES.THEMATIQUE_SEUL:
        case PAGE_TYPES.WEEKEND_THEMATIQUE:
            this.specificThematiqueGroup.style.display = 'block';
            this.loadSpecificTypes(SEJOUR_TYPES, this.specificThematiqueSelect);
            break;

        default:
            console.warn("Type de page inconnu :", selectedType);
            break;
    }

    // ✅ Gérer la logique ville/destination **une seule fois ici**
    if (this.geoScaleGroup.style.display !== 'none') {
        if (this.geoScaleSelect.value === 'ville') {
            this.destinationSelect.style.display = 'none';
            this.villeInput.style.display = 'block';
            this.villeInput.required = true;
        } else {
            this.destinationSelect.style.display = 'block';
            this.villeInput.style.display = 'none';
            this.villeInput.required = false;
        }
    }
}



   handleGeoScaleChange() {
    console.log('Changement d\'échelle géographique'); // Debug
    const selectedScale = this.geoScaleSelect.value;

    // Si la destination n'est pas visible, on ne modifie rien
    if (this.destinationGroup.style.display === 'none') {
        return;
    }

    this.destinationSelect.innerHTML = '<option value="" disabled selected>Sélectionnez une destination</option>';
    this.villeInput.value = ''; 
    this.destinationSelect.style.display = 'block';
    this.villeInput.style.display = 'none';

    if (selectedScale === 'ville') {
        console.log('Mode ville activé'); // Debug
        this.destinationSelect.style.display = 'none';
        this.villeInput.style.display = 'block';
        this.villeInput.required = true;
        this.destinationSelect.required = false;
    }
    else {
        console.log('Mode région/département activé'); // Debug
        this.destinationSelect.style.display = 'block';
        this.villeInput.style.display = 'none';
        this.villeInput.required = false;
        this.destinationSelect.required = true;

        const locations = selectedScale === 'region' ? LOCATIONS.regions : LOCATIONS.departements;

        locations.forEach(location => {
            const option = document.createElement('option');
            option.value = location;
            option.textContent = location;
            this.destinationSelect.appendChild(option);
        });
    }
}
   loadSpecificTypes(types, selectElement) {
       selectElement.innerHTML = '<option value="">Sélectionnez une option</option>';
       types.forEach(type => {
           const option = document.createElement('option');
           option.value = type.id;
           option.textContent = type.name;
           selectElement.appendChild(option);
       });
   }

   updateCharCount() {
       const count = this.seoQueryInput.value.length;
       this.charCount.textContent = `${count}/${MAX_SEO_CHARS}`;
   }

async generateText(formData) {
    console.log('Génération du texte'); // Debug
    const prompt = GPTAPI.generatePrompt(formData);
    return await GPTAPI.generateText(prompt);
}

showResult(text) {
    this.generatedText.textContent = text;
    this.resultArea.style.display = 'block';
    this.resultArea.scrollIntoView({ behavior: 'smooth' });
}

showError(message) {
    alert(message);
}

   async handleSubmit(e) {
    e.preventDefault();
    console.log('Soumission du formulaire');
    console.log("Vérification de `this` dans handleSubmit:", this);

    try {
        this.form.querySelectorAll('input, select, button').forEach(el => el.disabled = true);

        const selectedType = parseInt(this.pageTypeSelect.value);

        let formData = {
            pageType: selectedType,
            seoQuery: this.seoQueryInput.value
        };

        // Ajouter dynamiquement les champs nécessaires selon le type de page
        switch (selectedType) {
            case PAGE_TYPES.TYPE_SEUL:
                formData.specificType = this.specificTypeSelect.selectedOptions[0]?.text || ''; 
                break;

            case PAGE_TYPES.TYPE_DESTINATION:
                formData.specificType = this.specificTypeSelect.selectedOptions[0]?.text || ''; 
                formData.destination = this.geoScaleSelect.value === 'ville' ? this.villeInput.value : this.destinationSelect.value;
                break;

            case PAGE_TYPES.TYPE_THEMATIQUE:
                formData.specificType = this.specificTypeSelect.selectedOptions[0]?.text || ''; 
                formData.thematique = this.specificThematiqueSelect.selectedOptions[0]?.text || ''; 
                break;

            case PAGE_TYPES.THEMATIQUE_SEUL:
                formData.thematique = this.specificThematiqueSelect.selectedOptions[0]?.text || ''; 
                break;

            case PAGE_TYPES.THEMATIQUE_DESTINATION:
                formData.thematique = this.specificThematiqueSelect.selectedOptions[0]?.text || ''; 
                formData.destination = this.geoScaleSelect.value === 'ville' ? this.villeInput.value : this.destinationSelect.value;
                break;

            case PAGE_TYPES.WEEKEND_THEMATIQUE:
                formData.thematique = this.specificThematiqueSelect.selectedOptions[0]?.text || ''; 
                break;

            case PAGE_TYPES.WEEKEND_DESTINATION:
                formData.destination = this.geoScaleSelect.value === 'ville' ? this.villeInput.value : this.destinationSelect.value;
                break;

            case PAGE_TYPES.DESTINATION_SEULE:
                formData.destination = this.geoScaleSelect.value === 'ville' ? this.villeInput.value : this.destinationSelect.value;
                break;

            default:
                break;
        }

        console.log('Données du formulaire:', formData);

        const generatedText = await this.generateText?.(formData);
        if (!generatedText) {
        console.error("Erreur : Texte généré invalide");
        return;
        }
        this.showResult(generatedText);
    } catch (error) {
        console.error('Erreur lors de la génération:', error);
        if (typeof this.showError === "function") {
            this.showError('Erreur lors de la génération du texte');
        } else {
            console.error("showError n'est pas une fonction valide.");
        }
    } finally {
        this.form.querySelectorAll('input, select, button').forEach(el => el.disabled = false);
    }
}

}

export default new UIManager();
