# Test Cases — Kayak Flight Search

## Overview

These test cases cover the round-trip flight search functionality on Kayak, including filter interactions. They are written for a QA team member with no prior experience using the Kayak platform.

---

## TC-001 — Happy Path

**Title:** Round-trip flight search sorted by cheapest price returns valid results

**Preconditions:**
- User is on `https://www.kayak.com/?lang=en` (English interface)
- No active user session is required
- Internet connection is active
- Flights are available on the Medellín (MDE) → Miami (MIA) route for the selected dates

**Steps:**

1. Navigate to `https://www.kayak.com/?lang=en`
2. Confirm the search type selector at the top is set to **"Round-trip"**. If not, click it and select **"Round-trip"**.
3. Click the **"From"** field, type `Medellin`, and select the first suggestion from the dropdown.
4. Click the **"To"** field, type `Miami`, and select the first suggestion from the dropdown.
5. Click the **departure date** field and select a date **20 days from today**.
6. Click the **return date** field and select a date **27 days from today**.
7. Leave the passengers field at its default value (1 adult).
8. Click the **"Search"** button.
9. Wait for the results page to fully load (flight cards must be visible).
10. Locate the **"Cheapest"** button at the top of the results list.
11. Click the **"Cheapest"** button.
12. Wait for the results list to refresh.

**Expected Result:**
The results list is sorted by ascending price. The first result displays the lowest price among all visible results. The **"Cheapest"** button is visually indicated as active. The price and airline name of the first result are visible and non-empty. The price contains a currency symbol (e.g. $).

---

## TC-002 — Happy Path with Filter

**Title:** Should filter results by nonstop only and update results count

**Preconditions:**
- User is on `https://www.kayak.com/?lang=en` (English interface)
- No active user session is required
- Internet connection is active
- Flights are available on the Medellín (MDE) → Miami (MIA) route for the selected dates
- At least one result is visible before the filter is applied

**Steps:**

1. Navigate to `https://www.kayak.com/?lang=en`
2. Confirm the search type selector is set to **"Round-trip"**. If not, click it and select **"Round-trip"**.
3. Click the **"From"** field, type `Medellin`, and select the first suggestion from the dropdown.
4. Click the **"To"** field, type `Miami`, and select the first suggestion from the dropdown.
5. Click the **departure date** field and select a date **20 days from today**.
6. Click the **return date** field and select a date **27 days from today**.
7. Leave the passengers field at its default value (1 adult).
8. Click the **"Search"** button.
9. Wait for the results page to fully load (flight cards must be visible).
10. Note the total number of results displayed.
11. Locate the **"Stops"** filter section in the left sidebar.
12. Hover over the **"Nonstop"** option until the **"only"** button appears.
13. Click the **"only"** button next to **"Nonstop"**.
14. If a **"Show X results"** button appears, click it to apply the filter.
15. Wait for the results list to refresh.

**Expected Result:**
The total number of results decreases after applying the filter. All displayed flight results show **0 stops**. The results count is greater than zero. The filter is visually indicated as active.

---

## TC-003 — Negative Case

**Title:** Should show no results when filtering direct flights on a route with no nonstop options

**Preconditions:**
- User is on `https://www.kayak.com/?lang=en` (English interface)
- No active user session is required
- Internet connection is active
- The selected route (Quibdó → Santa Marta) has no direct flights available
- At least one result with stops is visible before the filter is applied

**Steps:**

1. Navigate to `https://www.kayak.com/?lang=en`
2. Confirm the search type selector is set to **"Round-trip"**. If not, click it and select **"Round-trip"**.
3. Click the **"From"** field, type `Quibdo`, and select the first suggestion from the dropdown.
4. Click the **"To"** field, type `Santa Marta`, and select the first suggestion from the dropdown.
5. Click the **departure date** field and select a date **20 days from today**.
6. Click the **return date** field and select a date **27 days from today**.
7. Leave the passengers field at its default value (1 adult).
8. Click the **"Search"** button.
9. Wait for the results page to fully load (flight cards with stops must be visible).
10. Locate the **"Stops"** filter section in the left sidebar.
11. Uncheck the **"1 stop"** checkbox.
12. Uncheck the **"2+ stops"** checkbox.
13. Leave only **"Nonstop"** (direct) checked.
14. If a **"Show X results"** button appears, click it to apply the filter.
15. Wait for the results list to refresh.
16. Observe the state of the results area.

**Expected Result:**
The results area displays a clear empty state message: **"No matching results found."** The page must not crash, freeze, or display a blank layout. A visible option to reset or modify the active filters must remain accessible to the user.
