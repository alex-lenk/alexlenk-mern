import {Request, Response} from "express";
import Post, {IPost} from "../../models/post";

const handlePostsResponse = (
    res: Response,
    posts: IPost[],
    page: number,
    perPage: number
) => {
    const PaginatedPosts = PaginatePosts({posts, page, perPage});
    const PaginatedAndSlicedPosts = SlicePosts({posts: PaginatedPosts});
    const totalPages = Math.ceil(posts.length / perPage);
    res.send({
        totalPages: totalPages,
        page: page,
        numberOfElements: posts.length,
        perPage: perPage,
        results: PaginatedAndSlicedPosts,
    });
};

interface PostFilter {
    tags?: string;
    category?: string;
    content?: { $regex: string; $options: string };
    title?: { $regex: string; $options: string };
    $or?: Array<{ content?: { $regex: string; $options: string }; title?: { $regex: string; $options: string } }>;
}

const findPosts = (filter: PostFilter) => {
    return Post.find(filter)
        .sort("-createdAt")
        .catch((error) => {
            console.log(error);
            throw new Error("Error fetching posts");
        });
};


const PaginatePosts = ({posts, page, perPage}: { posts: IPost[]; page: number; perPage: number }): IPost[] => {
    return posts.slice(page * perPage - perPage, page * perPage);
};

const SlicePosts = ({posts}: { posts: IPost[] }) => {
    return posts.map((newPost) => {
        return {
            description: newPost.description,
            title: newPost.title,
            imageURL: newPost.imageURL,
            slug: newPost.slug,
            id: newPost._id as string,
        };
    });
};


export const Posts = async (req: Request, res: Response) => {
    const page = req.query.page as string;
    const perPage = req.query.perPage as string;
    const search = req.query.search as string;
    if (!page || !perPage) {
        res.status(401).send({
            message: "Please specify the page and perPage parameters",
        });
    }

    const searchFilter = search ? {
        $or: [
            {content: {$regex: search, $options: "i"}},
            {title: {$regex: search, $options: "i"}},
        ],
    } : {};

    try {
        const posts = await findPosts(searchFilter);
        handlePostsResponse(res, posts, Number(page), Number(perPage));
    } catch (error) {
        res.status(500).send(error);
    }
};

export const GetPostsByTag = async (req: Request, res: Response) => {
    const tag = req.query.tag as string;
    const page = req.query.page as string;
    const perPage = req.query.perPage as string;
    if (!tag) {
        res.status(401).send({
            message: "Please specify the tag",
        });
        return;
    }
    try {
        const posts = await findPosts({tags: tag});
        handlePostsResponse(res, posts, Number(page), Number(perPage));
    } catch (error) {
        res.status(500).send(error);
    }
};

export const GetPostsByCategory = async (req: Request, res: Response) => {
    const category = req.query.category as string;
    const page = req.query.page as string;
    const perPage = req.query.perPage as string;
    if (!category) {
        res.status(401).send({
            message: "Please specify the category",
        });
        return;
    }
    if (!page || !perPage) {
        res.status(401).send({
            message: "Please specify the page and perPage params",
        });
        return;
    }
    try {
        const posts = await findPosts({category: category});
        handlePostsResponse(res, posts, Number(page), Number(perPage));
    } catch (error) {
        res.status(500).send(error);
    }
};
