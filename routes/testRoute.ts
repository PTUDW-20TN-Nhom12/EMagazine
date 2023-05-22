import { Router } from "express";

const r = Router();
const PAGE_SIZE = 6;

// Index page
r.get("/", (req, res) => {

})

// Content page
r.get("/content/:id", (req, res) => {
    const article_id = req.params.id;
})

// Category page
r.get("/category/:id/:page", (req, res) => {
    const category_id = req.params.id;
    const page = req.params.page;
})

// Search page
r.get("/search/:query/:page", (req, res) => {
    const search_query = req.params.query;
    const page = req.params.page;
})

export {
    r as testRouter
}