import { SupabaseDataSource } from "../models/data_source";
import { ViewLog } from "../models/view-log";
import { Article } from "../models/article";
import moment from "moment";

export class ViewLogController {
    private viewLogRepository = SupabaseDataSource.getRepository(ViewLog);

    async createViewLog(article: Article): Promise<ViewLog> {
        const viewLog = new ViewLog();
        viewLog.article = article;

        try {
            return await this.viewLogRepository.save(viewLog);
        } catch (error) {
            console.error(`Failed to create view log: ${error.message}`);
            return null; 
        }
    }

    async addViewLog(article_id: number, date:string) {
        try {
            const viewLog = new ViewLog();
            let article = await SupabaseDataSource.getRepository(Article).findOneBy({id: article_id});
            viewLog.article = article;
            viewLog.time = moment(date).toDate();
            
            await this.viewLogRepository.save(viewLog);
        } catch (error) {
            console.error(`Failed to add tag: ${error.message}`);
            return null; 
        }
    }

    async getAllViewLogs(): Promise<ViewLog[]> {
        try {
            return await this.viewLogRepository.find();
        } catch (error) {
            console.error(`Failed to retrieve view logs: ${error.message}`);
            return null; 
        }
    }

    async getViewLogById(id: number): Promise<ViewLog> {
        try {
            return await this.viewLogRepository.findOneBy({ id: id });
        } catch (error) {
            console.error(`Failed to retrieve view log: ${error.message}`);
            return null; 
        }
    }

    async updateViewLog(id: number, article: Article): Promise<ViewLog> {
        try {
            const viewLog = await this.viewLogRepository.findOneBy({ id: id });
            if (!viewLog) {
                console.error(`View log with ID ${id} not found.`);
                return null; 
            }
            viewLog.article = article;
            return await this.viewLogRepository.save(viewLog);
        } catch (error) {
            console.error(`Failed to update view log: ${error.message}`);
            return null; 
        }
    }

    async deleteViewLog(id: number): Promise<void> {
        try {
            const viewLog = await this.viewLogRepository.findOneBy({ id: id });
            if (!viewLog) {
                console.error(`View log with ID ${id} not found.`);
                return null; 
            }
            await this.viewLogRepository.remove(viewLog);
        } catch (error) {
            console.error(`Failed to delete view log: ${error.message}`);
            return null; 
        }
    }

    async clearViewLogs(): Promise<void> {
        try {
            await this.viewLogRepository.delete({});
        } catch (error) {
            console.error(`Failed to clear view logs: ${error.message}`);
            return null; 
        }
    }
}