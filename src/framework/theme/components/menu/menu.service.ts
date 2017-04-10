/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Injectable, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { Routes } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { List } from 'immutable';

import { NgaMenuItem, NgaMenuModuleConfig } from './menu.options';

@Injectable()
export class NgaMenuService {

  private menuItems: List<NgaMenuItem>;
  private menuItemsChanges$ = new Subject();

  menuItemsChanges: Observable<List<NgaMenuItem>> = this.menuItemsChanges$.asObservable();

  constructor(@Optional() private config: NgaMenuModuleConfig,
                          private router: Router) {

    this.menuItems = this.config.menuItems;
  }

  getMenuItems() {
    this.prepareMenuItems(this.menuItems);

    this.menuItemsChanges$.next(this.menuItems);
    this.menuItemsChanges$.complete();
  }

  addMenuItem(item: NgaMenuItem) {
    const result = this.menuItems.push(item);

    this.menuItemsChanges$.next(result);
    this.menuItemsChanges$.complete();
  }

  selectMenuItem(item: NgaMenuItem) {
    item.selected = true;

    if (item.parent) {
      item.parent.expanded = true;

      this.selectMenuItem(item.parent);
    }
  }

  private prepareMenuItems(items: List<NgaMenuItem>) {
    items.forEach(i => this.prepareMenuItem(i));
  }

  private prepareMenuItem(parent: NgaMenuItem) {
    if (parent.children && parent.children.size > 0) {
      const firstItemWithoutParent = parent.children.filter(c => c.parent === null || c.parent === undefined).first();

      if (firstItemWithoutParent) {
        firstItemWithoutParent.parent = parent;

        this.prepareMenuItem(firstItemWithoutParent);
      }
    } else if (parent.parent) {
      this.prepareMenuItem(parent.parent);
    }
  }

}
