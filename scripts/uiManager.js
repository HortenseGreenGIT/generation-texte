// uiManager.js
import { GPTAPI } from './apiHandlers.js';
import { LOCATIONS } from '/Users/macbook/Library/CloudStorage/OneDrive-Personnel/Documents/Automatisation génération texte IA/data/locations.js';
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
       console.log('Changement de type de page'); // Debug
       const selectedType = parseInt(this.pageTypeSelect.value);
       
       if (selectedType === PAGE_TYPES.HEBERGEMENT || selectedType === PAGE_TYPES.SEJOUR) {
           this.specificTypeGroup.style.display = 'block';
           this.loadSpecificTypes(selectedType);
       } else {
           this.specificTypeGroup.style.display = 'none';
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
       console.log('Soumission du formulaire'); // Debug

       try {
           this.form.querySelectorAll('input, select, button').forEach(el => el.disabled = true);

           const formData = {
               pageType: this.pageTypeSelect.value,
               specificType: this.specificTypeSelect.value,
               geoScale: this.geoScaleSelect.value,
               destination: this.geoScaleSelect.value === 'ville' ? this.villeInput.value : this.destinationSelect.value,
               seoQuery: this.seoQueryInput.value
           };

           console.log('Données du formulaire:', formData); // Debug

           const generatedText = await GPTAPI.generateText(formData);
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