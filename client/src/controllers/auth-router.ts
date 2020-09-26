import { BehaviorSubject } from 'rxjs'

export enum Route {
  Login,
  Register,
  ConfirmRegistration
}

export type NavigationAction = {
  route: Route,
  params?: Object,
}

export const INITIAL_NAV: NavigationAction = { route: Route.Login }

export class AuthRouter {
  nav$: BehaviorSubject<NavigationAction> = new BehaviorSubject(INITIAL_NAV)

  navigate(route: Route, params?: Object) {
    this.nav$.next({ route, params })
  }
}