
// Just interface for type hinting, not to be confused with model's!
// just import Category and ts will use that
interface Category {
    categoryName: string,
    categoryId: number,
    subCategory: Category[]
}

interface Optional {
    name: string,
    url: string
}

interface Header {
    catList: Category[],
    selectedCat: number,
    isPremium: boolean,
    optionalList: Optional[]
}

interface Footer {
    catList: Category[]
}

// get cat & sub cat (for testing only, implement this in controller)
function getCatList(): Category[] {
    let id = 0; // Auto incremented simulation
    const parCat: string[] = [
        "Kinh Doanh",
        "Cong Nghe",
        "Van Hoa",
        "The Thao",
        "Giao Duc"
    ];
    const childCat: string[][] = [
        ["Tai Chinh", "Dau Tu"],
        ["Chuyen Doi So", "Cau Noi"],
        ["Tuyen Sinh", "Du Hoc"],
        [],
        []
    ]

    let result: Category[] = [];

    for (let i = 0; i < parCat.length; i++) {
        let cat: Category = {
            categoryName: parCat[i],
            categoryId: id,
            subCategory: []
        }
        id += 1; // Auto increment

        for (let j = 0; j < childCat[i].length; j++) {
            let ccat: Category = {
                categoryName: childCat[i][j],
                categoryId: id,
                subCategory: []
            }
            id += 1; // Auto increment
            cat.subCategory.push(ccat);
        }

        result.push(cat)
    }

    return result;
}

function findPositionFromId(catList: Category[], category_id: number): number {
    for (let i = 0; i < catList.length; i++) {
        if (catList[i].categoryId == category_id) {
            return i;
        }
        for (let j = 0; j < catList[i].subCategory.length; j++) {
            if (catList[i].subCategory[j].categoryId == category_id) {
                return i;
            }
        }
    }
    return -1; // Default to homepage highlight
}

function headerGenerator(isHomePage: boolean = true,isLoggedin: boolean = false,
    isPremium: boolean = false, category_id: number): Header {

    let selectedCat = -1;
    const catList = getCatList();

    let optionalList: Optional[] = [];
    if (!isLoggedin) {
        optionalList = [
            {name: "Dang nhap", url: "/"},
            {name: "Thong tin toa soan", url: "/"},
            {name: "Lien he quang cao", url: "/"}
        ];
    } else {
        optionalList = [
            {name: "Dang xuat", url: "/"},
            {name: "Thong tin tai khoan", url: "/"},
            {name: "Cap nhat tai khoan", url: "/"},
            {name: "Thong tin toa soan", url: "/"},
            {name: "Lien he quang cao", url: "/"},
        ]
    }

    if (isHomePage) {
        return {
            isPremium,
            catList,
            optionalList,
            selectedCat // cat start at 0
        };
    }

    // Find correspond position of category_id in list
    selectedCat = findPositionFromId(catList, category_id);

    return {
        isPremium,
        catList: catList,
        optionalList,
        selectedCat
    }
}

function footerGenerator(): Footer {
    const result: Footer = {
        catList: getCatList()
    }
    return result;
}

export {
    headerGenerator,
    footerGenerator,
    Header,
    Footer
}