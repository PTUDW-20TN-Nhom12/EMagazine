import { SupabaseDataSource } from "../models/data_source";
import { User } from "../models/user";

export class PaymentController {
    private userRepository = SupabaseDataSource.getRepository(User);

    async addPremium(user_id: number, days: number) {
        let u: User = await this.userRepository.findOneBy({id: user_id});
        const currentTimestamp = new Date().getTime();
        let new_expired: number = 0;

        if (u.premium_expired === null) {
            new_expired = currentTimestamp + 86400 * days;
        } else {
            // @ts-ignore
            const targetTimestamp = new Date(u.premium_expired).getTime();
            // Currently premium
            if (currentTimestamp < targetTimestamp) {
                // Add target
                new_expired = targetTimestamp + 86400 * days;
            } else {
                // Not premium
                new_expired = currentTimestamp + 86400 * days;
            }
        }

        // Update
        await this.userRepository.save({
            id: u.id,
            premium_expired: new Date(new_expired)
        });
    }
}