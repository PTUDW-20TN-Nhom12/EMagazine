import express, {Router, Request, Response} from "express";
import { getMoMo } from "../utils/momo_testing";
import { UserMiddleware } from "../controllers/middleware/user-middleware";
import { PaymentController } from "../controllers/payment-controller";
const router: Router = Router();

const userMiddleware = new UserMiddleware();
router.use(express.json());

router.get("/client", userMiddleware.authenticate, async (req: Request, res: Response) => {
    // @ts-ignore
    if (!req.isAuth) {
        return res.status(401).send("Unauthorized");
    }
    res.status(200).render("pricing");
})

// TODO: change to jwt's authentication to get user id!
router.get("/client/:type", userMiddleware.authenticate, async (req: Request, res: Response) => {
    // @ts-ignore
    if (!req.isAuth) {
        return res.status(401).send("Unauthorized");
    }

    // @ts-ignore
    const user_id = req.jwtObj.id;
    const type = parseInt(req.params.type); // 0, 1, 2
    if (type < 0 || type > 2) {
        return res.status(404);
    }

    const price = [10000, 49000, 99000];
    const day = [1, 7, 30];
    let url: string = await getMoMo(user_id, price[type], day[type]);
    res.redirect(url);
})

router.post("/ipn", async (req: Request, res: Response) => {
    /*
        partnerCode 	MOMOIQA420180417
        orderId 	MOMOIQA4201804171685772944876
        requestId 	MOMOIQA4201804171685772944876
        amount 	10000
        orderInfo 	pay with MoMo
        orderType 	momo_wallet
        transId 	3022113375
        resultCode 	0
        message 	Successful.
        payType 	qr
        responseTime 	1685772985084
        extraData 	(empty)
        signature 	b1bde85919cdd9a18a43c86c9a8acea26fbb90d85b91a8781d01983f8f654150
    */
    const {amount, resultCode, extraData} = req.body;
    console.log(extraData);
    const data = JSON.parse(Buffer.from(extraData, 'base64').toString());
    const day = data.day;
    const user_id = data.user_id;
    console.log(resultCode);
    if (resultCode == 0) {
        console.log(`Payment successful for ${user_id}, ${amount}VND, +${day} day(s)`);
        const paymentController = new PaymentController();
        paymentController.addPremium(user_id, day);
        return res.status(204);
    }
    console.log("Unsuccess");
    res.status(204);
})

export {router as PaymentRouter};