import {Response} from "express";
import Post from "../../models/post";
import {IGetUserAuthInfoRequest} from "../../middleware/tokenCheck";

export const UpdatePost = (req: IGetUserAuthInfoRequest, res: Response) => {
    const id = req.body.id as string;
    const newContent = req.body.content as string;
    if (!id) {
        res.status(401).send({message: "You need to specify the id of the post"});
        return;
    }
    if (!newContent) {
        res.status(401).send({message: "You need to specify the new content of the post"});
        return;
    }
    Post.findById(id)
        .then((post) => {
            if (!post) {
                res.status(404).send({message: "No post found with this id"});
                return;
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            if (!post.createdBy.equals(req.user.id)) {
                res.status(403).send({message: "You don't have permission to update this post"});
                return;
            }
            post.content = newContent;
            post.save()
                .then((data) => {
                    res.send({data: data, message: "Post updated successfully"});
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
