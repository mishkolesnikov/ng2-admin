/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { List } from 'immutable';

import { NgaMenuModuleConfig, NgaMenuItem } from './menu.options';
import { NgaMenuService } from './menu.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[ngaMenuItem]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a href *ngIf="!menuItem.children"
            [ngClass]="{ 'active': menuItem.selected }"
            [attr.href]="menuItem.link || menuItem.url"
            [attr.target]="menuItem.target"
            [attr.title]="menuItem.title"
            (mouseenter)="onHoverItem(menuItem)"
            (click)="onSelectItem(menuItem)">
      <i class="{{ menuItem.icon }}" *ngIf="menuItem.icon"></i>
      <i *ngIf="!menuItem.icon"></i>
      <span>{{ menuItem.title }}</span>
    </a>
    <a href *ngIf="menuItem.children"
            [ngClass]="{ 'active': menuItem.selected }"
            (click)="$event.preventDefault();onToogleSubMenu(menuItem)"
            [attr.target]="menuItem.target"
            [attr.title]="menuItem.title"
            (mouseenter)="onHoverItem(menuItem)">
      <i class="{{ menuItem.icon }}" *ngIf="menuItem.icon"></i>
      <i *ngIf="!menuItem.icon"></i>
      <span>{{ menuItem.title }}</span>
      <i class="ion" [ngClass]="{ 'ion-chevron-down': !menuItem.expanded,
                                  'ion-chevron-up': menuItem.expanded }"></i>
    </a>
    <ul [ngClass]="{ 'menu-collapsed': !(menuItem.children && menuItem.expanded),
                     'menu-expanded': menuItem.expanded }">
      <li ngaMenuItem *ngFor="let item of menuItem.children"
                      [menuItem]="item"
                      (hoverItem)="onHoverItem($event)"
                      (toogleSubMenu)="onToogleSubMenu($event)"
                      (selectItem)="onSelectItem($event)"></li>
    </ul>
  `,
})
export class NgaMenuItemComponent {

  @Input() menuItem: NgaMenuItem;

  @Output() hoverItem = new EventEmitter<any>();
  @Output() toogleSubMenu = new EventEmitter<any>();
  @Output() selectItem = new EventEmitter<any>();

  constructor(private router: Router,
    private menuService: NgaMenuService) { }

  onToogleSubMenu(item: NgaMenuItem) {
    this.toogleSubMenu.emit(item);
  }

  onHoverItem(item: NgaMenuItem) {
    this.hoverItem.emit(item);
  }

  onSelectItem(item: NgaMenuItem) {
    this.selectItem.emit(item);
  }

}

@Component({
  selector: 'nga-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./menu.component.scss'],
  template: `
    <ul>
      <li ngaMenuItem *ngFor="let item of menuItems"
                      [menuItem]="item"
                      (hoverItem)="onHoverItem($event)"
                      (toogleSubMenu)="onToogleSubMenu($event)"
                      (selectItem)="onSelectItem($event)"></li>
    </ul>
  `,
})
export class NgaMenuComponent implements OnInit {

  menuItems: List<NgaMenuItem>;

  @Output() hoverItem = new EventEmitter<any>();
  @Output() toogleSubMenu = new EventEmitter<any>();

  private selectedMenuItem: NgaMenuItem;

  constructor(private menuService: NgaMenuService) { }

  ngOnInit() {
    this.menuService.menuItemsChanges
      .subscribe((data: List<NgaMenuItem>) => this.menuItems = data);

    this.menuService.getMenuItems();
  }

  onHoverItem(item: NgaMenuItem) {
    this.hoverItem.emit(item);
  }

  onToogleSubMenu(item: NgaMenuItem) {
    item.expanded = !item.expanded;

    this.toogleSubMenu.emit(item);
  }

  onSelectItem(item: NgaMenuItem) {
    if (this.selectedMenuItem) {
      this.selectedMenuItem.selected = false;
      this.menuService.resetMenuItems(this.selectedMenuItem);
    }

    this.menuService.selectMenuItem(item);

    this.selectedMenuItem = item;
  }

}
