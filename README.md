# Kayak QA Automation

End-to-end test automation project for Kayak's flight search functionality, built with Playwright and TypeScript.

---

## Project Structure

```
kayak-qa-automation/
├── pages/
│   ├── HomePage.ts        # Page Object for Kayak's home/search page
│   └── ResultsPage.ts     # Page Object for the flight results page
├── tests/
│   └── flight-search.spec.ts  # Test specs
├── playwright.config.ts
├── package.json
└── README.md
```

---

## Setup

### Prerequisites
- Node.js v18 or higher
- Google Chrome installed

### Installation

```bash
npm install
```

### Install Playwright browsers

```bash
npx playwright install
```

---

## Running the Tests

```bash
npm test
```

This will run all 3 tests using Chrome in headed mode (browser will open visibly).

---

## Test Suite

| Test | Description |
|------|-------------|
| `should search for the cheapest round-trip flight from Medellin to Miami` | Searches MDE → MIA, sorts by cheapest, extracts and logs price and airline |
| `should filter results by nonstop only and update results count` | Applies Nonstop filter and verifies results count decreases |
| `should show no results when filtering direct flights on a route with no nonstop options` | Searches a route with no direct flights, applies direct-only filter, verifies empty state message |

---

## Design Pattern

This project uses the **Page Object Model (POM)** pattern. Each page is represented as a class that encapsulates its locators and interactions. Tests use these classes instead of interacting with the DOM directly, making the suite easier to maintain and read.

---

## Notes

Kayak has a highly dynamic UI — locators and component structure may change between sessions. The tests implement defensive strategies such as `try/catch` blocks for optional UI elements and explicit waits to handle this variability.

---

## Reflection

### 1. What was the most challenging part of automating the Kayak search?

The most challenging part was dealing with Kayak's highly dynamic UI. Locators that worked in one session broke in the next because Kayak frequently changes its component structure — for example, the sort button alternated between a standalone "Cheapest" button and a dropdown menu, and the filter sections appeared either expanded or collapsed depending on the session. Another major challenge was that after clicking Search, results sometimes loaded in the same tab and sometimes opened in a new tab unpredictably. This required implementing a mechanism that detects whether a new tab was opened and handles both cases gracefully. To deal with these challenges I used try/catch blocks for optional UI elements and dynamic waiting strategies instead of fixed timeouts.

### 2. If you noticed a test passing sometimes and failing other times (a "flaky" test), what would you check first?

The first thing I would check is whether the test has proper wait strategies — flaky tests are often caused by race conditions where the test tries to interact with elements before they are fully loaded. In Kayak specifically, I encountered two main causes: first, progressive loading of results meant that prices or counters read too early returned incorrect values; second, the unpredictable behavior of opening results in a new tab versus the same tab caused tests to lose the page reference entirely. I addressed both by adding explicit waits for specific elements to be visible before interacting with them, and by implementing a mechanism that detects and handles both tab scenarios.

### 3. Why do you think manual test cases are still important even when we have automated tests?

Manual test cases are still essential because automated tests can only verify what they were explicitly programmed to check. A human tester can notice unexpected behavior, visual inconsistencies, or usability issues that no script would catch. Additionally, some scenarios are difficult to automate reliably — for example, edge cases where the system has multiple valid responses make assertions hard to define. Manual test cases also serve as living documentation that any team member can execute without technical knowledge, making them valuable for exploratory testing, regression checks on new features, and validating behavior that changes too frequently to maintain automated scripts for. Finally, manually exploring the application first is crucial before automating — it helps you understand what to expect from the page, what results you will get, and what the normal behavior looks like, which directly informs how you write your assertions and structure your automated tests.
