import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { StateService } from './state';

// filepath: src/app/state/state.spec.ts

describe('StateService', () => {
  let service: StateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StateService]
    });
    service = TestBed.inject(StateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Initial State', () => {
    it('should initialize with correct ingredients', () => {
      const ingredients = service.getIngredients();
      expect(ingredients.length).toBe(9);
      expect(ingredients[0].name).toBe('Coffee');
      expect(ingredients[0].inventory).toBe(10);
    });

    it('should initialize with correct drinks', () => {
      const drinks = service.getDrinks();
      expect(drinks.length).toBe(6);
      expect(drinks[0].name).toBe('Coffee');
      expect(drinks[0].recipe.length).toBe(3);
    });

    it('should initialize with empty dispensing state', () => {
      expect(service.getDispensing()).toBe('');
    });
  });

  describe('getDrinksWithPrices', () => {
    it('should calculate correct prices for drinks', () => {
      const drinksWithPrices = service.getDrinksWithPrices();
      
      // Coffee: 3 x Coffee (0.75) + Sugar (0.25) + Cream (0.25) = 2.75
      expect(drinksWithPrices[0].price).toBe(0.75 * 3 + 0.25 + 0.25);
      
      // Decaf Coffee: 3 x Decaf Coffee (0.75) + Sugar (0.25) + Cream (0.25) = 2.75
      expect(drinksWithPrices[1].price).toBe(0.75 * 3 + 0.25 + 0.25);
      
      // Caffe Latte: 2 x Espresso (1.1) + Steamed Milk (0.35) = 2.55
      expect(drinksWithPrices[2].price).toBe(1.1 * 2 + 0.35);
      
      // Caffe Americano: 3 x Espresso (1.1) = 3.3
      expect(drinksWithPrices[3].price).toBe(1.1 * 3);
      
      // Caffe Mocha: Espresso (1.1) + Cocoa (0.9) + Steamed Milk (0.35) + Whipped Cream (1.0) = 3.35
      expect(drinksWithPrices[4].price).toBe(1.1 + 0.9 + 0.35 + 1.0);
      
      // Capuccino: 2 x Espresso (1.1) + Steamed Milk (0.35) + Foamed Milk (0.35) = 2.9
      expect(drinksWithPrices[5].price).toBe(1.1 * 2 + 0.35 + 0.35);
    });

    it('should handle invalid ingredient references', () => {
      // Modify a drink recipe to include an invalid ingredient ID
      const originalDrinks = service['drinks']();
      const modifiedDrinks = [...originalDrinks];
      modifiedDrinks[0] = {
        ...modifiedDrinks[0],
        recipe: [
          ...modifiedDrinks[0].recipe,
          { ingredientId: 'non-existent', amount: 1 }
        ]
      };
      
      // Set the modified drinks
      service['drinks'].set(modifiedDrinks);
      
      // Calculate prices with the invalid ingredient
      const drinksWithPrices = service.getDrinksWithPrices();
      
      // Price should still be calculated correctly for valid ingredients
      expect(drinksWithPrices[0].price).toBe(0.75 * 3 + 0.25 + 0.25);
      
      // Restore original drinks
      service['drinks'].set(originalDrinks);
    });
  });

  describe('isDrinkAvailable', () => {
    it('should return true when all ingredients are available', () => {
      // All ingredients have inventory of 10 by default
      const coffeeId = service.getDrinks()[0].id;
      expect(service.isDrinkAvailable(coffeeId)).toBeTrue();
    });

    it('should return false when an ingredient is out of stock', () => {
      // Set Coffee inventory to 0
      const originalIngredients = service['ingredients']();
      const modifiedIngredients = [...originalIngredients];
      modifiedIngredients[0] = {
        ...modifiedIngredients[0],
        inventory: 0
      };
      
      service['ingredients'].set(modifiedIngredients);
      
      // Check if Coffee drink is available (it needs Coffee ingredient)
      const coffeeId = service.getDrinks()[0].id;
      expect(service.isDrinkAvailable(coffeeId)).toBeFalse();
      
      // Restore original ingredients
      service['ingredients'].set(originalIngredients);
    });

    it('should return false when there is not enough of an ingredient', () => {
      // Set Coffee inventory to 2 (less than the required 3)
      const originalIngredients = service['ingredients']();
      const modifiedIngredients = [...originalIngredients];
      modifiedIngredients[0] = {
        ...modifiedIngredients[0],
        inventory: 2
      };
      
      service['ingredients'].set(modifiedIngredients);
      
      // Check if Coffee drink is available (it needs 3 Coffee)
      const coffeeId = service.getDrinks()[0].id;
      expect(service.isDrinkAvailable(coffeeId)).toBeFalse();
      
      // Restore original ingredients
      service['ingredients'].set(originalIngredients);
    });

    it('should return false for non-existent drink ID', () => {
      expect(service.isDrinkAvailable('non-existent')).toBeFalse();
    });
  });

  describe('dispenseDrink', () => {
    it('should set dispensing state to drink name', () => {
      const coffeeId = service.getDrinks()[0].id;
      service.dispenseDrink(coffeeId);
      expect(service.getDispensing()).toBe('Coffee');
    });

    it('should reduce ingredient inventory when a drink is dispensed', () => {
      const coffeeId = service.getDrinks()[0].id;
      const beforeIngredients = service.getIngredients();
      
      // Get initial inventory values
      const initialCoffeeInventory = beforeIngredients[0].inventory;
      const initialSugarInventory = beforeIngredients[2].inventory;
      const initialCreamInventory = beforeIngredients[3].inventory;
      
      // Dispense the coffee drink
      service.dispenseDrink(coffeeId);
      
      // Check updated inventory
      const afterIngredients = service.getIngredients();
      expect(afterIngredients[0].inventory).toBe(initialCoffeeInventory - 3);
      expect(afterIngredients[2].inventory).toBe(initialSugarInventory - 1);
      expect(afterIngredients[3].inventory).toBe(initialCreamInventory - 1);
    });

    it('should do nothing for non-existent drink ID', () => {
      const initialIngredients = service.getIngredients();
      service.dispenseDrink('non-existent');
      
      // Dispensing state should not change
      expect(service.getDispensing()).toBe('');
      
      // Ingredients should not change
      expect(service.getIngredients()).toEqual(initialIngredients);
    });

    it('should reset dispensing state after timeout', fakeAsync(() => {
      const coffeeId = service.getDrinks()[0].id;
      service.dispenseDrink(coffeeId);
      expect(service.getDispensing()).toBe('Coffee');
      
      // Fast forward time
      tick(3000);
      
      // Dispensing should be reset
      expect(service.getDispensing()).toBe('');
    }));
  });

  describe('restockInventory', () => {
    it('should reset all ingredient inventory levels to 10', () => {
      // First reduce some inventory levels
      const coffeeId = service.getDrinks()[0].id;
      service.dispenseDrink(coffeeId);
      
      // Some ingredients should have reduced inventory
      const beforeRestock = service.getIngredients();
      expect(beforeRestock.some(i => i.inventory < 10)).toBeTrue();
      
      // Now restock
      service.restockInventory();
      
      // All ingredients should be back to 10
      const afterRestock = service.getIngredients();
      expect(afterRestock.every(i => i.inventory === 10)).toBeTrue();
    });
  });
});