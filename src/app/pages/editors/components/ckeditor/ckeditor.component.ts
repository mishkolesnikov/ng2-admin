import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
  public isHidden: boolean;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.url.subscribe((data: any) => {
      this.isHidden = !(this.route['_routerState'].snapshot.url === '/pages/editors/ckeditor');
    });
  }
}
