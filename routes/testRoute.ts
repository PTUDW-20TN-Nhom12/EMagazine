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

interface Tag {
    tag_name: string,
    tag_id: number
}

interface Article2 {
    category_name: string,
    category_id: number
    title: string,
    imgLink: string,
    date: string,
    article_id: number
    short_desc: string,
    isPremium: boolean,
    tags: Tag[]
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

const ARTICLE2: Article2 = {
    "category_name": "Kinh Doanh",
    "category_id": 1,
    "title": "Sợ nguy cơ tăng giá hàng hóa, 14 hiệp hội doanh nghiệp lên tiếng về dự thảo định mức chi phí tái chế",
    "imgLink": "https://cdn.tuoitre.vn/zoom/260_163/471584752817336320/2023/5/19/nhua-tai-che-16844861671842029414616.png",
    "date": "01/01/2023",
    "article_id": 1,
    short_desc: "Các hiệp hội doanh nghiệp cho rằng định mức chi phí tái chế (Fs) rất cao, chưa hợp lý và còn tính cả chi phí quản lý hành chính trong định mức Fs, gây khó khăn cho doanh nghiệp",
    tags: [
        {tag_name: "A", tag_id: 0}
    ],
    isPremium: true
}

const SAMPLE_ARTICLES_2: Article2[] = [
    ARTICLE2, ARTICLE2, ARTICLE2, ARTICLE2, ARTICLE2, ARTICLE2, 
    ARTICLE2, ARTICLE2, ARTICLE2, ARTICLE2, ARTICLE2, ARTICLE2, 
    ARTICLE2, ARTICLE2, ARTICLE2, ARTICLE2, ARTICLE2, ARTICLE2, 
    ARTICLE2, ARTICLE2, ARTICLE2, ARTICLE2, ARTICLE2, ARTICLE2, 
    ARTICLE2, ARTICLE2, ARTICLE2, ARTICLE2, ARTICLE2, ARTICLE2, 
    ARTICLE2, ARTICLE2, ARTICLE2, ARTICLE2, ARTICLE2, ARTICLE2, 
    ARTICLE2, ARTICLE2, ARTICLE2, ARTICLE2, ARTICLE2, ARTICLE2, 
    ARTICLE2, ARTICLE2, ARTICLE2, ARTICLE2, ARTICLE2, ARTICLE2, 
    ARTICLE2, ARTICLE2, ARTICLE2, ARTICLE2, ARTICLE2, ARTICLE2, 
    ARTICLE2, ARTICLE2, ARTICLE2, ARTICLE2, ARTICLE2, ARTICLE2, 
    ARTICLE2, ARTICLE2, ARTICLE2, ARTICLE2, ARTICLE2, ARTICLE2, 
]

const ART_PER_PAGE = 6;

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
    const page = parseInt(req.params.page);

    // category_id -> category name
    let category_name = "King doanh";

    // TODO: Handle non exist pages

    res.render("category_detail", {
        title: category_name,
        page_name: category_name,
        items: SAMPLE_ARTICLES_2.slice(page * ART_PER_PAGE, (page + 1) * ART_PER_PAGE), // safely handle overflow
        current_page: page,
        max_page: Math.ceil(SAMPLE_ARTICLES_2.length / ART_PER_PAGE),

        header: headerGenerator(false, true, true, 0),
        footer: footerGenerator(),
    })

    // res.status(200).json({
    //     category_id,
    //     page
    // })
})

// Tag page
r.get("/tag/:id/:page", (req, res) => {
    const tag_id = req.params.id;
    const page = parseInt(req.params.page);

    // TODO: handle non exist page
    // tag_id -> tag_name
    let tag_name = "#A";

    res.render("category_detail", {
        title: tag_name,
        page_name: tag_name,
        items: SAMPLE_ARTICLES_2.slice(page * ART_PER_PAGE, (page + 1) * ART_PER_PAGE), // safely handle overflow
        current_page: page,
        max_page: Math.ceil(SAMPLE_ARTICLES_2.length / ART_PER_PAGE),

        header: headerGenerator(false, true, true, 0),
        footer: footerGenerator(),
    })

    // res.status(200).json({
    //     tag_id,
    //     page
    // })
})

// Search page
r.get("/search/:query/:page", (req, res) => {
    const search_query = req.params.query;
    const page = parseInt(req.params.page);

    res.render("category_detail", {
        title: search_query,
        page_name: search_query,
        items: SAMPLE_ARTICLES_2.slice(page * ART_PER_PAGE, (page + 1) * ART_PER_PAGE), // safely handle overflow
        current_page: page,
        max_page: Math.ceil(SAMPLE_ARTICLES_2.length / ART_PER_PAGE),

        header: headerGenerator(false, true, true, 0),
        footer: footerGenerator(),
    })

    // res.status(200).json({
    //     search_query,
    //     page
    // })
})

export {
    r as testRouter
}