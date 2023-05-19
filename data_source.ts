import { DataSource } from 'typeorm';
import { Tags } from './models/tags';

// Connect to sqlite, for testing
const AppDataSource = new DataSource({
    type: "sqlite",
    database: __dirname + "/test.sqlite",
    entities: [Tags],
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
    entities: [Tags],
    synchronize: true,
    logging: false,
})

export {
    AppDataSource
}
