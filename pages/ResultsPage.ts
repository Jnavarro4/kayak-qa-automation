import { Page, Locator } from '@playwright/test';

export class ResultsPage {
  readonly page: Page;
  readonly cheapestButton: Locator;

  constructor(page: Page) {
    
    this.page = page;

    this.cheapestButton = page.getByRole('button', { name: 'Cheapest' });
}

// Methods

async sortByCheapest() {
  try {
    await this.cheapestButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.cheapestButton.click();
  } catch {
    try {
      const cheapestDiv = this.page.locator('div').filter({ hasText: /^Cheapest$/ }).first();
      await cheapestDiv.waitFor({ state: 'visible', timeout: 5000 });
      await cheapestDiv.click();
    } catch {
      console.log('Cheapest button not found, using default sort order');
    }
  }
  await this.page.waitForTimeout(5000);
}

  async getFirstResult(): Promise<{ price: string; airline: string }> {
    const firstOrganic = this.page.getByLabel('Result item 2', { exact: true });

    const price = await firstOrganic.getByRole('link', { name: '$' }).first().innerText();

    const airline = await firstOrganic.locator('div[class*="c_cgF"]').first().innerText();

    return { price, airline };
  }

  async getResultsCount(waitForUpdate: boolean = false): Promise<number> {
    if (waitForUpdate) {
      await this.page.waitForTimeout(3000);
    }
    const counterLocator = this.page
      .locator('div')
      .filter({ hasText: /^(\d+ results|\d+ of \d+ flights)$/ })
      .first();
    await counterLocator.waitFor({ state: 'visible', timeout: 30000 });
    const text = await counterLocator.innerText();
    const match = text.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }
  
  async applyDirectFlightsOnlyFilter() {
    
    try {
      const stopsSection = this.page.getByRole('button', { name: 'Stops' });
      await stopsSection.waitFor({ state: 'visible', timeout: 5000 });
      await stopsSection.click();
    } catch {
      // Stops section already expanded
    }
  
    const oneStop = this.page.getByRole('checkbox', { name: '1 stop' });
    const twoStops = this.page.getByRole('checkbox', { name: '+ stops' });
  
    await oneStop.waitFor({ state: 'visible', timeout: 30000 });
  
    await oneStop.click();
    await this.page.waitForTimeout(1000);
    await twoStops.click();
  
    try {
      const showResultsButton = this.page.getByRole('button', { name: /Show \d+ results/ });
      await showResultsButton.waitFor({ state: 'visible', timeout: 5000 });
      await showResultsButton.click();
    } catch {
      // Filter applied automatically
    }
  
    await this.page.waitForTimeout(3000);
  }
  
  async getNoResultsMessage(): Promise<string> {
    const message = this.page.getByText('No matching results found.');
    await message.waitFor({ state: 'visible', timeout: 30000 });
    return await message.innerText();
  }
}


