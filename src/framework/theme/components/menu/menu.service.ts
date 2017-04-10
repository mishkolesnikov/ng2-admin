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

    this.menuItems = List(this.config.menuItems);
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

  resetMenuItems(prevSelectedItem: NgaMenuItem) {
    prevSelectedItem.selected = false;

    if (prevSelectedItem.parent) {
      prevSelectedItem.parent.expanded = false;

      this.resetMenuItems(prevSelectedItem.parent);
    }
  }

  private prepareMenuItems(items: List<NgaMenuItem>) {
    items.forEach(i => this.prepareMenuItem(i));
  }

  private prepareMenuItem(item: NgaMenuItem) {
    if (item.children && item.children.size > 0) {
      const firstItemWithoutParent = item.children.filter(c => c.parent === null || c.parent === undefined).first();

      if (firstItemWithoutParent) {
        firstItemWithoutParent.parent = item;

        this.prepareMenuItem(firstItemWithoutParent);
      }
    } else if (item.parent) {
      this.prepareMenuItem(item.parent);
    }
  }

}
