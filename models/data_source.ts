import { DataSource } from 'typeorm';
import { Article } from './article';
import { ArticleStatus } from './article-status';
import { Category } from './category';
import { Comment } from './comment';
import { Tag } from './tag';
import { User } from './user';
import { Role } from './role';
import { ViewLog } from './view-log';
import { CommentAsGuest } from './comment_as_guest';

// Connect to sqlite, for testing
const AppDataSource = new DataSource({
    type: "sqlite",
    database: __dirname + "/test.sqlite",
    // entities: [Article, ArticleStatus, ArticleTag, Category, Comment, Tag, User, Role, ViewsLog],
    entities: [Tag, Category, Article, ViewLog],
    synchronize: true,
    logging: false,
});

// Connect to supabase
const SupabaseDataSource = new DataSource({
    type: "postgres",
    host: "db.iuprtgkypnvwgkhrpbcz.supabase.co",
    port: 5432,
    username: "postgres",
    password: "Nhom1221Nhom",
    database: "postgres",
    entities: [Role, Tag, User, Category, Article, ViewLog, ArticleStatus, Comment, CommentAsGuest],
    synchronize: true,
    logging: false,
    cache: {
        duration: 60000
    }
})

export {
    AppDataSource, SupabaseDataSource
}
