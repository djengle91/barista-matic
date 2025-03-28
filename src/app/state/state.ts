import { Injectable, computed, signal } from '@angular/core';
import { Drink, Ingredient } from './models';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private readonly ingredients = signal<Ingredient[]>([
    { id: 'e44c559f', name: 'Coffee', cost: 0.75, inventory: 10 },
    { id: '08209490', name: 'Decaf Coffee', cost: 0.75, inventory: 10 },
    { id: 'dd325a56', name: 'Sugar', cost: 0.25, inventory: 10 },
    { id: '32c52bf9', name: 'Cream', cost: 0.25, inventory: 10 },
    { id: '403b3098', name: 'Steamed Milk', cost: 0.35, inventory: 10 },
    { id: 'cc5be15f', name: 'Foamed Milk', cost: 0.35, inventory: 10 },
    { id: '426c8315', name: 'Espresso', cost: 1.1, inventory: 10 },
    { id: '5c826d0d', name: 'Cocoa', cost: 0.9, inventory: 10 },
    { id: '1428bc90', name: 'Whipped Cream', cost: 1.0, inventory: 10 },
  ]);

  private readonly drinks = signal<Drink[]>([
    {
      id: '03ceb55d',
      name: 'Coffee',
      recipe: [
        { ingredientId: 'e44c559f', amount: 3 },
        { ingredientId: 'dd325a56', amount: 1 },
        { ingredientId: '32c52bf9', amount: 1 },
      ],
    },
    {
      id: 'c62081e7',
      name: 'Decaf Coffee',
      recipe: [
        { ingredientId: '08209490', amount: 3 },
        { ingredientId: 'dd325a56', amount: 1 },
        { ingredientId: '32c52bf9', amount: 1 },
      ],
    },
    {
      id: 'd6366ad9',
      name: 'Caffe Latte',
      recipe: [
        { ingredientId: '426c8315', amount: 2 },
        { ingredientId: '403b3098', amount: 1 },
      ],
    },
    {
      id: 'a8546312',
      name: 'Caffe Americano',
      recipe: [{ ingredientId: '426c8315', amount: 3 }],
    },
    {
      id: '3d772282',
      name: 'Caffe Mocha',
      recipe: [
        { ingredientId: '426c8315', amount: 1 },
        { ingredientId: '5c826d0d', amount: 1 },
        { ingredientId: '403b3098', amount: 1 },
        { ingredientId: '1428bc90', amount: 1 },
      ],
    },
    {
      id: '45b0aaab',
      name: 'Capuccino',
      recipe: [
        { ingredientId: '426c8315', amount: 2 },
        { ingredientId: '403b3098', amount: 1 },
        { ingredientId: 'cc5be15f', amount: 1 },
      ],
    },
  ]);

  private readonly dispensing = signal<string>('');

  readonly getIngredients = computed(() => this.ingredients());
  readonly getDrinks = computed(() => this.drinks());
  readonly getDispensing = computed(() => this.dispensing());

  readonly getDrinksWithPrices = computed(() => {
    return this.drinks().map((drink) => ({
      ...drink,
      price: drink.recipe.reduce((total, recipeItem) => {
        const ingredient = this.ingredients().find(
          (i) => i.id === recipeItem.ingredientId
        );
        return total + (ingredient ? ingredient.cost * recipeItem.amount : 0);
      }, 0),
    }));
  });

  isDrinkAvailable(drinkId: string) {
    const drink = this.drinks().find((d) => d.id === drinkId);
    if (!drink) return false;

    return drink.recipe.every((recipeItem) => {
      const ingredient = this.ingredients().find(
        (i) => i.id === recipeItem.ingredientId
      );
      return ingredient && ingredient.inventory >= recipeItem.amount;
    });
  }

  dispenseDrink(drinkId: string) {
    const drink = this.drinks().find((d) => d.id === drinkId);
    if (!drink) return;

    this.dispensing.set(drink.name);

    this.ingredients.update((currentIngredients) => {
      return currentIngredients.map((ingredient) => {
        const recipeItem = drink.recipe.find(
          (item) => item.ingredientId === ingredient.id
        );
        if (recipeItem) {
          return {
            ...ingredient,
            inventory: ingredient.inventory - recipeItem.amount,
          };
        }
        return ingredient;
      });
    });

    setTimeout(() => {
      this.dispensing.set('');
    }, 3000);
  }

  restockInventory() {
    this.ingredients.update((currentIngredients) =>
      currentIngredients.map((ingredient) => ({ ...ingredient, inventory: 10 }))
    );
  }
}
