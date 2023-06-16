<<<<<<< HEAD
# ref-buddy-web
=======
# Refbuddy.ca

Refbuddy.ca Admin Portal

## Get Started

Install packages with Yarn:
```bash
yarn install
```

Get the party started:
```bash
yarn develop
```

## Usage

We use TypeScript for this project, so whenever dealing with JSX elements ie anything to do with react add the extension `.tsx` and if its just a plain JavaScript file `.ts`

If you are familiar with PropTypes this will be fairly easy to understand
With TypeScript you use interfaces to build out your "PropTypes" and pass them into the component.

Here is an example of a component: 
```javascript
import React from 'react';

interface ExampleComponentProps {
  title: string,
  items: string[],
}

const ExampleComponentProps = ({title, items}: ExampleComponentProps) => (
  <div className="flex flex-col gap-4">
   <h1>{title}</h1>
   {items.map(item => <p>{item}</p>)}
  </div>
);
```

## Styling
We use **[Tailwind](https://tailwindcss.com/docs/utility-first)** for styling. We use the standard implementation and our config can be found at `./tailwind.config.js`


A good cheatsheet for Tailwind can be found [here](https://nerdcave.com/tailwind-cheat-sheet) for quick reference to utility classes. The official [Tailwind Docs](https://tailwindcss.com/docs/utility-first) also have a powerful search feature

We also recommend installing the VS Code extension [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) for autocomplete and syntax highlighting.

## Adding Pages

New pages should go under the pages folder. If it is a private route ie something inside portal add it as a subfolder route inside portal folder in pages. 

```javascript
import React from 'react';
import PortalHome from '../../PrivateRoutes/index';
import PrivateRoute from '../../components/PrivateRoute';

const Portal = () => (
  <PrivateRoute path="/portal/" component={PortalHome} />
);

export default Portal;
```

This creates a private route. Take a look at `PrivateRoute.tsx` to see how that is handled. You will need to create your own authentication layer to make sure a user cannot access this page.

Inside the `/PrivateRoutes` folder is where you should put your Private route page templates.

Any Other Questions Just ask Dawson, the prettiest engineer at Clever.

## Testing

The LO Portal uses **[Jest](https://jestjs.io/docs/getting-started)** as the base framework, configured to run using all files that match `**/*.test.ts?(x)`

Test files should be located in a `spec/` directory as a `.test.ts(x)` file, adjacent to the code it is testing:

```
src
├── utils
│   ├── spec
│   │   └── exampleUtil.test.ts
│   ├── exampleUtil.ts
│   └── index.ts
├── components
│   ├── spec
│   │   └── ExampleComponent.test.tsx
│   ├── ExampleComponent.tsx
│   └── index.ts
```

Both **[jest-dom](https://github.com/testing-library/jest-dom)** and **[React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)** are installed to extend Jest with utilites for testing React components and the DOM. It is recommended that you read up and become familiar with both of these libraries.

### Running tests locally

Locally, you can run tests once with:
```
yarn test
```

Or you can run the watch command to continuously run tests for all modified files (useful to leave running while developing):
```
yarn test:watch
```

### Testing in CI

Tests are run in CircleCI and must pass in order for the workflow to pass. Failing tests will show an error in any open PR, and can be reviewed in the [CircleCI dashboard](https://app.circleci.com/pipelines/github/clever-real-estate/clever-LO-portal)

Test coverage is posted in PRs to `master` and `production` using [jest-coverage-report](https://github.com/marketplace/actions/jest-coverage-report)

>**NOTE:** We are working towards a coverage threshold (ideally 100%) that will be enforced in the future.
>>>>>>> 845fbb4592525ff3b47214b0b932ecd922d54394
