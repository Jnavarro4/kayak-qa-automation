import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;


  // Search fields
  readonly fromField: Locator;
  readonly toField: Locator;
  readonly searchButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.fromField = page.getByRole('combobox', { name: 'Origin location' });
    this.toField = page.getByRole('combobox', { name: 'Destination location' });
    this.searchButton = page.getByRole('button', { name: 'Search' });
  }

  async goto() {
    await this.page.goto('https://www.kayak.com/?lang=en');
  }

  async setOrigin(city: string) {
    const clearButton = this.page.getByRole('button', { name: 'Remove value' });
    
    if (await clearButton.isVisible()) {
      await clearButton.click();
    }
    
    await this.fromField.click();
    await this.fromField.fill(city);
    await this.page.getByRole('option').first().click();
  }
  
  async setDestination(city: string) {
    await this.toField.click();
    await this.toField.fill(city);
    await this.page.getByRole('option').first().click();
  }

  async setDepartureDate(daysFromToday: number) {
    await this.page.getByRole('button', { name: 'Departure date' }).click();
    
    const date = new Date();
    date.setDate(date.getDate() + daysFromToday);
    
    const monthName = date.toLocaleString('en-US', { month: 'long' });
    const day = date.getDate();
    
    await this.page.getByRole('button', { name: `${monthName} ${day},` }).click();
  }
  
  async setReturnDate(daysFromToday: number) {
    const date = new Date();
    date.setDate(date.getDate() + daysFromToday);
    
    const monthName = date.toLocaleString('en-US', { month: 'long' });
    const day = date.getDate();
    
    await this.page.getByRole('button', { name: `${monthName} ${day},` }).click();
  }

  async search() {
    await this.searchButton.click();
  }

  async searchAndGetPage(): Promise<Page> {
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page', { timeout: 10000 }).catch(() => null),
      this.search()
    ]);
  
    if (newPage) {
      await (newPage as Page).waitForLoadState('domcontentloaded');
      return newPage as Page;
    }
  
    await this.page.waitForLoadState('domcontentloaded');
    return this.page;
  }
}