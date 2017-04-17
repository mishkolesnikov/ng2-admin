import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { NgaModule } from '../../theme/nga.module';

import { routing }       from './editors.routing';
import { Editors } from './editors.component';
import { CkeditorPageComponent } from './components/ckeditor/ckeditor-page.component';


@NgModule({
  imports: [
    CommonModule,
    NgaModule,
    routing
  ],
  declarations: [
    Editors,
    CkeditorPageComponent
  ]
})
export class EditorsModule {
}
