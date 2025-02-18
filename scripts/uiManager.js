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
       this.geoScaleGroup = document.getElementById('geoScale').parentElement;
       this.geoScaleSelect = document.getElementById('geoScale');
       this.destinationGroup = document.getElementById('destination').parentElement;
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
       this.villeInput.style.display = 'none';

       // Afficher les bons champs en fonction du type sélectionné
       switch (selectedType) {
           case PAGE_TYPES.TYPE_SEUL:
               this.specificTypeGroup.style.display = 'block';
               this.loadSpecificTypes(HEBERGEMENT_TYPES, this.specificTypeSelect);
               break;

           case PAGE_TYPES.TYPE_DESTINATION:
               this.specificTypeGroup.style.display = 'block';
               this.loadSpecificTypes(HEBERGEMENT_TYPES, this.specificTypeSelect);
               this.geoScaleGroup.style.display = 'block';
               this.destinationGroup.style.display = 'block';
               break;

           case PAGE_TYPES.TYPE_THEMATIQUE:
               this.specificTypeGroup.style.display = 'block';
               this.loadSpecificTypes(HEBERGEMENT_TYPES, this.specificTypeSelect);
               this.specificThematiqueGroup.style.display = 'block';
               this.loadSpecificTypes(SEJOUR_TYPES, this.specificThematiqueSelect);
               break;

           case PAGE_TYPES.THEMATIQUE_SEUL:
               this.specificThematiqueGroup.style.display = 'block';
               this.loadSpecificTypes(SEJOUR_TYPES, this.specificThematiqueSelect);
               break;

           case PAGE_TYPES.THEMATIQUE_DESTINATION:
               this.specificThematiqueGroup.style.display = 'block';
               this.loadSpecificTypes(SEJOUR_TYPES, this.specificThematiqueSelect);
               this.geoScaleGroup.style.display = 'block';
               this.destinationGroup.style.display = 'block';
               break;

           case PAGE_TYPES.WEEKEND_THEMATIQUE:
               this.specificThematiqueGroup.style.display = 'block';
               this.loadSpecificTypes(SEJOUR_TYPES, this.specificThematiqueSelect);
               break;

           case PAGE_TYPES.WEEKEND_DESTINATION:
               this.geoScaleGroup.style.display = 'block';
               this.destinationGroup.style.display = 'block';
               break;

           case PAGE_TYPES.DESTINATION_SEULE:
               this.geoScaleGroup.style.display = 'block';
               this.destinationGroup.style.display = 'block';
               break;

           default:
               console.warn("Type de page inconnu :", selectedType);
               break;
       }
   }

   handleGeoScaleChange() {
       console.log('Changement d\'échelle géographique'); // Debug
       const selectedScale = this.geoScaleSelect.value;
       console.log('Échelle sélectionnée:', selectedScale); // Debug

       if (selectedScale === 'ville') {
           this.destinationGroup.style.display = 'none';
           this.villeInput.style.display = 'block';
           this.villeInput.required = true;
           this.destinationSelect.required = false;
       } else {
           this.destinationGroup.style.display = 'block';
           this.villeInput.style.display = 'none';
           this.villeInput.required = false;
           this.destinationSelect.required = true;

           this.destinationSelect.innerHTML = '<option value="">Sélectionnez une destination</option>';
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

        const generatedText = await this.generateText(formData);
        this.showResult(generatedText);
    } catch (error) {
        console.error('Erreur lors de la génération:', error);
        this.showError('Erreur lors de la génération du texte');
    } finally {
        this.form.querySelectorAll('input, select, button').forEach(el => el.disabled = false);
    }
}

}

export default new UIManager();
