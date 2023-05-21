import {Response} from "express";
import {IGetUserAuthInfoRequest} from "../../middleware/tokenCheck";
import Post from "../../models/post";

export const DeleteComment = (req: IGetUserAuthInfoRequest, res: Response) => {
    const postId = req.body.postId as string;
    const commentId = req.body.commentId as string;
    const parentId = req.body.parentId as string;
    if (!postId) {
        res.status(401).send({message: "You need to specify the id of the post"});
        return;
    }
    if (!commentId) {
        res.status(401).send({message: "You need to specify the id of the comment"});
        return;
    }
    Post.findById(postId)
        .then((post) => {
            let foundComment;
            let index;
            //Find the comment and its index
            if (!parentId) {
                foundComment = post.comments.find((comment) => comment.id === commentId);
                index = post.comments.indexOf(foundComment);
            } else {
                foundComment = post.comments
                    .find((comment) => comment.id === parentId)
                    .replies.find((comment) => comment.id === commentId);
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                index = post.comments.find((comment) => comment.id === parentId).replies.indexOf(foundComment);
            }

            //Edge cases
            if (!foundComment) {
                res.status(404).send({message: "Comment does not exists"});
                return;
            }

            if (!foundComment.createdBy === req.user.id) {
                res.status(403).send({message: "You don't have permission to delete this post"});
                return;
            }

            //Changing the array for specific case
            if (!parentId) {
                post.comments.splice(index, 1);
            } else {
                post.comments.find((comment) => comment.id === parentId).replies.splice(index, 1);
            }
            //Save the whole post after the comment was deleted
            post.save()
                .then((data) => {
                    res.send({data: data, message: "Comment deleted successfully"});
                    return;
                })
                .catch((error) => {
                    res.status(500).send(error);
                    console.log(error);
                    return;
                });
        })
        .catch((error) => {
            res.status(500).send(error);
            console.log(error);
            return;
        });
};
