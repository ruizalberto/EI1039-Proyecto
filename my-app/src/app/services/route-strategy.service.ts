import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RouteStrategy } from '../interfaces/route-strategy';

@Injectable({
  providedIn: 'root',
})
export class RouteStrategyService {
  private strategySelected!: RouteStrategy;
  private isSelected: boolean;
  strategySubject: BehaviorSubject<RouteStrategy | null> = new BehaviorSubject<RouteStrategy | null>(null);
  strategyData$ = this.strategySubject.asObservable();

  constructor() {
    this.isSelected = false;
  }

  setStrategySelected(strategy: RouteStrategy) {
    this.strategySelected = strategy;
    this.isSelected = true;
    this.updateStrategySubject();
  }

  getStrategySelected(): RouteStrategy {
    return this.strategySelected;
  }

  isStrategySelected(): boolean {
    return this.isSelected;
  }

  updateStrategySubject() {
    this.strategySubject.next(this.strategySelected);
  }
}
