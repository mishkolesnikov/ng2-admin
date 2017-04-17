import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'iframe-component',
  templateUrl: './iframe.component.html',
  styleUrls: ['./iframe.component.scss']
})

export class IframeComponent {
  isHidden;
  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.url.subscribe((data: any) => {
      this.isHidden = !(this.route['_routerState'].snapshot.url === '/pages/iframes')
    });
  }
}
