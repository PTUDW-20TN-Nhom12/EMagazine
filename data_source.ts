import { DataSource } from 'typeorm';
import { Article } from './models/Article';
import { ArticleStatus } from './models/ArticleStatus';
import { Category } from './models/Category';
import { Comment } from './models/Comment';
import { Tag } from './models/Tag';
import { User } from './models/User';
import { Role } from './models/Role';
import { ViewLog } from './models/ViewLog';

// Connect to sqlite, for testing
const AppDataSource = new DataSource({
    type: "sqlite",
    database: __dirname + "/test.sqlite",
    // entities: [Article, ArticleStatus, ArticleTag, Category, Comment, Tag, User, Role, ViewsLog],
    entities: [Tag, Category, Article],
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
    // entities: [Article, ArticleStatus, ArticleTag, Category, Comment, Tag, User, Role, ViewsLog],
    entities: [Tag, Category, Article],
    synchronize: true,
    logging: false,
})

export {
    AppDataSource, SupabaseDataSource
}
