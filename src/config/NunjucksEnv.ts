import nunjucks from "nunjucks";
import path from "path";

export default new nunjucks.Environment(new nunjucks.FileSystemLoader(
    path.join(__dirname, "../views")
));