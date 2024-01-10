import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class EventService {


  private dataObserved = new BehaviorSubject<any>('');
  currentEvent = this.dataObserved.asObservable();

  private cartdataObserved = new BehaviorSubject<any>('');
  cart_currentEvent = this.cartdataObserved.asObservable();


  private wishlistDataObserved = new BehaviorSubject<any>('');
  wishlist_Event = this.wishlistDataObserved.asObservable();


  private subsDataObserved = new BehaviorSubject<any>('');
  subs_Event = this.subsDataObserved.asObservable();


  constructor() { }



  publishUser(param): void {
    this.dataObserved.next(param);
  }

  publishCart(param2): void {
    this.cartdataObserved.next(param2);
  }


  wishlistEvent(param): void {
    this.wishlistDataObserved.next(param);
  }

  subsEvent(param): void {
    this.subsDataObserved.next(param);
  }


}
