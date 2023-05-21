// import data from './raw_data.json';
import "reflect-metadata";
import { AppDataSource } from "../data_source";
import { Category } from '../models/Category';


async function getall() {
    await AppDataSource.initialize()
    .then(async () => {
        console.log("Data Source has been initialized!")
        const aaa = AppDataSource.getRepository(Category);
        const aaaa = await aaa.find();
        return aaaa;
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    });
};
const users = await getall();

console.log(users);
// for (let article of data) {
//     console.log(article['Cate']);
// }

// console.log("aaaaaaaa")