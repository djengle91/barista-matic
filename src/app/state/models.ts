/**
 * Represents a base ingredient.
 * 
 * @interface Ingredient
 * @property {string} id - A unique identifier for the ingredient.
 * @property {string} name - The name of the ingredient.
 * @property {number} unitCost - The cost per unit of the ingredient.
 * @property {number} inventory - The current inventory count of the ingredient.
 */
export interface Ingredient {
    id: string;
    name: string;
    unitCost: number;
    inventory: number;
}

/**
 * Represents an ingredient used in a recipe.
 * 
 * @property ingredientId - The unique identifier of the ingredient.
 * @property amount - The quantity of the ingredient required for the recipe.
 */
export interface RecipeIngredient {
    ingredientId: string;
    amount: number;
}

/**
 * Represents a drink in the application.
 * 
 * @interface Drink
 * @property {string} id - The unique identifier for the drink.
 * @property {string} name - The name of the drink.
 * @property {RecipeIngredient[]} recipe - The list of ingredients required to make the drink.
 * @property {number} price - The price of the drink.
 */
export interface Drink {
    id: string;
    name: string;
    recipe: RecipeIngredient[];
    price: number;
}