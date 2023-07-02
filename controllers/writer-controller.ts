/*
List of Writer's functionality
    - Viewing own articles w/ status
    - Upload
    - Edit
*/

import { Article } from "../models/article";
import {SupabaseDataSource} from "../models/data_source";

export class WriterController {
    private articleRepository = SupabaseDataSource.getRepository(Article);

    async getListArticleByAuthor(authorId: number) {
        return await this.articleRepository.find({
            
        })
    }

    async uploadArticle(authorID: number) {

    }

    async editArticle(authorID: number) {

    }
}