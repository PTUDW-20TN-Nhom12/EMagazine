import express, { Router, Request, Response } from "express";
import { UserMiddleware } from "../controllers/middleware/user-middleware";
import { Category } from "../models/category";
import { EditorController } from "../controllers/editor-controller";

const router: Router = Router();
const userMiddleware = new UserMiddleware(); 
router.use(express.json());

router.get("/", 
        async (req: Request, res: Response) => {

        // Render here
        return res.render("editor");
})

//  Get list of article related to editor's category
router.get("/getList", userMiddleware.authenticate,
    userMiddleware.checkRole(["editor"]),
    async (req: Request, res: Response) => {
        
    // @ts-ignore
    const editorCat: Category = req.jwtObj.role.category;
    const editorController = new EditorController();

    return res.status(200).json(
        await editorController.getEditorList(editorCat)
    );
});

router.get("/status/:articleId", userMiddleware.authenticate,
    userMiddleware.checkRole(["editor"]),
    async (req: Request, res: Response) => {
    
    const articleId = parseInt(req.params.articleId);
    const editorController = new EditorController();

    return res.status(200).json(
        await editorController.getLatestStatusOfArticle(articleId)
    );
})

interface EditorResponse {
    articleId: number,
    isAccept: boolean,
    note: string,
    updatedCategoryName: string,
    updatedTagsName: string[]
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
        await editorController.updateCategoryTag(
            editorId, response.articleId, response.updatedCategoryName,
            response.updatedTagsName
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