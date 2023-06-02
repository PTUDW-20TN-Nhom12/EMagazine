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
            throw new Error(`Failed to create view log: ${error.message}`);
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
            throw new Error(`Failed to add tag: ${error.message}`);
        }
    }

    async getAllViewLogs(): Promise<ViewLog[]> {
        try {
            return await this.viewLogRepository.find();
        } catch (error) {
            throw new Error(`Failed to retrieve view logs: ${error.message}`);
        }
    }

    async getViewLogById(id: number): Promise<ViewLog> {
        try {
            return await this.viewLogRepository.findOneBy({ id: id });
        } catch (error) {
            throw new Error(`Failed to retrieve view log: ${error.message}`);
        }
    }

    async updateViewLog(id: number, article: Article): Promise<ViewLog> {
        try {
            const viewLog = await this.viewLogRepository.findOneBy({ id: id });
            if (!viewLog) {
                throw new Error(`View log with ID ${id} not found.`);
            }
            viewLog.article = article;
            return await this.viewLogRepository.save(viewLog);
        } catch (error) {
            throw new Error(`Failed to update view log: ${error.message}`);
        }
    }

    async deleteViewLog(id: number): Promise<void> {
        try {
            const viewLog = await this.viewLogRepository.findOneBy({ id: id });
            if (!viewLog) {
                throw new Error(`View log with ID ${id} not found.`);
            }
            await this.viewLogRepository.remove(viewLog);
        } catch (error) {
            throw new Error(`Failed to delete view log: ${error.message}`);
        }
    }

    async clearViewLogs(): Promise<void> {
        try {
            await this.viewLogRepository.delete({});
        } catch (error) {
            throw new Error(`Failed to clear view logs: ${error.message}`);
        }
    }
}