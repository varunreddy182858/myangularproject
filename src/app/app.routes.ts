import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component'; 
import { BusinessCardViewerComponent } from './components/business-card-viewer/business-card-viewer.component';
import { CustomizationFormComponent } from './components/customization-form/customization-form.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },  // Home page as default
    { path: 'customization', component: CustomizationFormComponent }, 
    { path: 'view-card/:id', component: BusinessCardViewerComponent }
];

