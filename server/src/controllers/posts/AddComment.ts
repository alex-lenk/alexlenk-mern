import {IGetUserAuthInfoRequest} from "../../middleware/tokenCheck";
import {Response} from "express";
import Post from "../../models/post";

export const AddComment = (req: IGetUserAuthInfoRequest, res: Response) => {
  const id = req.body.id as string;
  const content = req.body.content as string;
  if (!content) {
    res.status(401).send({message: "You need to specify the content of the comment"});
    return;
  }
  if (!id) {
    res.status(401).send({message: "You need to specify the id of the post"});
    return;
  }
  Post.updateOne(
    {_id: id},
    {
      $push: {
        comments: [
          {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            createdBy: req.user.id,
            content: content,
            createdAt: new Date(),
          },
        ],
      },
    },
  )
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .then((post) => {
      res.send({message: "Comment added successfully"});
      return;
    })
    .catch((error) => {
      res.status(500).send(error);
      console.log(error);
      return;
    });
};
