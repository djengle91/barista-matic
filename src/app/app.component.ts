import { Component } from '@angular/core';
import { StateService } from './state/state';
import { CurrencyPipe, NgClass } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CurrencyPipe,
    NgClass,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatDividerModule
  ],
  template: `
    <div class="app-container">
      <div class="sidebar">
        <div class="logo-container">
          <span class="logo">☕</span>
          <h1 class="app-title">Barista-matic</h1>
        </div>
        
        <div class="inventory-section">
          <h2 class="sidebar-title">Inventory</h2>
          <div class="inventory-grid">
            @for (item of state.getIngredients(); track item.id) {
            <div class="inventory-item">
              <div class="item-header">
                <span class="ingredient-name">{{ item.name }}</span>
                <span class="inventory-count">{{ item.inventory }}/10</span>
              </div>
              <div class="progress-container">
                <div 
                  class="progress-bar" 
                  [style.width.%]="(item.inventory / 10) * 100"
                  [ngClass]="{
                    'low': item.inventory < 3,
                    'medium': item.inventory >= 3 && item.inventory < 7,
                    'high': item.inventory >= 7
                  }">
                </div>
              </div>
            </div>
            }
          </div>
          
          <button
            mat-flat-button
            color="warn"
            class="restock-button"
            (click)="state.restockInventory()">
            <mat-icon>refresh</mat-icon>
            Restock All
          </button>
        </div>
          </div>

      <div class="main-content">
        <header class="main-header">
          <h2>Menu</h2>
        </header>
        
        <div class="menu-grid">
          @for (drink of state.getDrinksWithPrices(); track drink.id) {
          <mat-card class="drink-card" [ngClass]="{'unavailable': !state.isDrinkAvailable(drink.id)}">
            <div class="drink-header">
              <h3 class="drink-name">{{ drink.name }}</h3>
              <span class="price">{{ drink.price | currency }}</span>
            </div>
            
            <mat-divider></mat-divider>
            
            <div class="card-footer">
              <button
                mat-flat-button
                color="primary"
                class="order-button"
                [disabled]="!state.isDrinkAvailable(drink.id)"
                (click)="state.dispenseDrink(drink.id)">
                Order
              </button>
            </div>
          </mat-card>
          }
        </div>
      </div>

      @if (state.getDispensing(); as drinkName) {
      <div class="dispensing-overlay">
        <div class="dispensing-modal">
          <mat-progress-spinner
            mode="indeterminate"
            diameter="50"
            color="primary">
          </mat-progress-spinner>
          <h3>Preparing {{ drinkName }}...</h3>
        </div>
      </div>
      }
    </div>
  `,
  styles: [`
    .app-container {
      display: grid;
      grid-template-columns: 300px 1fr;
      min-height: 100vh;
      background-color: #f8f9fa;
      font-family: 'Segoe UI', Roboto, sans-serif;
    }

    .sidebar {
      background-color: #ffffff;
      padding: 2rem 1.5rem;
      box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 2rem;
    }

    .logo {
      font-size: 2rem;
    }

    .app-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #303030;
      margin: 0;
    }

    .sidebar-title {
      font-size: 1.15rem;
      font-weight: 600;
      color: #303030;
      margin: 0 0 1.5rem 0;
    }

    .inventory-section {
      display: flex;
      flex-direction: column;
    }

    .inventory-grid {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      margin-bottom: 1.5rem;
    }

    .inventory-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .ingredient-name {
      font-size: 0.95rem;
      font-weight: 500;
      color: #404040;
    }

    .inventory-count {
      font-size: 0.8rem;
      color: #707070;
    }

    .progress-container {
      height: 6px;
      background-color: #eaecef;
      border-radius: 20px;
      overflow: hidden;
    }

    .progress-bar {
      height: 100%;
      border-radius: 20px;
      transition: width 0.3s ease;
    }

    .progress-bar.low { background-color: #f44336; }
    .progress-bar.medium { background-color: #ff9800; }
    .progress-bar.high { background-color: #4caf50; }

    .restock-button {
      margin-top: 1rem;
    }

    .main-content {
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .main-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .main-header h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #303030;
      margin: 0;
    }

    .menu-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .drink-card {
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
      transition: transform 0.2s, box-shadow 0.2s;
      display: flex;
      flex-direction: column;
    }

    .drink-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }

    .drink-card.unavailable {
      opacity: 0.7;
    }

    .drink-header {
      padding: 1.25rem;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .drink-name {
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0;
      color: #303030;
    }

    .price {
      font-weight: 700;
      font-size: 1.1rem;
    }

    mat-divider {
      margin: 0;
    }

    .card-footer {
      padding: 1rem;
      display: flex;
      justify-content: flex-end;
    }

    .order-button {
      border-radius: 24px;
      padding: 0 1.5rem;
    }

    .dispensing-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .dispensing-modal {
      background: white;
      border-radius: 20px;
      padding: 2.5rem;
      text-align: center;
      max-width: 320px;
      width: 100%;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
      align-items: center;
      display: flex;
      flex-direction: column;
    }

    .dispensing-modal h3 {
      font-size: 1.2rem;
      color: #303030;
      margin: 1.5rem 0 0;
      font-weight: 600;
    }
  `]
})
export class AppComponent {
  constructor(public state: StateService) {}
}
