import { AppDataSource } from "../data_source";
import { Tags } from "../models/tags";

async function addTag(t: Tags) {
    const tagRepo = AppDataSource.getRepository(Tags);
    return await tagRepo.save(t);
}

async function getAllTags() {
    const tagRepo = AppDataSource.getRepository(Tags);
    const tagsList = await tagRepo.find();
    console.log(tagsList);
    return tagsList;
}

export {
    addTag,
    getAllTags
}