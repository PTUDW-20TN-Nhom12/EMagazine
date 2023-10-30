# An Electric Magazine project for Web Development course
## Demo
https://emagazine-ptudw-20tn-nhom12.onrender.com/

## Tech Stack:
- Frontend: Bootstrap, Jquery
- Backend:
    - TypeScript Nodejs
    - TypeORM (Postgres)
    - Supabase (Oauth, Posgres Database)
    - Momo Payment API

## Get started
- Clone this repo (through GUI, API key,... )
- `cd` into `EMagazine`
- Install `pnpm` globally with script: https://pnpm.io/installation 
- `pnpm i` to install dependencies for the first time
- `pnpm run dev` to start the server (auto restart on files change)

## Project structure
- `views` contains view (template) to render & make a page (page, header, footer, carditem, listitem, navbar, ...)
- `models` contains "Schema" related to "Real-world object", will be mapped to table in Database
- `controllers` contains controller, which handle request to changes related to model in database
- `utils` contains helper for generation of header, footer, captcha and Momo payment service.

## Documentations
- https://blog.logrocket.com/building-structuring-node-js-mvc-application/