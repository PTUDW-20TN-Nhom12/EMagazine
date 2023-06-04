import { Article } from "../models/article";
import { Comment } from "../models/comment";
import { CommentAsGuest } from "../models/comment_as_guest";
import { SupabaseDataSource } from "../models/data_source";
import { User } from "../models/user";

export interface CommentFormat {
    username: string,
    content: string,
    date: Date
}

export class CommentController {
    private comment_as_user = SupabaseDataSource.getRepository(Comment);
    private comment_as_guest = SupabaseDataSource.getRepository(CommentAsGuest);
    private article = SupabaseDataSource.getRepository(Article);
    private user = SupabaseDataSource.getRepository(User);

    async createGuestComment(article_id: number, name: string, content: string): Promise<void> {
        const guest_comment = new CommentAsGuest();
        guest_comment.article = await this.article.findOneBy({id: article_id});
        guest_comment.commenter = name;
        guest_comment.content = content;
        this.comment_as_guest.save(guest_comment);
    }

    async createUserComment(article_id: number, user_id: number, content: string): Promise<void> {
        const user_comment = new Comment();
        user_comment.article = await this.article.findOneBy({id: article_id});
        user_comment.commenter = await this.user.findOneBy({id: user_id});
        user_comment.content = content;
        this.comment_as_user.save(user_comment);
    }

    async getComment(article_id: number): Promise<CommentFormat[]> {
        let result: CommentFormat[] = [];
        // Get user comment:
        let a_list = await this.comment_as_user.find({
            relations: {
                commenter: true
            },
            where: {article: {id: article_id}},
        });
        let b_list = await this.comment_as_guest.findBy({article: {id: article_id}});

        for (let elem of a_list) {
            result.push({
                username: elem.commenter.full_name,
                content: elem.content,
                date: elem.date_created,
            })
        }
        for (let elem of b_list) {
            result.push({
                username: elem.commenter,
                content: elem.content,
                date: elem.date_created,
            })
        }

        result.sort((a, b) => a.date.getTime() - b.date.getTime());
        return result;
    }
};