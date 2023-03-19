import express, { Express, Request, Response } from 'express';

import { indexRouter } from './controllers/indexController'

const PORT: number = 8080;
const app: Express = express();

// Set view engine to ejs
app.set('view engine', 'ejs');

// Handle GET request directly
// app.get("/", (req: Request, res: Response) => {
//     res.send("Hello world <(\") hehehe");
// })

// Handle (GET, ...) request from router in controller
app.use("/", indexRouter);


app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
})
