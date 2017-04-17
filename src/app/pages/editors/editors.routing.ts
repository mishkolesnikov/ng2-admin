import { Routes, RouterModule }  from '@angular/router';

import { Editors } from './editors.component';
import { CkeditorPageComponent } from './components/ckeditor/ckeditor-page.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Editors,
    children: [
      { path: 'ckeditor', component: CkeditorPageComponent }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
