# TodoMVC Test Plan
This document details the planned tests and testing structure. The document will be updated regularly to show current progress/remaining tests.

### Sanity checks
[x] **S1:** Renders home page in empty state

[ ] **S2:** List data persists on refresh

### Adding todos
[x] **A1:** Add todo from empty state

[x] **A2:** Add todo from populated-varied state (toggle-all remains unchecked)

[x] **A3:** Add todo from populated-completed state (toggle-all becomes unchecked)

[x] **A4:** Allow duplicate todos

[x] **A5:** Do not add empty/whitespace todo

[x] **A6:** Trim surrounding whitespace from added todo

### Deleting todos
[x] **D1:** Delete only todo, returns to empty state

[x] **D2:** Delete only completed todo from populated-varied state

[x] **D3:** Delete one of many active todos

[x] **D4:** Delete single chosen instance of duplicate todo

[ ] **D5:** Delete only todo from filtered view

### Modifying todos
[x] **M1:** Edit chosen todo does not change completed status or other todos

[x] **M2:** Mark only todo as complete

[ ] **M3:** Mark only todo as incomplete

[ ] **M4:** Mark only incomplete todo as complete from populated-varied state

[ ] **M5:** Mark only complete todo as incomplete from populated-varied state

[x] **M6:** Trim surrounding whitespace from edited todo


## Bulk actions
[ ] **B1:** Toggle all complete from populated-incomplete state

[ ] **B2:** Toggle all complete from populated-varied state

[ ] **B3:** Toggle all incomplete from populated-complete state

[ ] **B4:** Clear completed from populated-varied state

[ ] **B5:** Clear completed from populated-complete state


## Filtering
[x] **F1:** Show incomplete/active only

[x] **F2:** Show completed only

[x] **F3:** Reset filter to show all from filtered view