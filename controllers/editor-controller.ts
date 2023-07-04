/*
List of Editor functionality
    - List article of category which have not been reviewed
    - Edit status of article (pass / need further change)
*/

export class EditorController {
    async getEditorList(editorId: number) {

    }
    async editArticleStatus(articleId: number, review: String) {
        if (review == "") {
            // Pass
        } else {
            // need review
        }
    } 
}