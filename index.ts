import express, { Express, Request, Response } from 'express';

import "reflect-metadata"; // Required for typeORM, import globally

import { indexRouter } from './routes/indexRoute'
import { AppDataSource } from './data_source';
import { TagRouter } from './routes/tagRoute';
import { testRouter } from './routes/testRoute';

const PORT: number = 8080;
const app: Express = express();

// Set view engine to ejs
app.set('view engine', 'ejs');

// Start db connection
AppDataSource.initialize().catch(console.error);

// Handle GET request directly
// app.get("/", (req: Request, res: Response) => {
//     res.send("Hello world <(\") hehehe");
// })

// Handle (GET, ...) request from router in controller
app.use("/", express.static("public"));
app.use("/", indexRouter);
// app.use("/tag", TagRouter);


app.use("/test", testRouter);
app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
})
