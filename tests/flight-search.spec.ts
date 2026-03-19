import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ResultsPage } from '../pages/ResultsPage';

test('Round-trip flight search sorted by cheapest price returns valid results', async ({ page }) => {

  const homePage = new HomePage(page);

  await homePage.goto();
  await homePage.setOrigin('medellin');
  await homePage.setDestination('miami');
  await homePage.setDepartureDate(20);
  await homePage.setReturnDate(27);

  const resultPage = await homePage.searchAndGetPage();
  const resultsPage = new ResultsPage(resultPage);

  await resultsPage.sortByCheapest();

  const { price, airline } = await resultsPage.getFirstResult();

  console.log(`Cheapest flight: ${airline} - ${price}`);

  expect(price).toMatch(/\$/);
  expect(airline.length).toBeGreaterThan(0);
});

test('should filter results by nonstop only and update results count', async ({ page }) => {
  const homePage = new HomePage(page);

  await homePage.goto();
  await homePage.setOrigin('medellin');
  await homePage.setDestination('miami');
  await homePage.setDepartureDate(20);
  await homePage.setReturnDate(27);

  const resultPage = await homePage.searchAndGetPage();
  const resultsPage = new ResultsPage(resultPage);

  await resultPage.getByLabel(/Result item/).first().waitFor({ state: 'visible', timeout: 30000 });

  const resultsBefore = await resultsPage.getResultsCount();

  try {
    await resultPage.getByRole('button', { name: 'Stops' }).waitFor({ state: 'visible', timeout: 5000 });
    await resultPage.getByRole('button', { name: 'Stops' }).click();
  } catch {

    // Stops section expanded
    
  }

  await resultPage.getByRole('checkbox', { name: 'Nonstop' }).scrollIntoViewIfNeeded();
  await resultPage.getByRole('checkbox', { name: 'Nonstop' }).hover();
  await resultPage.getByRole('button', { name: 'Only show results for Nonstop' }).click();

  try {
    const showResultsButton = resultPage.getByRole('button', { name: /Show \d+ results/ });
    await showResultsButton.waitFor({ state: 'visible', timeout: 5000 });
    await showResultsButton.click();
  } catch {

    // Filter applied

  }

  await resultPage.waitForTimeout(3000);

  const resultsAfter = await resultsPage.getResultsCount(true);

  expect(resultsAfter).toBeLessThan(resultsBefore);
  expect(resultsAfter).toBeGreaterThan(0);

  console.log(`Results before nonstop filter: ${resultsBefore}`);
  console.log(`Results after nonstop filter: ${resultsAfter}`);
});

test('should show no results when filtering direct flights on a route with no nonstop options', async ({ page }) => {
  const homePage = new HomePage(page);

  await homePage.goto();
  await homePage.setOrigin('Quibdo');
  await homePage.setDestination('Santa Marta');
  await homePage.setDepartureDate(20);
  await homePage.setReturnDate(27);

  const resultPage = await homePage.searchAndGetPage();
  const resultsPage = new ResultsPage(resultPage);

  await resultsPage.applyDirectFlightsOnlyFilter();

  const message = await resultsPage.getNoResultsMessage();
  console.log(`No results message displayed: "${message}"`);
  expect(message).toContain('No matching results found');
});