import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import './ckeditor.loader';
import 'ckeditor';
import 'style-loader!./ckeditor.scss';

@Component({
  selector: 'ckeditor-component',
  templateUrl: './ckeditor.html',
})

export class Ckeditor {
  public ckeditorContent: string = '<p>Hello CKEditor</p>';
  public config = {
    uiColor: '#F0F3F4',
    height: '600',
  };
  private isHidden: boolean = true;
  private isLoaded: boolean = false;
  private selfRouteUrl: string = '/pages/editors/ckeditor';

  constructor(private router: Router) {
  }

  ngOnInit() {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.isLoaded = this.isLoaded || val.url == this.selfRouteUrl;
        this.isHidden = val.url != this.selfRouteUrl;
      }
    });
  }
}
