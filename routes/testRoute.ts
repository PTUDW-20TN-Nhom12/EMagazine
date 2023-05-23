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

    res.render("post", {
        header: headerGenerator(true, true, true, -1),
        footer: footerGenerator(),

        title: "Noi dung",

        category_name: "King doanh",
        imgLink: "https://cdn.tuoitre.vn/zoom/260_163/471584752817336320/2023/5/19/nhua-tai-che-16844861671842029414616.png",
        post_data: {
            post_title: "Sợ nguy cơ tăng giá hàng hóa, 14 hiệp hội doanh nghiệp lên tiếng về dự thảo định mức chi phí tái chế",
            date: "01/01/2023",
            tags: [
                {tag_name: "A", tag_id: 0}
            ],
            content: "<figure type=\"Photo\" style=\"\"><div><a href=\"https://cdn.tuoitre.vn/471584752817336320/2023/5/19/nhua-tai-che-16844861671842029414616.png\" data-fancybox=\"content\" data-caption=\"Công ty Plastic People (ở Việt Nam) đang phân loại rác nhựa để tái chế tại công ty - Ảnh: QUANG ĐỊNH\" rel=\"nofollow\" target=\"_blank\"><img data-author=\"\" src=\"https://cdn.tuoitre.vn/thumb_w/730/471584752817336320/2023/5/19/nhua-tai-che-16844861671842029414616.png\" id=\"img_583940104065617920\" w=\"1060\" h=\"705\" alt=\"Sợ nguy cơ tăng giá hàng hóa, 14 hiệp hội doanh nghiệp lên tiếng về dự thảo định mức chi phí tái chế - Ảnh 1.\" title=\"Sợ nguy cơ tăng giá hàng hóa, 14 hiệp hội doanh nghiệp lên tiếng về dự thảo định mức chi phí tái chế - Ảnh 1.\" rel=\"lightbox\" photoid=\"583940104065617920\" data-original=\"https://cdn.tuoitre.vn/471584752817336320/2023/5/19/nhua-tai-che-16844861671842029414616.png\" type=\"photo\" style=\"max-width:100%;\" width=\"\" height=\"\" fetchpriority=\"high\" data-adbro-processed=\"true\"><div id=\"wrapper-inimage-pos-sponsor-0\"><div id=\"in-images\"> <div id=\"zone-joqxux31\"><div id=\"share-joqxuxkg\"><div id=\"placement-k7y7a0oo\" revenue=\"cpm\"><div id=\"banner-joqxux31-k7y7a19w\" style=\"min-height: 10px; min-width: 10px;\"><div id=\"slot-1-joqxux31-k7y7a19w\"> <span id=\"456956746\"><span id=\"BBFE2412-C377-47CB-B62A-9F2E3CAF7097\"></span> <!-- PubMatic Ad Ends --></span></div></div></div></div> </div> </div></div></a></div><div id=\"adbro\" style=\"position: relative; display: block; overflow: hidden; width: 660px; height: 439px; top: -439px; margin-bottom: -439px;\"></div><figcaption><p data-placeholder=\"[nhập chú thích]\">Công ty Plastic People (ở Việt Nam) đang phân loại rác nhựa để tái chế tại công ty - Ảnh: QUANG ĐỊNH</p></figcaption><style>.adbro-autotester-placeholder {background: rgb(50, 150, 255);}.adbro-autotester-satellite {min-height: 50px; background: rgb(255, 150, 50);}div[class*=\"adbro-autotester\"] {background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAGklEQVQImWNgwAQNTFgEGYgXZGRgYGhAFwQANPgBCOfSGxsAAAAASUVORK5CYII=); opacity: .5;}</style></figure><div style=\"width: 660px;\"></div><p>Mới đây, 14 hiệp hội doanh nghiệp tại Việt Nam có văn bản góp ý đối với dự thảo quyết định của Thủ tướng Chính phủ ban hành định mức chi phí <a href=\"https://tuoitre.vn/tai-che.html\" title=\"tái chế\" data-rel=\"follow\">tái chế</a> đối với một đơn vị khối lượng sản phẩm, bao bì và chi phí quản lý hành chính, để giảm thiểu khó khăn cho doanh nghiệp trong tình hình hiện nay.</p><p>Theo đó, các hiệp hội đưa ra những đánh giá và đề xuất cụ thể.</p><p>Trước hết là định mức Fs dựa vào các nghiên cứu tham vấn có kết quả chênh lệch nhau rất lớn. Công thức tính Fs chưa theo nguyên tắc kinh tế tuần hoàn do chưa trừ đi giá trị vật liệu thu hồi được, bất lợi cho doanh nghiệp. Các hệ số Fs như Fs 0,3 cho giấy, chai nhựa cứng (PET) và nhôm; Fs 0,5 cho sắt thép… là không hợp lý.</p><p>Ngoài ra, các hiệp hội cho rằng, sắt thép, nhôm, bao bì giấy, PET phương tiện giao thông, các nhà tái chế các vật liệu này đều có lãi. Các vật liệu này đang tạo công ăn việc làm và lợi nhuận cho nhiều người lao động, doanh nghiệp, ít có nguy cơ với môi trường.&nbsp;</p><p>Do vậy, sẽ không hợp lý nếu yêu cầu <a data-zoneid=\"0\" data-id=\"0\" href=\"https://tuoitre.vn/nha-san-xuat.html\" target=\"_blank\" title=\"nhà sản xuất\">nhà sản xuất</a> đóng góp để hỗ trợ nhà tái chế trong khi các đơn vị tái chế đó đang có lãi.</p><div id=\"InreadPc\"><div id=\"zone-jnvk0c1v\"><div id=\"share-jnvk0cro\"></div> </div></div><p>Dự thảo còn xếp loại phương tiện giao thông vào nhóm sản phẩm chưa có công nghệ tái chế phổ biến ở Việt Nam; hay giải thích việc áp dụng hệ số 1.0  đối với phương tiện giao thông… không có tính thuyết phục </p><p>Các hiệp hội đề xuất: áp dụng hệ số 0 cho các vật liệu có giá trị thu hồi được cao hơn chi phí tái chế (như mô hình Na Uy và Đan Mạch). Đối với các vật liệu khác có công thức tính riêng. </p><p>Bỏ chi phí quản lý hành chính ra khỏi định mức Fs, vì kéo theo khả năng sẽ tăng giá lớn đối với rất nhiều sản phẩm, hàng hóa. Ví dụ giá có thể tăng thêm 1,36% với <a data-zoneid=\"0\" data-id=\"0\" href=\"https://tuoitre.vn/nuoc-uong-dong-chai.html\" target=\"_blank\" title=\"nước uống đóng chai\">nước uống đóng chai</a>; 0,6% với bia lon; 0,2% đối với bịch sữa... gây khó cho người tiêu dùng&nbsp;trong lúc kinh tế khó khăn.</p><p>Để giảm bớt khó khăn cho doanh nghiệp, 14 hiệp hội doanh nghiệp kiến nghị 4 vấn đề. </p><p>Đó là trong hai năm đầu tiên (năm 2024 và 2025) chưa áp dụng xử phạt, chỉ truy thu khoản nộp thiếu nếu doanh nghiệp kê khai chưa đủ hoặc chưa đúng. Cho phép các doanh nghiệp thực hiện kết hợp tự tái chế và nộp tiền hỗ trợ tái chế trong cùng năm, thay vì bắt buộc chọn một trong 2 hình thức. Thay đổi cách nộp quỹ; và có chính sách ưu đãi cho bao bì thân thiện với môi trường hoặc sử dụng <a data-zoneid=\"0\" data-id=\"0\" href=\"https://tuoitre.vn/vat-lieu-tai-che.html\" target=\"_blank\" title=\"vật liệu tái chế\">vật liệu tái chế</a>.</p>"
        },
        items: SAMPLE_ARTICLES_2.slice(0, 4), // related
    })

    // res.status(200).json({
    //     article_id
    // })
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