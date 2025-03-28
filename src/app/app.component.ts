import { Component } from '@angular/core';
import { StateService } from './state/state';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CurrencyPipe],
  template: `
    <div class="container">
      <h1>Barista-matic</h1>

      <section class="inventory">
        <h2>Inventory</h2>
        <div class="inventory-grid">
          @for (item of state.getIngredients(); track item.id) {
          <div class="inventory-item">
            <span>{{ item.name }}</span>
            <span>{{ item.inventory }}</span>
          </div>
          }
        </div>
        <button (click)="state.restockInventory()">Restock</button>
      </section>

      <section class="menu">
        <h2>Menu</h2>
        <div class="menu-grid">
          @for (drink of state.getDrinksWithPrices(); track drink.id) {
          <div class="drink-item">
            <span>{{ drink.name }}</span>
            <span>{{ drink.price | currency }}</span>
            <button
              [disabled]="!state.isDrinkAvailable(drink.id)"
              (click)="state.dispenseDrink(drink.id)"
            >
              Order
            </button>
          </div>
          }
        </div>
      </section>

      @if (state.getDispensing(); as drinkName) {
      <div class="dispensing-overlay">
        <p>Dispensing {{ drinkName }}...</p>
      </div>
      }
    </div>
  `,
  styles: [
    `
      .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
      }

      .inventory-grid,
      .menu-grid {
        display: grid;
        gap: 10px;
        margin: 20px 0;
      }

      .inventory-item,
      .drink-item {
        display: grid;
        grid-template-columns: 1fr auto auto;
        align-items: center;
        gap: 10px;
        padding: 10px;
        background: #f5f5f5;
        border-radius: 4px;
      }

      .dispensing-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: grid;
        place-items: center;
        color: white;
        font-size: 24px;
      }

      button {
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        background: #007bff;
        color: white;
        cursor: pointer;
      }

      button:disabled {
        background: #ccc;
        cursor: not-allowed;
      }
    `,
  ],
})
export class AppComponent {
  constructor(public state: StateService) {}
}
