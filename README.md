# TodoMVC-E2E-Playwright-Test-Suite
This repository contains a simple, beginner-level end-to-end test suite written with **Playwright** for the classic [TodoMVC application](http://todomvc.com/).

## Motivation
This is a personal practice project for learning Playwright. The main goals are to:

* Get comfortable with Playwright's core commands (selectors, actions, assertions).
* Structure the tests using the Page Object Model (POM) for clean code.
* Build a complete, reliable end-to-end test suite for TodoMVC from scratch. 

## Getting Started
To run these tests locally, you will need [Node.js](https://nodejs.org/) installed on your device.

#### Clone the repository
```
git clone https://github.com/KA-C42/TodoMVC-E2E-Playwright-Test-Suite.git
cd TodoMVC-E2E-Playwright-Test-Suite
```

#### Install dependencies
```
npm install
npx playwright install
```
The second command is necessary to install Playwright's browsers

#### Execute tests
```
npx playwright test
```
