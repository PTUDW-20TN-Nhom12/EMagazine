import express, { Express } from 'express';
import moment from 'moment-timezone';
import "reflect-metadata"; // Required for typeORM, import globally

import { indexRouter } from './routes/index-route'
import { signinRouter } from './routes/signin-route'
import { signupRouter } from './routes/signup-route'
import { oauthRouter } from './routes/oauth-route'
import { writerRouter } from './routes/writer-route';
import { adminRouter } from './routes/admin-route';
import { CommentRouter as commentRouter } from './routes/comment-route';

import { AppDataSource, SupabaseDataSource } from './models/data_source';
// @ts-ignore
import cookieParser from "cookie-parser";
// import bodyParser from "body-parser";
import { PaymentRouter as paymentRouter } from './routes/payment-route';
import { tagApiRouter } from './routes/tag-api-route';
import { editorRoute } from './routes/editor-route';

const PORT: number = parseInt(process.env.PORT) || 80;
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
app.use(express.json())

app.use("/", indexRouter);
app.use("/signin", signinRouter);
app.use("/signup", signupRouter);
app.use("/comment", commentRouter);
app.use("/oauth", oauthRouter);
app.use("/writer", writerRouter);
app.use("/payment", paymentRouter);
app.use("/admin", adminRouter);


app.use("/api/tag", tagApiRouter);

app.use("/editor", editorRoute);

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
})