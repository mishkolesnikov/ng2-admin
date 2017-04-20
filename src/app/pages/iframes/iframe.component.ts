import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'iframe-component',
  templateUrl: './iframe.component.html',
  styleUrls: ['./iframe.component.scss']
})

export class IframeComponent {
  public isHidden;
  public isLoaded = false;
  private selfRoute = '/pages/iframes';

  constructor(private router: Router) { }

  ngOnInit() {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.isLoaded = this.isLoaded || val.url == this.selfRoute;
        this.isHidden = val.url != this.selfRoute;
      }
    });
  }
}
