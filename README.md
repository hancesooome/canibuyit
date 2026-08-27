# Can I Buy It?

A responsive mortgage affordability calculator built with React and TypeScript. It gives homebuyers a quick indication of how a property price, deposit, and household income translate into a required mortgage, loan-to-value ratio, and income multiple.

> This project is a prototype for educational purposes. Its results are indicative only and are not financial advice or a mortgage offer.

## Features

- Validates property price, deposit, and annual household income
- Calculates mortgage required, deposit percentage, LTV, and income multiple
- Groups results into strong, good, borderline, or challenging bands
- Lets users adjust their figures and see results update immediately
- Compares adjusted figures with the original scenario
- Includes a prototype mortgage-expert enquiry flow
- Uses a responsive layout for mobile, tablet, and desktop
- Includes unit and invariant tests for the affordability calculations

## Tech stack

- React
- TypeScript
- Vite
- Tailwind CSS 4, plus project-specific CSS
- Lucide React icons
- Vitest

## Getting started

You need a current [Node.js](https://nodejs.org/) installation with npm.

```bash
git clone <repository-url>
cd canibuyit
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## Available scripts

```bash
npm run dev      # Start the development server
npm run build    # Type-check and create a production build in dist/
npm test         # Run the Vitest test suite once
```

To preview the production build locally:

```bash
npm run build
npx vite preview
```

## How it is implemented

### Page flow and state

`App.tsx` owns the current page and the shared affordability values. The app uses a small state-based flow rather than a routing library:

```text
Details -> Results -> Adjust
              |
              +----> Contact
```

The original submitted values are saved separately. This lets the adjustment page compare a new scenario with the initial result and restore that result when the user goes back.

### Updating form values

The three inputs on `DetailsPage.tsx` share one update function:

```tsx
function updateValue(field: keyof AffordabilityInput, newValue: number) {
  setValues((previousValues) => ({
    ...previousValues,
    [field]: newValue,
  }));
}
```

Each `MoneyInput` supplies a field name such as `propertyPrice` and its new numeric value. The functional state update copies the previous object and replaces only that field. `keyof AffordabilityInput` restricts the field argument to valid keys at compile time.

`MoneyInput` removes non-digit characters before reporting a number, while displaying the value with UK thousands separators. On submission, `DetailsPage` checks that:

- the property price is greater than zero;
- the deposit is not negative;
- the deposit is lower than the property price; and
- annual household income is greater than zero.

The app only advances to the results page when validation succeeds.

### Affordability calculation

The calculation logic lives in `src/calculator.ts`, separate from the UI so it can be reused and tested.

Given property price `P`, deposit `D`, and annual income `I`:

```text
mortgage required  = P - D
deposit percentage = D / P * 100
loan to value      = (P - D) / P * 100
income multiple    = (P - D) / I
```

The displayed affordability band is based on the income multiple:

| Income multiple | Band |
| --- | --- |
| Up to 4.0x | Strong |
| Over 4.0x to 4.5x | Good |
| Over 4.5x to 5.0x | Borderline |
| Over 5.0x | Challenging |

These thresholds are prototype assumptions, not lender criteria.

### Live adjustments

`AdjustPage.tsx` recalculates affordability on every render from the current values. Its sliders support both range controls and exact typed amounts. Their upper limits and step sizes scale for unusually large starting values, and the deposit is kept below the property price.

An adjustment is shown as an improvement only when the income multiple is lower after both values are rounded to the one decimal place shown in the UI. This prevents the interface from claiming an improvement the user cannot see.

### Testing

`src/calculator.test.ts` covers:

- a baseline affordability scenario;
- every band boundary;
- display-aware improvement detection;
- gauge score mapping; and
- calculation invariants over 10,000 valid scenarios.

## Project structure

```text
src/
|-- components/        Reusable inputs, sliders, metrics, gauge, and header
|-- pages/             Details, results, adjustment, and contact screens
|-- App.tsx            Shared state and page transitions
|-- calculator.ts      Calculation, scoring, and formatting functions
|-- calculator.test.ts Calculation tests
|-- constants.ts       Initial affordability values
|-- styles.css         Global and component styling
|-- types.ts           App-level TypeScript types
`-- main.tsx           React entry point
```

## Prototype limitations

- Values are held in memory and reset when the page reloads.
- The enquiry form simulates success locally; it does not send data to a server.
- There is no authentication, database, lender integration, or real mortgage eligibility check.
- The calculation does not consider interest rates, loan terms, expenses, credit history, taxes, or lender-specific rules.

## Possible next steps

- Connect the enquiry form to a secure backend
- Add browser-level tests for the complete user flow
- Make affordability assumptions configurable and cite their source
- Add loan term, interest rate, monthly payment, and expense inputs
- Persist scenarios locally or in a user account
