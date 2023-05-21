import {IGetUserAuthInfoRequest} from "../../middleware/tokenCheck";
import {Response} from "express";
import Post from "../../models/post";
import {Comment} from "../../models/comment";

export const AddReply = (req: IGetUserAuthInfoRequest, res: Response) => {
    const postId = req.body.postId as string;
    const commentId = req.body.commentId as string;
    const content = req.body.content as string;
    if (!postId) {
        res.status(401).send({message: "You need to specify the id of the post"});
        return;
    }
    if (!commentId) {
        res.status(401).send({message: "You need to specify the id of the parent comment"});
        return;
    }
    if (!content) {
        res.status(401).send({message: "You need to specify the content of the reply"});
        return;
    }
    Post.findById(postId)
        .then((post) => {
            if (!post) {
                res.status(404).send({message: "No post with this id"});
                return;
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            const foundComment = post.comments.find((comment) => comment._id.equals(commentId));
            if (!foundComment) {
                res.status(404).send({message: "No comment on specified post with this id"});
                return;
            }
            const index = post.comments.indexOf(foundComment);
            const newComment = new Comment({
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                createdBy: req.user.id,
                content: content,
                createdAt: new Date(),
            });
            post.comments[index].replies.push(newComment);
            post.save()
                .then((data) => {
                    res.send({message: "Reply added successfully", data: data});
                    return;
                })
                .catch((error) => {
                    res.status(500).send(error);
                    console.log(error);
                    return;
                });
            return;
        })
        .catch((error) => {
            res.status(500).send(error);
            console.log(error);
            return;
        });
};
