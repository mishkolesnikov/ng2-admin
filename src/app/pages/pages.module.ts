import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteReuseStrategy } from '@angular/router';
import { CustomReuseStrategy } from './reuse-strategy';
import { IframeComponent } from './iframes/iframe.component';
import { IframePageComponent } from './iframes/iframe-page.component';
import { Ckeditor } from './editors/components/ckeditor/ckeditor.component';
import { CKEditorModule } from 'ng2-ckeditor';
import { FormsModule } from '@angular/forms';


import { routing } from './pages.routing';
import { NgaModule } from '../theme/nga.module';


import { Pages } from './pages.component';

@NgModule({
  imports: [CommonModule, NgaModule, routing, CKEditorModule, FormsModule],
  declarations: [Pages, IframeComponent, IframePageComponent, Ckeditor],
  providers: [
    { provide: RouteReuseStrategy, useClass: CustomReuseStrategy }
  ]
})
export class PagesModule {
}
