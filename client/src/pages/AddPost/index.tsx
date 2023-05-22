import React, {useState} from "react";
import {Link} from "react-router-dom";
import {WithContext as ReactTags} from "react-tag-input";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import "./style.css";

import {
  AddPostContainer,
  AddPostForm,
  AddPostInput,
  AddPostLabel,
  AddPostTextArea,
  Message,
  Publish,
  PublishContainer,
} from "./AddPostComponents";

import api from "../../utils/api";
import {postInterface} from "../../redux/types/post";
import handleAxiosError from "../../utils/handleAxiosError";

const AddPost = () => {
  interface ITag {
    id: string;
    text: string;
  }

  interface IFormData {
    title: string;
    content: string;
    introtext: string;
    imageURL: string;
    category: string;
  }

  interface IResult {
    message: string;
    post: postInterface;
  }

  interface IData {
    status: "idle" | "loading" | "succesfull" | "failed";
    result: IResult | null;
    error: string | null;
  }

  const handleChangeQuill = (content: string) => {
    setFormData({
      ...formData,
      content
    });
  };

  const [formData, setFormData] = useState<IFormData>({
    title: "",
    content: "",
    introtext: "",
    imageURL: "",
    category: "",
  });
  const [tags, setTags] = useState<ITag[]>([]);
  const [addPostCall, setAddPostCall] = useState<IData>({
    status: "idle",
    result: null,
    error: null,
  });
  const handleDrag = (tag: ITag, currPos: number, newPos: number) => {
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
    setTags(newTags);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((newFormData) => {
      return {...newFormData, [e.target.name]: e.target.value.replace(/^\s+|\s+$/g, '')};
    });
  };

  const handleChangeTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((newFormData) => {
      return {...newFormData, [e.target.name]: e.target.value.replace(/^\s+|\s+$/g, '')};
    });
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    setAddPostCall({...addPostCall, status: "loading"});
    const tagsText = tags.map((tag) => tag.text);
    const data = {...formData, tags: tagsText};
    api.post<IResult>("/post/add-post", data)
      .then((res) => {
        setAddPostCall({status: "succesfull", result: res.data, error: null});
      })
      .catch((error: Error) => {
        const err = handleAxiosError(error);
        //handled by axios interceptor
        if (err === "return") return;
        setAddPostCall({status: "failed", result: null, error: err});
      });
  };
  const handleDelete = (i: number) => {
    setTags(tags.filter((tag, index) => index !== i));
  };

  const handleAddition = (tag: ITag) => {
    setTags([...tags, tag]);
  };
  return (
    <>
      <AddPostContainer>
        <AddPostForm onSubmit={handlePublish}>
          <AddPostLabel htmlFor="title">Title</AddPostLabel>
          <AddPostInput
            type="text"
            name="title"
            placeholder="Type the desired title for your post"
            onChange={handleChange}
          />
          <AddPostLabel htmlFor="imageURL">Image URL</AddPostLabel>
          <AddPostInput type="text" name="imageURL" placeholder="Paste image URL" onChange={handleChange}/>

          <h2>Content</h2>
          <ReactQuill theme="snow" value={formData.content} onChange={handleChangeQuill}/>

          <br/>
          <br/>
          <br/>
          <br/>
          <hr/>
          <br/>
          <br/>

          <AddPostLabel htmlFor="introtext">Intro text</AddPostLabel>
          <AddPostTextArea
            name="introtext"
            placeholder="Write the introtext of the post"
            onChange={handleChangeTextarea}
          ></AddPostTextArea>

          <AddPostLabel>Tags</AddPostLabel>
          <ReactTags
            tags={tags}
            handleDelete={handleDelete}
            handleAddition={handleAddition}
            handleDrag={handleDrag}
            autofocus={false}
          />
          <AddPostLabel htmlFor="category">Category</AddPostLabel>
          <AddPostInput
            type="text"
            name="category"
            placeholder="Specify the category"
            onChange={handleChange}
          />
          <PublishContainer>
            <Publish>Publish Post</Publish>
          </PublishContainer>
          {addPostCall.status === "loading" && <Message color="white">Loading...</Message>}
          {addPostCall.status === "succesfull" && (
            <Message color="lightgreen">
              {
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                addPostCall.result?.message
              }{" "}
              You can see it{" "}
              <Link
                to={
                  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                  `/blog/post/${addPostCall.result?.post.slug}`
                }
              >
                <Message color="lightgreen">here</Message>
              </Link>
            </Message>
          )}
          {addPostCall.status === "failed" && <Message color="red">{addPostCall.error}</Message>}
        </AddPostForm>
      </AddPostContainer>
    </>
  );
};

export default AddPost;
