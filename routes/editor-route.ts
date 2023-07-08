import express, { Router, Request, Response } from "express";
import { UserMiddleware } from "../controllers/middleware/user-middleware";
import { Category } from "../models/category";
import { EditorController } from "../controllers/editor-controller";

const router: Router = Router();
const userMiddleware = new UserMiddleware(); 
router.use(express.json());

router.get("/", userMiddleware.authenticate,
        userMiddleware.checkRole(["editor"]),
        async (req: Request, res: Response) => {

        // Render here
        // @ts-ignore
        return res.render("editor", { editorName: req.jwtObj.full_name });
})

router.get("/accepted", userMiddleware.authenticate,
    userMiddleware.checkRole(["editor"]),
    async (req: Request, res: Response) => {

    return res.render("editor_list", { 
        // @ts-ignore
        editorName: req.jwtObj.full_name,
        url: "/editor/accept-list"
    });    
});

router.get("/declined", userMiddleware.authenticate,
    userMiddleware.checkRole(["editor"]),
    async (req: Request, res: Response) => {

    return res.render("editor_list", { 
        // @ts-ignore
        editorName: req.jwtObj.full_name,
        url: "/editor/decline-list"
    });    
});

router.get("/accept-list", userMiddleware.authenticate,
    userMiddleware.checkRole(["editor"]),
    async (req: Request, res: Response) => {

    // @ts-ignore
    const editorId: number = req.jwtObj.id;
    const editorController = new EditorController();

    return res.status(200).json(
        await editorController.getAcceptList(editorId)
    );
});

router.get("/decline-list", userMiddleware.authenticate,
    userMiddleware.checkRole(["editor"]),
    async (req: Request, res: Response) => {

    // @ts-ignore
    const editorId: number = req.jwtObj.id;
    const editorController = new EditorController();

    return res.status(200).json(
        await editorController.getDeclineList(editorId)
    );
});

//  Get list of article related to editor's category
router.get("/getList", userMiddleware.authenticate,
    userMiddleware.checkRole(["editor"]),
    async (req: Request, res: Response) => {
        
    // @ts-ignore
    const editorCat: Category = req.jwtObj.role.category;
    // @ts-ignore
    console.log(req.jwtObj);
    const editorController = new EditorController();


    return res.status(200).json(
        await editorController.getEditorList(editorCat)
    );
});

router.get("/details/:articleId", userMiddleware.authenticate,
    userMiddleware.checkRole(["editor"]),
    async (req: Request, res: Response) => {
    
    const articleId = parseInt(req.params.articleId);
    const editorController = new EditorController();

    return res.status(200).json(
        await editorController.getArticleDetails(articleId)
    );
})

interface EditorResponse {
    articleId: number,
    isAccept: boolean,
    note: string,
    // updatedCategoryName: string,
    // updatedTagsName: string[]
    publishedDate: string,
}

router.post("/make-response", userMiddleware.authenticate,
    userMiddleware.checkRole(["editor"]),
    async (req: Request, res: Response) => {

    // @ts-ignore
    const editorId: number = req.jwtObj.id;
    const response: EditorResponse = req.body;
    const editorController = new EditorController();

    if (response.isAccept) {
        //  Update category & tags
        await editorController.publish(
            editorId, response.articleId, response.publishedDate
        );
    } else {
        //  create new status
        await editorController.createArticleStatus(
            editorId, response.articleId, response.note
        );
    }
    res.status(200).json({"message": "OK"});
});

export {router as editorRoute};