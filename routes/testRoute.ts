import { Router } from "express";
import { footerGenerator, headerGenerator } from "../misc/header-footerGenerator";

const r = Router();
const PAGE_SIZE = 6;

interface Article {
    category: string,
    title: string,
    imgLink: string,
    date: string,
    article_id: number
}

const ARTICLE: Article = {
    "category": "Kinh Doanh", // Cate
    "title": "Người giàu đổ về London thuê và mua nhà siêu sang", // Titl
    "imgLink": "https://cdn.tuoitre.vn/zoom/260_163/471584752817336320/2023/5/19/720-16844912094541376871969-0-0-450-720-crop-1684493415557775688484.jpg", // Thum
    "date": "01/01/2023",
    "article_id": 1,
}

const SAMPLE_ARTICLES: Article[] = [
    ARTICLE,ARTICLE,ARTICLE,ARTICLE,ARTICLE,
    ARTICLE,ARTICLE,ARTICLE,ARTICLE,ARTICLE,
]

// Index page
r.get("/", (req, res) => {
    res.render("index", {
        title: "Trang chu",
        header: headerGenerator(true, true, true, -1),
        footer: footerGenerator(),
        moi_nhat: SAMPLE_ARTICLES,
        nhieu_nhat: SAMPLE_ARTICLES,
        top_10: SAMPLE_ARTICLES,
        noi_bat: SAMPLE_ARTICLES,
    })
})

// Content page
r.get("/content/:id", (req, res) => {
    const article_id = req.params.id;
    res.status(200).json({
        article_id
    })
})

// Category page
r.get("/category/:id/:page", (req, res) => {
    const category_id = req.params.id;
    const page = req.params.page;
    res.status(200).json({
        category_id,
        page
    })
})

// Search page
r.get("/search/:query/:page", (req, res) => {
    const search_query = req.params.query;
    const page = req.params.page;

    res.status(200).json({
        search_query,
        page
    })
})

export {
    r as testRouter
}