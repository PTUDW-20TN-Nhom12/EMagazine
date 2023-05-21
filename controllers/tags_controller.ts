import { AppDataSource } from "../data_source";
import { Tag } from "../models/Tag";

async function addTag(t: Tag) {
    const tagRepo = AppDataSource.getRepository(Tag);
    return await tagRepo.save(t);
}

async function getAllTags() {
    const tagRepo = AppDataSource.getRepository(Tag);
    const tagsList = await tagRepo.find();
    console.log(tagsList);
    return tagsList;
}

export {
    addTag,
    getAllTags
}