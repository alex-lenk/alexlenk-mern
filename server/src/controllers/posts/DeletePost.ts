import {IGetUserAuthInfoRequest} from "../../middleware/tokenCheck";
import {Response} from "express";
import Post from "../../models/post";
export const DeletePost = (req: IGetUserAuthInfoRequest, res: Response) => {
    const _id = req.body.id as string;
    if (!_id) {
        res.status(401).send({message: "You need to specify the id of the post"});
        return;
    }
    Post.findById(_id)
        .then((post) => {
            if (!post) {
                res.status(404).send({message: "The id does not match any post"});
                return;
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            if (!post.createdBy.equals(req.user._id)) {
                res.status(403).send({message: "You don't have permission to delete this post"});
                return;
            }
            post.remove()
                .then((data) => {
                    res.send({data: data, message: "Post deleted successfully"});
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
