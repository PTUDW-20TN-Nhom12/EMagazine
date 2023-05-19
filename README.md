# An Electric Magazine project for Web Development course

## Get started
- Clone this repo (through GUI, API key,... )
- `cd` into `EMagazine`
- Install `pnpm` globally with script: https://pnpm.io/installation 
- ~~`npm i`~~ `pnpm i` to install dependencies for the first time
- ~~`npm run dev`~~ `pnpm run dev` to start the server (auto restart on files change)

> **Caution**: `dist` folder is auto-generated. Do not touch <("). `.gitkeep` is for keeping folder in git, just ignore it :)

## Project structure
- `views` contains view (template) to render & make a page (page, header, footer, carditem, listitem, navbar, ...)
- `models` contains "Schema" related to "Real-world object", will be mapped to table in Database
- `controllers` contains controller, which handle web's route (`/`, `/login`, `/admin`, `/search`, ...)

## Documentations
- https://blog.logrocket.com/building-structuring-node-js-mvc-application/