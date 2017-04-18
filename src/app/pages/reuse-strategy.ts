/**
 * reuse-strategy.ts
 */

import { ActivatedRouteSnapshot, RouteReuseStrategy, DetachedRouteHandle } from '@angular/router';

/** Interface for object which can store both: 
 * An ActivatedRouteSnapshot, which is useful for determining whether or not you should attach a route (see this.shouldAttach)
 * A DetachedRouteHandle, which is offered up by this.retrieve, in the case that you do want to attach the stored route
 */
interface RouteStorageObject {
  snapshot: ActivatedRouteSnapshot;
  handle: DetachedRouteHandle;
}

export class CustomReuseStrategy implements RouteReuseStrategy {

  private routesToStore = [
    'pages.maps.googlemaps',
    'pages.maps.leafletmaps',
    'pages.dashaboard',
    'pages.editors.ckeditor',
    'pages.iframes'
  ];

  /** 
   *
   * Object which will store RouteStorageObjects indexed by keys
   * This allows us to see if we've got a route stored for the requested path
   */
  storedRoutes: { [key: string]: RouteStorageObject } = {};

  private getPathFromRoot(route: ActivatedRouteSnapshot) {
    return route.pathFromRoot
      .map(function (route) {
        return route.url[0] && route.url[0].path;
      })
      .filter(function (url) { return url })
      .join('.');
  }

  /** 
   * Decides when the route should be stored
   * If the route should be stored, I believe the boolean is indicating to a controller whether or not to fire this.store
   * _When_ it is called though does not particularly matter, just know that this determines whether or not we store the route
   * @param route This is, at least as I understand it, the route that the user is currently on, and we would like to know if we want to store it
   * @returns boolean indicating that we want to (true) or do not want to (false) store that route
   */
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return this.routesToStore.indexOf(this.getPathFromRoot(route)) !== -1;
  }

  /**
   * Constructs object of type `RouteStorageObject` to store, and then stores it for later attachment
   * @param route This is stored for later comparison to requested routes, see `this.shouldAttach`
   * @param handle Later to be retrieved by this.retrieve, and offered up to whatever controller is using this class
   */
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {

    let storedRoute: RouteStorageObject = {
      snapshot: route,
      handle: handle
    };
    this.storedRoutes[this.getPathFromRoot(route)] = storedRoute;
  }

  /**
   * Determines whether or not there is a stored route and, if there is, whether or not it should be rendered in place of requested route
   * @param route The route the user requested
   * @returns boolean indicating whether or not to render the stored route
   */
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    var storedRouteObj = this.storedRoutes[this.getPathFromRoot(route)];

    let test = route.routeConfig &&
      storedRouteObj &&
      this.compareObjects(route.params, storedRouteObj.snapshot.params) &&
      this.compareObjects(route.queryParams, storedRouteObj.snapshot.queryParams);

    return !!test;
  }

  /** 
   * Finds the locally stored instance of the requested route, if it exists, and returns it
   * @param route New route the user has requested
   * @returns DetachedRouteHandle object which can be used to render the component
   */
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    var storedRouteObj = this.storedRoutes[this.getPathFromRoot(route)];

    if (route.routeConfig && storedRouteObj) {
      return storedRouteObj.handle;
    } else {
      return null;
    }
  }

  /** 
   * Determines whether or not the current route should be reused
   * @param future The route the user is going to, as triggered by the router
   * @param curr The route the user is currently on
   * @returns boolean basically indicating true if the user intends to leave the current route
   */
  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }

  /** 
   * This nasty bugger finds out whether the objects are _traditionally_ equal to each other, like you might assume someone else would have put this function in vanilla JS already
   * One thing to note is that it uses coercive comparison (==) on properties which both objects have, not strict comparison (===)
   * @param base The base object which you would like to compare another object to
   * @param compare The object to compare to base
   * @returns boolean indicating whether or not the objects have all the same properties and those properties are ==
   */
  private compareObjects(base: any, compare: any): boolean {

    // loop through all properties in base object
    for (let baseProperty in base) {

      // determine if comparrison object has that property, if not: return false
      if (compare.hasOwnProperty(baseProperty)) {
        switch (typeof base[baseProperty]) {
          // if one is object and other is not: return false
          // if they are both objects, recursively call this comparison function
          case 'object':
            if (typeof compare[baseProperty] !== 'object' || !this.compareObjects(base[baseProperty], compare[baseProperty])) { return false; } break;
          // if one is function and other is not: return false
          // if both are functions, compare function.toString() results
          case 'function':
            if (typeof compare[baseProperty] !== 'function' || base[baseProperty].toString() !== compare[baseProperty].toString()) { return false; } break;
          // otherwise, see if they are equal using coercive comparison
          default:
            if (base[baseProperty] != compare[baseProperty]) { return false; }
        }
      } else {
        return false;
      }
    }

    // returns true only after false HAS NOT BEEN returned through all loops
    return true;
  }
}