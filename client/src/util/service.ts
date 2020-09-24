import { Subscription } from 'rxjs'

// @@TODO: this interface def may be superfluous
export interface Servicer {
  children: Set<Servicer>
  $subscriptions: Set<Subscription>
  destroy(): void
  $(subscription: Subscription): Subscription
  supervise(servicer: Servicer): Servicer
}

export class Service implements Servicer {
  children: Set<Service> = new Set()

  $subscriptions: Set<Subscription> = new Set()

  destroy() {
    this.$subscriptions.forEach((subscription) => { subscription.unsubscribe() })

    this.children.forEach((child) => {
      child.destroy()
    })
  }

  $(subscription: Subscription): Subscription {
    this.$subscriptions.add(subscription)
    return subscription
  }

  supervise<T>(child: unknown) { // @@TODO: fix this typing
    this.children.add(child as Service)
    return child as T
  }
}