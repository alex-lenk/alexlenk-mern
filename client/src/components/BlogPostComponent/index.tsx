import {IComment, postInterface} from "../../redux/types/post";
import {
  Author,
  Tag,
  BlogPostComponentContainer,
  Category,
  Content,
  ContentContainer,
  ImageContainer,
  Img,
  Tags,
  TextContainer,
  Title,
  TitleContainer,
  Information,
  CategoryContainer,
  CategoryText,
  TagsText,
  DateText,
  CommentsContainer,
  UnderTitle,
  ButtonsContainer,
  DeleteButton,
  EditButton,
  EditContent,
  SubmitPost,
  FormContent,
  ErrorMessage,
  AddCommentTextContainer,
  AddCommentText,
} from "./BlogPostComponents";
import Comment from "./Comment";
import React, {useState} from "react";
import AddComment from "./AddComment";
import api, {ICall, IResult} from "../../utils/api";
import {useDispatch, useSelector} from "react-redux";
import {getPost} from "../../redux/slices/post";
import {RootState} from "../../redux";
import {Link, useNavigate} from "react-router-dom";
import handleAxiosError from "../../utils/handleAxiosError";

const BlogPostComponent: React.FC<postInterface> = ({
                                                      imageURL,
                                                      title,
                                                      content,
                                                      tags,
                                                      category,
                                                      createdBy,
                                                      createdAt,
                                                      comments,
                                                      _id,
                                                      slug,
                                                    }) => {
  const navigate = useNavigate();

  const [addCommentValue, setAddCommentValue] = useState("");
  const [call, setCall] = useState<ICall>({status: "idle", error: null, result: null});
  const setValue = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAddCommentValue(e.target.value);
  };
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    api.post<IResult>("/post/add-comment", {content: addCommentValue, id: _id})
      .then((result) => {
        setCall({status: "success", result: result.data, error: null});
        dispatch(getPost(slug));
      })
      .catch((error: Error) => {
        const err = handleAxiosError(error);
        //handled by axios interceptor
        if (err === "return") return;
        setCall({status: "failed", result: null, error: err});
      });
  };
  const handleDeletePost = (e: React.MouseEvent) => {
    e.preventDefault();
    api.delete("/post/delete-post", {data: {id: _id}})
      .then((data) => {
        navigate("/blog");
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    setEditMode(true);
    setEditedContent(content);
  };
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedContent(e.target.value);
  };
  const [updatePostCall, setUpdatePostCall] = useState<ICall>({status: "idle", error: null, result: null});
  const handlePostChanges = (e: React.FormEvent) => {
    e.preventDefault();
    api.put<IResult>("/post/update-post", {id: _id, content: editedContent})
      .then((result) => {
        setUpdatePostCall({status: "success", result: result.data, error: null});
        setEditMode(false);
        dispatch(getPost(slug));
      })
      .catch((error: Error) => {
        const err = handleAxiosError(error);
        //handled by axios interceptor
        if (err === "return") return;
        setUpdatePostCall({status: "failed", result: null, error: err});
      });
  };
  return (
    <BlogPostComponentContainer>
      <ImageContainer>
        <Img src={imageURL} alt={title} height="400" width="1500"/>
      </ImageContainer>

      <TextContainer>
        <TitleContainer>
          <Title>{title}</Title>
        </TitleContainer>
        <UnderTitle>
          <ButtonsContainer>
            {auth.result.id === createdBy._id && !editMode && (
              <>
                <DeleteButton onClick={handleDeletePost}>Delete Post</DeleteButton>
                <EditButton onClick={handleEdit}>Edit Post</EditButton>
              </>
            )}
          </ButtonsContainer>
          <Information>
            <Author>Written by {createdBy.username}</Author>
            <CategoryContainer>
              <CategoryText>Category: </CategoryText>
              <Category to={`/blog/category/${category}`}>{category}</Category>
            </CategoryContainer>
            <Tags>
              <TagsText>Tags: </TagsText>
              {tags.map((tag: string, key: number) => (
                <Tag to={`/blog/tag/${tag}`} key={key}>
                  {tag}
                </Tag>
              ))}
            </Tags>
            <DateText>{new Date(createdAt).toUTCString()}</DateText>
          </Information>
        </UnderTitle>

        <ContentContainer>
          {!editMode && <Content dangerouslySetInnerHTML={ { __html: content } } />}
          {editMode && (
            <>
              <FormContent onSubmit={handlePostChanges}>
                {updatePostCall.status === "failed" && (
                  <ErrorMessage>{updatePostCall.error}</ErrorMessage>
                )}
                <EditContent value={editedContent} onChange={handleContentChange}/>
                <SubmitPost>Submit changes</SubmitPost>
              </FormContent>
            </>
          )}
        </ContentContainer>
      </TextContainer>

      <CommentsContainer>
        {auth.status === "failed" && (
          <AddCommentTextContainer>
            <AddCommentText>
              Please <Link to="/login">login</Link> or <Link to="/register">register</Link> in order to
              leave a comment
            </AddCommentText>
          </AddCommentTextContainer>
        )}
        {auth.status === "success" && (
          <AddComment
            setValue={setValue}
            handleSubmit={handleSubmit}
            message={call.result?.message}
            error={
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              call.error
            }
          />
        )}

        {comments.map((comment: IComment) => (
          <Comment
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            key={comment._id}
            {...comment}
            slug={slug}
            postId={_id}
          />
        ))}
      </CommentsContainer>
    </BlogPostComponentContainer>
  );
};

export default BlogPostComponent;
