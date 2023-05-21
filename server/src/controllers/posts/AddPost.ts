import {Response} from "express";
import CyrillicToTranslit from "cyrillic-to-translit-js";
import slugify from "slugify";
import {IGetUserAuthInfoRequest} from "../../middleware/tokenCheck";
import isURL from "../../utils/isURL";
import Post from "../../models/post";

const generateSlug = (title: string): string => {
    const cyrillicToTranslit = CyrillicToTranslit();
    const transliteratedTitle: string = cyrillicToTranslit.transform(title);

    const replacedTitle = transliteratedTitle.replace(/[',.&^%$#@!*()=+<>~:/`]/g, '-');

    const slugifiedTitle = slugify(replacedTitle, {
        lower: true,
        replacement: '-'
    });

    return slugifiedTitle.replace(/[^\w-]+$/g, '');
};

export const AddPost = (req: IGetUserAuthInfoRequest, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const {
        title,
        imageURL,
        content,
        tags,
        category,
    }: { title: string; imageURL: string; content: string; tags: string[]; category: string } = req.body;
    if (!title) {
        res.status(401).send({message: "You need to type a title"});
        return;
    }
    if (!imageURL) {
        res.status(401).send({message: "You need to specify an image URL"});
        return;
    }
    if (!content) {
        res.status(401).send({message: "Your post requires content"});
        return;
    }
    if (!category) {
        res.status(401).send({message: "Your post should be in a category"});
        return;
    }
    if (title.length < 3 || title.length > 80) {
        res.status(401).send({message: "Title length should be between 3 and 80 characters"});
        return;
    }
    if (!isURL(imageURL)) {
        res.status(401).send({message: "Image URL is not a valid URL"});
        return;
    }
    if (content.length < 15 || content.length > 30000) {
        res.status(401).send({message: "Content length should be between 15 and 30000 characters"});
        return;
    }
    if (tags.length < 1 || tags.length > 6) {
        res.status(401).send({message: "You need to specify between 1 and 6 tags"});
        return;
    }
    const post = new Post();
    post.title = title;
    post.content = content;
    post.tags = [...tags]; //So that it doesn't refference memory address (even though I think it's ok in this case)
    post.imageURL = imageURL;
    post.category = category;
    post.slug = generateSlug(post.title);
    post.description = content.slice(0, 55);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    post.createdBy = req.user.id;
    post.save()
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .then((savedPost) => {
            res.send({message: "Post published successfully", post: savedPost});
            return;
        })
        .catch((error) => {
            res.status(500).send(error);
            console.log(error);
            return;
        });
};
