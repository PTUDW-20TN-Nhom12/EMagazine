import express, {Router, Request, Response} from "express";
import { getMoMo } from "../utils/momo_testing";
const router: Router = Router();

router.use(express.json());

router.get("/", async (req: Request, res: Response) => {
    // TODO: render payment page
    res.status(200).json();
})

// TODO: change to jwt to get user id!
router.get("/:id/:type", async (req: Request, res: Response) => {
    const user_id = parseInt(req.params.id);
    const type = parseInt(req.params.type); // 0, 1, 2
    if (type < 0 || type > 2) {
        return res.status(404);
    }

    const price = [10000, 49000, 99000];
    let url: string = await getMoMo(user_id, price[type]);
    res.redirect(url);
})

router.post("/ipn/:id", async (req: Request, res: Response) => {
    const user_id = parseInt(req.params.id);
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
    const {amount, resultCode} = req.body;
    if (resultCode == 0) {
        console.log(`Payment successful for ${user_id}, ${amount}VND`);
    }
})

export {router as PaymentRouter};