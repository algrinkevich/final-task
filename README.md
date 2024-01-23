# Uniprot Search
Uniprot Search is a search system through proteins using UniProt API. This is a lite and redesigned website of https://www.uniprot.org/.

## Features
- Authentication;
<img src="https://github.com/algrinkevich/uniprot-search/assets/8752900/f088547f-7068-4938-9edd-f9821c50fce5" width="300">
<img src="https://github.com/algrinkevich/uniprot-search/assets/8752900/95401021-d007-456a-aeee-3acc1737e870" width="300">

- Faceted protein search;
<img src="https://github.com/algrinkevich/uniprot-search/assets/8752900/75431e83-2754-470e-84d5-acd59ae652ca" width="400">

- Search results sorting;
<img src="https://github.com/algrinkevich/uniprot-search/assets/8752900/f0c8e540-4347-447c-858f-cec9774e7cf5" width="700">

- Results are in a tabular view;
<img src="https://github.com/algrinkevich/uniprot-search/assets/8752900/e656ae41-2a15-495c-a747-d71ac35e1d0a" width="700">

- Detailed gene view on click (via [`protvista-uniprot`](https://www.npmjs.com/package/protvista-uniprot) package)
<img src="https://github.com/algrinkevich/uniprot-search/assets/8752900/e8ea6fd9-c3a8-4cb4-ad29-4e1cfd2b43db" width="700">

- Infinite scroll;

## Technologies
- SCSS;
- Ant Design;
- React, Redux-Toolkit, Redux-Thunk;
- Formik for validation;
- Search results virtualization (`virtualizedtableforantd4`) for table;

## How to start project
1. Install dependencies.\
Run `npm i` or `npm install` from the root directory.
2. Start the project.\
Run `npm run dev`.
