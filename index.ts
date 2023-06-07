import express, { Express } from 'express';
import moment from 'moment-timezone';
import "reflect-metadata"; // Required for typeORM, import globally

import { indexRouter } from './routes/index-route'
import {signinRouter} from './routes/signin-route'
import {signupRouter} from './routes/signup-route'
import {oauthRouter} from './routes/oauth-route'
import { CommentRouter as commentRouter } from './routes/comment-route';

import { AppDataSource, SupabaseDataSource } from './models/data_source';
// @ts-ignore
import cookieParser from "cookie-parser";

const PORT: number = parseInt(process.env.PORT) || 8080;
const app: Express = express();

// Set view engine to ejs
app.set('view engine', 'ejs');
app.locals.moment = (value) => moment(value).utcOffset(+14);
// Start db connection
// AppDataSource.initialize().catch(console.error);
SupabaseDataSource.initialize().catch(console.error); 

// Handle (GET, ...) request from router in controller
app.use("/", express.static("public"));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/signin", signinRouter);
app.use("/signup", signupRouter);
app.use("/comment", commentRouter);
app.use("/oauth", oauthRouter);

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
})