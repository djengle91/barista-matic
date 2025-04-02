import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent], // Import the standalone component instead of declaring it
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should have Barista-matic title', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.app-title').textContent).toContain(
      'Barista-matic'
    );
  });

  it('should render inventory section', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.inventory-section')).toBeTruthy();
    expect(compiled.querySelector('.sidebar-title').textContent).toContain(
      'Inventory'
    );
  });

  it('should render menu section', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.main-header h2').textContent).toContain(
      'Menu'
    );
  });

  it('should render drink cards based on state service data', () => {
    const mockDrinks = component.getDrinksWithPrices();
    const compiled = fixture.nativeElement;
    const drinkCards = compiled.querySelectorAll('.drink-card');

    expect(drinkCards.length).toBe(mockDrinks.length);
  });

  it('should apply unavailable class to drinks that are not available', () => {
    // We need to spy on the isDrinkAvailable method
    spyOn(component, 'isDrinkAvailable').and.callFake((id: string) => {
      // Mock that the first drink is available and others are not
      return id === component.getDrinksWithPrices()[0].id;
    });

    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const drinkCards = compiled.querySelectorAll('.drink-card');

    expect(drinkCards[0].classList.contains('unavailable')).toBeFalsy();
    if (drinkCards.length > 1) {
      expect(drinkCards[1].classList.contains('unavailable')).toBeTruthy();
    }
  });

  it('should disable order button for unavailable drinks', () => {
    // We need to spy on the isDrinkAvailable method
    spyOn(component, 'isDrinkAvailable').and.callFake((id: string) => {
      // Mock that the first drink is available and others are not
      return id === component.getDrinksWithPrices()[0].id;
    });

    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const orderButtons = compiled.querySelectorAll('.order-button');

    expect(orderButtons[0].disabled).toBeFalse();
    if (orderButtons.length > 1) {
      expect(orderButtons[1].disabled).toBeTrue();
    }
  });

  it('should call dispenseDrink when order button is clicked', () => {
    spyOn(component, 'dispenseDrink');
    spyOn(component, 'isDrinkAvailable').and.returnValue(true);

    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const firstOrderButton = compiled.querySelector('.order-button');
    const firstDrinkId = component.getDrinksWithPrices()[0].id;

    firstOrderButton.click();

    expect(component.dispenseDrink).toHaveBeenCalledWith(firstDrinkId);
  });

  it('should show dispensing overlay when a drink is being dispensed', () => {
    spyOn(component, 'getDispensing').and.returnValue('Coffee');

    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const dispensingOverlay = compiled.querySelector('.dispensing-overlay');

    expect(dispensingOverlay).toBeTruthy();
    expect(
      compiled.querySelector('.dispensing-modal h3').textContent
    ).toContain('Preparing Coffee...');
  });

  it('should show progress indicators for inventory items', () => {
    const mockIngredients = component.getIngredients();
    const compiled = fixture.nativeElement;

    const progressBars = compiled.querySelectorAll('.progress-bar');
    expect(progressBars.length).toBe(mockIngredients.length);

    // Test that progress bars have correct classes
    mockIngredients.forEach((ingredient, index) => {
      const expectedClass =
        ingredient.inventory < 3
          ? 'low'
          : ingredient.inventory >= 7
          ? 'high'
          : 'medium';

      expect(progressBars[index].classList.contains(expectedClass)).toBeTrue();
    });
  });

  it('should call restockInventory when restock button is clicked', () => {
    spyOn(component, 'restockInventory');

    const compiled = fixture.nativeElement;
    const restockButton = compiled.querySelector('.restock-button');

    restockButton.click();

    expect(component.restockInventory).toHaveBeenCalled();
  });
});
