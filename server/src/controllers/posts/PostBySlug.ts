import {Request, Response} from "express";
import Post from "../../models/post";

export const PostBySlug = (req: Request, res: Response) => {
    const slug = req.params.slug;
    if (!slug) {
        res.status(401).send({
            message: "Please specify the slug",
        });
    }
    Post.findOne({slug: slug})
        .populate({path: "createdBy", select: ["username"]})
        .populate({path: "comments.createdBy", select: ["username", "imageURL"]})
        .populate({path: "comments.replies.createdBy", select: ["username", "imageURL"]})
        .then((post) => {
            if (!post) {
                res.status(404).send({
                    message: "Can't find specific post",
                });
                return;
            }
            // https://stackoverflow.com/questions/10123953/how-to-sort-an-object-array-by-date-property
            // This sorts the comments
            post.comments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
            // This sorts the replies
            post.comments.forEach((comment) => {
                comment.replies.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
            });
            res.send(post);
        })
        .catch((error) => {
            res.status(500).send(error);
            console.log(error);
        });
};
