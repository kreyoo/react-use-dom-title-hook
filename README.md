# react-use-dom-title

![Routine Checks](https://github.com/kreyoo/react-use-dom-title-hook/actions/workflows/test.yml/badge.svg)
![Codecov](https://img.shields.io/codecov/c/gh/kreyoo/react-use-dom-title-hook?style=plastic)
![npm](https://img.shields.io/npm/dm/react-use-dom-title-hook?style=plastic)

A react hook for handling DOM titles in nested components.

## Functionality

The hook adheres to the following rules:

- It reverts the title when the component unmounts, but only when `document.title` has the value used by the component
- The hook listens to the changes of its given value (internally this counts as a new mounted title)
- When multiple components with the same title get mounted in a row, the title only gets removed when all components have unmounted
- When three components get mounted with a title and the second in order unmounts, the title of the first component is secured and loaded when the third component unmounts. Of course this mechanism works with any count of titled components.

## Demo

Coming soon...

## Code example

```typescript
import useDOMTitle from "react-use-dom-title";

function MyLoadingComponent() {
	useDOMTitle("Loading...");

	return <Loader />;
}
```

## API Reference

### useDOMTitle

`useDOMTitle(title: string)`
