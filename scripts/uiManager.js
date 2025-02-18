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
       this.geoScaleSelect = document.getElementById('geoScale');
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
    this.destinationSelect.style.display = 'none';
    this.villeInput.style.display = 'none';

    // Afficher les bons champs en fonction du type sélectionné
    switch (selectedType) {
        case PAGE_TYPES.TYPE_SEUL:
            this.specificTypeGroup.style.display = 'block';
            this.loadSpecificTypes(HEBERGEMENT_TYPES);
            break;

        case PAGE_TYPES.TYPE_DESTINATION:
            this.specificTypeGroup.style.display = 'block';
            this.loadSpecificTypes(HEBERGEMENT_TYPES);
            this.destinationSelect.style.display = 'block';
            break;

        case PAGE_TYPES.TYPE_THEMATIQUE:
            this.specificTypeGroup.style.display = 'block';
            this.loadSpecificTypes(HEBERGEMENT_TYPES);
            this.specificTypeSelect.style.display = 'block';
            this.loadSpecificTypes(SEJOUR_TYPES);
            break;

        case PAGE_TYPES.THEMATIQUE_SEUL:
            this.specificTypeGroup.style.display = 'block';
            this.loadSpecificTypes(SEJOUR_TYPES);
            break;

        case PAGE_TYPES.THEMATIQUE_DESTINATION:
            this.specificTypeGroup.style.display = 'block';
            this.loadSpecificTypes(SEJOUR_TYPES);
            this.destinationSelect.style.display = 'block';
            break;

        case PAGE_TYPES.WEEKEND_THEMATIQUE:
            this.specificTypeGroup.style.display = 'block';
            this.loadSpecificTypes(SEJOUR_TYPES);
            break;

        case PAGE_TYPES.WEEKEND_DESTINATION:
            this.destinationSelect.style.display = 'block';
            break;

        case PAGE_TYPES.DESTINATION_SEULE:
            this.destinationSelect.style.display = 'block';
            break;

        default:
            break;
    }
}


   handleGeoScaleChange() {
       console.log('Changement d\'échelle géographique'); // Debug
       const selectedScale = this.geoScaleSelect.value;
       console.log('Échelle sélectionnée:', selectedScale); // Debug

       if (selectedScale === 'ville') {
           console.log('Mode ville activé'); // Debug
           this.destinationSelect.style.display = 'none';
           this.villeInput.style.display = 'block';
           this.villeInput.required = true;
           this.destinationSelect.required = false;
       } else {
           console.log('Mode région/département activé'); // Debug
           this.destinationSelect.style.display = 'block';
           this.villeInput.style.display = 'none';
           this.villeInput.required = false;
           this.destinationSelect.required = true;

           this.destinationSelect.innerHTML = '<option value="">Sélectionnez une destination</option>';
           const locations = selectedScale === 'region' ? LOCATIONS.regions : LOCATIONS.departements;
           console.log('Locations chargées:', locations); // Debug

           locations.forEach(location => {
               const option = document.createElement('option');
               option.value = location;
               option.textContent = location;
               this.destinationSelect.appendChild(option);
           });
       }
   }

   loadSpecificTypes(pageType) {
       console.log('Chargement des types spécifiques'); // Debug
       const types = pageType === PAGE_TYPES.HEBERGEMENT ? HEBERGEMENT_TYPES : SEJOUR_TYPES;
       
       this.specificTypeSelect.innerHTML = '<option value="">Sélectionnez un type</option>';
       types.forEach(type => {
           const option = document.createElement('option');
           option.value = type.id;
           option.textContent = type.name;
           this.specificTypeSelect.appendChild(option);
       });
   }

   updateCharCount() {
       const count = this.seoQueryInput.value.length;
       this.charCount.textContent = `${count}/${MAX_SEO_CHARS}`;
   }

   async handleSubmit(e) {
    e.preventDefault();
    console.log('Soumission du formulaire');

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
                formData.specificType = this.specificTypeSelect.value;
                break;

            case PAGE_TYPES.TYPE_DESTINATION:
                formData.specificType = this.specificTypeSelect.value;
                formData.destination = this.geoScaleSelect.value === 'ville' ? this.villeInput.value : this.destinationSelect.value;
                break;

            case PAGE_TYPES.TYPE_THEMATIQUE:
                formData.specificType = this.specificTypeSelect.value;
                formData.thematique = this.specificTypeSelect.value;
                break;

            case PAGE_TYPES.THEMATIQUE_SEUL:
                formData.thematique = this.specificTypeSelect.value;
                break;

            case PAGE_TYPES.THEMATIQUE_DESTINATION:
                formData.thematique = this.specificTypeSelect.value;
                formData.destination = this.geoScaleSelect.value === 'ville' ? this.villeInput.value : this.destinationSelect.value;
                break;

            case PAGE_TYPES.WEEKEND_THEMATIQUE:
                formData.thematique = this.specificTypeSelect.value;
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

        const generatedText = await this.generateText(formData);
        this.showResult(generatedText);
    } catch (error) {
        console.error('Erreur lors de la génération:', error);
        this.showError('Erreur lors de la génération du texte');
    } finally {
        this.form.querySelectorAll('input, select, button').forEach(el => el.disabled = false);
    }
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

   showAlert(message, type = 'info') {
       alert(message);
   }
}

export default new UIManager();