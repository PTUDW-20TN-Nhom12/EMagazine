import { CategoryController } from '../controllers/category-controller';
import { Category } from '../models/category';

// Just interface for type hinting, not to be confused with model's!
// just import Category and ts will use that

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

function findPositionFromId(catList: Category[], category_id: number): number {
    for (let i = 0; i < catList.length; i++) {
        if (catList[i].id == category_id) {
            return category_id;
        }
        for (let j = 0; j < catList[i].children.length; j++) {
            if (catList[i].children[j].id == category_id) {
                return catList[i].id;
            }
        }
    }
    return -1; // Default to homepage highlight
}

async function headerGenerator(isHomePage: boolean = true,isLoggedin: boolean = false,
    isPremium: boolean = false, category_id: number): Promise<Header> {

    let selectedCat = -1;
    let optionalList: Optional[] = [];
    if (!isLoggedin) {
        optionalList = [
            {name: "Thông tin toà soạn", url: "/"},
            {name: "Liên hệ quảng cáo", url: "/"}
        ];
    } else {
        optionalList = [
            {name: "Thông tin toà soạn", url: "/"},
            {name: "Liên hệ quảng cáo", url: "/"},
        ]
    }

    const categoryController = new CategoryController();
    const catList = await categoryController.getAllMainCategories();
    
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

async function footerGenerator(): Promise<Footer> {
    const categoryController = new CategoryController();
    const catList = await categoryController.getAllMainCategories();
    const result: Footer = {
        catList: catList
    }
    return result;
}

export {
    headerGenerator,
    footerGenerator,
    Header,
    Footer
}