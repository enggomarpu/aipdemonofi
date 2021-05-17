import React, { Component, useEffect, useState } from 'react'
import NoImg from '../../../src/img/noimage.png'
import MedTech from '../../../src/img/medTech.png'
import DataCorp from '../../../src/img/dataCorp.png'
import NeutralTech from '../../../src/img/neutralTech.png'
import BestSoftware from '../../../src/img/bestSoftware.png'
import AiSolutions from '../../../src/img/aiSolutions.png'
import { Link, Route } from 'react-router-dom'
import DashboardCalendar from './CalenderEvents/dashboard-calendar'
import UpcomingEvents from './CalenderEvents/upcoming-events.component'
import httpService from '../../shared/http.service';
import FeaturedPostModal from './post/FeaturedPost/featured-post-modal.component'
import FeaturedPostComponent from './post/FeaturedPost/featured-post.component'
import PostModel from './post/AdminPost/post-modal'
import EditPostModel from './post/AdminPost/post-modal'
import Posts from './post/AdminPost/post.component'
import { format, formatDistanceToNow } from 'date-fns'
import commentIcon from '../../../src/img/comments-icon.png'
import UserProfile from '../../../src/img/dummy-profile-pic.png'
import filePickerService from '../../shared/file-picker/file-picker.service'
import { useToasts } from 'react-toast-notifications'
import InfiniteScroll from 'react-infinite-scroll-component';
import dummyIMG from '../../../src/img/dummy-img.jpg'
import AttachmentPreviewModal from "../../shared/attachment-preview-modal/attachment-preview-modal"
// import Pushy from 'pushy-sdk-web';


let userInfo = JSON.parse(localStorage.getItem("user-info"));
let userId = userInfo ? userInfo.userId : null

const AdminDashboardComponent = (props) => {
  const [openModal, setOpenModal] = useState(false);
  const [openFeaturedModel, setOpenFeaturedModel] = useState(false);
  const [Posts, setPosts] = useState([])
  const [newComment, setNewComment] = useState('')
  const [openPostModel, setOpenPostModel] = useState(false)
  const [selectedPostId, setSelectedPostId] = useState(null)
  const [postTags, setPostTags] = useState(null)
  const [Comments, setComments] = useState({})
  const { addToast } = useToasts()
  const [page, setpage] = useState(1);
  const [length, setLength] = useState(10);
  const [dataLength, setDataLength] = useState(10);
  const [loadData, setLoadData] = useState(true);
  const [limit, setlimit] = useState(10);
  const [openPreviewModel, setopenPreviewModel] = useState(false)
  const [filecheck, setfilecheck] = useState("")
  const [filetypecheck, setfiletypecheck] = useState("")
  var userInfo = JSON.parse(localStorage.getItem('user-info'))
  let userId = userInfo && userInfo.userId;

  useEffect(
    () => {
      props.setPageTitle();
      if (page == 1) {
        getDataLength();
      }
    },
    [openPostModel, openModal, page]
  );

  // Pushy.setNotificationListener(function (data) {
  //   // Print notification payload data
  //   console.log('Received notification: ' + JSON.stringify(data));

  //   // Attempt to extract the "message" property from the payload: {"message":"Hello World!"}
  //   let message = data.message || 'Test notification';
  //   // Display an alert with message sent from server
  //   alert('Received notification: ' + message);
  // });

  const getDataLength = async (firstPage) => {
    await httpService.get("posts/dashboard/total").then((res) => {
      if (res) {
        setLength(res.data);
        get(res.data, firstPage);
      }
    }).catch((err) => {
      console.log(err);
    });
  }
  const get = async (fisrtLength, firstPage) => {
    await httpService.get("posts/dashboard?page=" + (firstPage ? firstPage : page) + "&limit=" + limit).then((res) => {
      if (res) {
        if(firstPage){
          setPosts(res.data)
        }
        else{
        setPosts([...Posts, ...res.data])
        }
        let newPage = firstPage ? firstPage : page;
        newPage++;
        setpage(newPage);
        let newLength = dataLength + limit;
        setDataLength(newLength);
        if ((fisrtLength && newLength >= fisrtLength) || newLength >= length) {
          setLoadData(false)
        }
      }
    }).catch((err) => {
      console.log(err);
    });
  };
  const ViewComments = async (id, index) => {
    await httpService
      .get('post-comment/all-comments/' + id)
      .then((res) => {
        if (res) {
          const objectvalue = {
            ...Comments,
            [index]: res.data,
          }
          setComments(objectvalue)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
  const PreviewModelOpen = (event, file, FileType ) => {
    event.preventDefault()
    setopenPreviewModel(true)
    setfilecheck(file)
   // setfiletypecheck(FileType)

   
  }
  const AddComment = (id, index) => {
    if (newComment) {
      let body = {
        PostCommentContent: newComment,
        PostId: id,
      }
      httpService
        .post('post-comment', body)
        .then((res) => {
          addToast('Comment added Successfully', {
            appearance: 'success',
          });
          ViewComments(id, index);
          setNewComment('');
          let items = [...Posts]
          let item = { ...items[index] }
          item.PostAnalytics.TotalComments = item.PostAnalytics.TotalComments + 1
          items[index] = item
          setPosts(items)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
  const handleModelOpen = (event, idvalue, postTags) => {
    event.preventDefault()
    setOpenPostModel(true)
    setSelectedPostId(idvalue)
    setPostTags(postTags)
  }
  const LikePost = async (id, IsUserLiked, index) => {
    const postObject = {
      PostId: id,
    }
    let items = [...Posts]
    let item = { ...items[index] }
    if (IsUserLiked) {
      await httpService
        .delete('post-like/' + id)
        .then(() => {
          item.PostAnalytics.TotalLikes = item.PostAnalytics.TotalLikes - 1
          item.IsUserLiked = !item.IsUserLiked
          items[index] = item
          setPosts(items)
          console.log('successfully unlike the post')
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      await httpService
        .post('post-like', postObject)
        .then((res) => {
          if (res) {
            item.PostAnalytics.TotalLikes = item.PostAnalytics.TotalLikes + 1
            item.IsUserLiked = !item.IsUserLiked
            items[index] = item
            setPosts(items)
            console.log('successfully like the post')
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
  // const FavouritePost = async (id, IsUserFavourite, index) => {
  //   const postObject = {
  //     PostId: id,
  //   }
  //   let items = [...Posts]
  //   let item = { ...items[index] }
  //   if (IsUserFavourite) {
  //     await httpService
  //       .delete('post-favourite/' + id)
  //       .then(() => {
  //         item.PostAnalytics.TotalFavourities =
  //           item.PostAnalytics.TotalFavourities - 1
  //         item.IsUserFavourite = !item.IsUserFavourite
  //         items[index] = item
  //         setPosts(items)
  //         console.log('successfully unfavourite the post')
  //       })
  //       .catch((err) => {
  //         console.log(err)
  //       })
  //   } else {
  //     await httpService
  //       .post('post-favourite', postObject)
  //       .then((res) => {
  //         if (res) {
  //           item.PostAnalytics.TotalFavourities =
  //             item.PostAnalytics.TotalLikes + 1
  //           item.IsUserFavourite = !item.IsUserFavourite
  //           items[index] = item
  //           setPosts(items)
  //           console.log('Post is now your favourite')
  //         }
  //       })
  //       .catch((err) => {
  //         console.log(err)
  //       })
  //   }
  // }

  return (
    <>
      <div className="row">
        <div className="col-md-8">
          <div className="dashboard-nave d-flex mt-2 mb-3">
            <div className="d-inline-block">
              {/* <a
                className='link dropdown-toggle'
                href='/'
                id='dropdownMenuButton1'
                data-bs-toggle='dropdown'
                aria-expanded='false'
              >
                Dropdown button
</a> */}
              <ul
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton1"
              >
                <li>
                  <a className="dropdown-item" href="/">
                    Action
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="/">
                    Another action
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="/">
                    Something else here
                  </a>
                </li>
              </ul>
            </div>
            <div className="nave-border"></div>
            {/* <Link
to='/pendingposts'
className='btn btn-primary btn-width'
>
Approve Pending Posts
</Link> */}
            <button
              className="btn btn-primary btn-width"
              onClick={() => setOpenFeaturedModel(true)}
            >
              Add Featured Post
            </button>
            <button
              className="btn btn-primary btn-width"
              onClick={() => setOpenModal(true)}
            >
              Add a Post
            </button>
          </div>

          <FeaturedPostComponent />
          <>
            {length && (
              <InfiniteScroll
                dataLength={dataLength} //{this.state.items.length}//This is important field to render the next data
                next={get}
                hasMore={loadData}
                scrollThreshold={1.0}
                loader={<h4>Loading...</h4>}
                scrollableTarget="scrollableDiv"
              >
                {Posts &&
                  Posts.map((post, index) => {
                    return (
                      <div className="card simple-card">
                        <div className="row">
                          <div className="col-md-3">
                            <img
                              className="card-img"
                              src={
                                post.Post.PostAttachments[0] &&
                                post.Post.PostAttachments[0].FileType.split(
                                  "/"
                                )[0] == "image"
                                  ? filePickerService.getImageLink(
                                      post.Post.PostAttachments[0].FileHandler
                                    )
                                  : NoImg
                              }
                            />
                          </div>
                          <div className="col-md-9">
                            <div className="card-body">
                              <div className="d-flex justify-content-between mb-3">
                                <div className="align-self-center">
                                  <h3 className="card-title">
                                    {post.Post.PostTitle}
                                  </h3>
                                  <h5 className="card-subtitle">
                                    {formatDistanceToNow(
                                      new Date(post.Post.CreatedDate),
                                      new Date()
                                    ) + " ago"}
                                  </h5>
                                </div>

                                <div className="btn-pane align-self-center">
                                  {/* -------------------------
Like Post
-------------------------*/}
                                  <a
                                    type="button"
                                    onClick={() =>
                                      LikePost(
                                        post.Post.PostId,
                                        post.IsUserLiked,
                                        index
                                      )
                                    }
                                    className="card-link"
                                  >
                                    {post.IsUserLiked ? (
                                      <i className="fa fa-hand-point-right"></i>
                                    ) : (
                                      <i className="far fa-hand-point-right"></i>
                                    )}
                                  </a>

                                  {/* -------------------------
Favourite Post
-------------------------*/}
                                  {/* <a
                          type='button'
                          onClick={() =>
                            FavouritePost(
                              post.Post.PostId,
                              post.IsUserFavourite,
                              index
                            )
                          }
                          className='card-link'
                        >
                          {post.IsUserFavourite ? (
                            <i className='fa fa-star'></i>
                          ) : (
                            <i className='far fa-star'></i>
                          )}
                        </a> */}
                                  {/* -------------------------
share Post
-------------------------*/}
                                  <a type="button" className="card-link">
                                    <i className="fa fa-share-alt"></i>
                                  </a>

                                  {/* -------------------------
comment Post
-------------------------*/}
                                  <span
                                    className="px-3"
                                    id={"accordionExample" + post.Post.PostId}
                                  >
                                    <span
                                      className="accordion-header"
                                      id={"headingOne" + post.Post.PostId}
                                    >
                                      <button
                                        className="collapsed p-0 btn"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target={
                                          "#collapseOne" + post.Post.PostId
                                        }
                                        aria-expanded="false"
                                        aria-controls={
                                          "collapseOne" + post.Post.PostId
                                        }
                                        onClick={() =>
                                          ViewComments(post.Post.PostId, index)
                                        }
                                      >
                                        <img src={commentIcon} alt="" />
                                      </button>
                                    </span>
                                  </span>

                                  {/* -------------------------
Statistics of Post
-------------------------*/}

                                  <span className="card-link dropdown">
                                    <a
                                      className="card-link"
                                      type="button"
                                      id="dropdownMenuButton1"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                    >
                                      <i className="fas fa-tachometer-alt"></i>
                                    </a>

                                    <div
                                      className="dropdown-menu toggle-menu border-0"
                                      aria-labelledby="dropdownMenuButton1"
                                    >
                                      <div className="card custom-card">
                                        <div className="card-header">
                                          Post Insights
                                        </div>
                                        <div className="card-body">
                                          <ol className="list-group list-group-numbered">
                                            <li className="list-group-item d-flex justify-content-between align-items-start">
                                              <div className="ms-2 me-auto">
                                                <div className="fw-bold">
                                                  Likes:
                                                </div>
                                              </div>
                                              <span className="text-secondary fs-5">
                                                {post.PostAnalytics.TotalLikes}
                                              </span>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-start">
                                              <div className="ms-2 me-auto">
                                                <div className="fw-bold">
                                                  Comments:
                                                </div>
                                              </div>
                                              <span className="text-secondary fs-5">
                                                {
                                                  post.PostAnalytics
                                                    .TotalComments
                                                }
                                              </span>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-start">
                                              <div className="ms-2 me-auto">
                                                <div className="fw-bold">
                                                  Shares:
                                                </div>
                                              </div>
                                              <span className="text-secondary fs-5">
                                                {post.PostAnalytics.TotalShare}
                                              </span>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-start">
                                              <div className="ms-2 me-auto">
                                                <div className="fw-bold">
                                                  Favourite:
                                                </div>
                                              </div>
                                              <span className="text-secondary fs-5">
                                                {
                                                  post.PostAnalytics
                                                    .TotalFavourities
                                                }
                                              </span>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-start">
                                              <div className="ms-2 me-auto">
                                                <div className="fw-bold">
                                                  Seen:
                                                </div>
                                              </div>
                                              <span className="text-secondary fs-5">
                                                {post.PostAnalytics.TotalSeen}
                                              </span>
                                            </li>
                                          </ol>
                                        </div>
                                      </div>
                                    </div>
                                  </span>

                                  {userId == post.Post.CreatedUserId && (
                                    <a type="button" className="card-link">
                                      <i
                                        className="fas fa-pen"
                                        aria-hidden="true"
                                        onClick={(e) =>
                                          handleModelOpen(
                                            e,
                                            post.Post.PostId,
                                            post.Post.PostTags
                                          )
                                        }
                                      ></i>
                                    </a>
                                  )}
                                </div>
                              </div>
                              {post.Post.PostAttachments &&
                                post.Post.PostAttachments.find(
                                  (file) =>
                                    file.FileType.split("/")[0] != "image" &&
                                    file.FileType.split("/")[0] != "video"
                                ) && (
                                  <a
                                    href={filePickerService.getDownloadLink(
                                      post.Post.PostAttachments.find(
                                        (file) =>
                                          file.FileType.split("/")[0] !=
                                            "image" &&
                                          file.FileType.split("/")[0] != "video"
                                      ).FileHandler
                                    )}
                                  >
                                    <div className="align-self-center">
                                      <div
                                        className={filePickerService.getFileIcon(
                                          post.Post.PostAttachments.find(
                                            (file) =>
                                              file.FileType.split("/")[0] !=
                                                "image" &&
                                              file.FileType.split("/")[0] !=
                                                "video"
                                          ).FileType
                                        )}
                                      ></div>
                                      <span className="ms-2">
                                        {
                                          post.Post.PostAttachments.find(
                                            (file) =>
                                              file.FileType.split("/")[0] !=
                                                "image" &&
                                              file.FileType.split("/")[0] !=
                                                "video"
                                          ).FileName
                                        }
                                      </span>
                                    </div>
                                  </a>
                                )}
                              {post.Post.PostAttachments &&
                                post.Post.PostAttachments.find(
                                  (file) =>
                                    file.FileType.split("/")[0] == "video"
                                ) && (
                                  <a
                                    href={filePickerService.getDownloadLink(
                                      post.Post.PostAttachments.find(
                                        (file) =>
                                          file.FileType.split("/")[0] == "video"
                                      ).FileHandler
                                    )}
                                    onClick={(e) =>
                                      PreviewModelOpen(
                                        e,
                                        post.Post.PostAttachments.find(
                                          (file) =>
                                            file.FileType.split("/")[0] ==
                                            "video"
                                        ).FileHandler
                                      )
                                    }
                                  >
                                    <div className="align-self-center">
                                      <div
                                        className={filePickerService.getFileIcon(
                                          post.Post.PostAttachments.find(
                                            (file) =>
                                              file.FileType.split("/")[0] ==
                                              "video"
                                          ).FileType
                                        )}
                                      ></div>
                                      <span className="ms-2">
                                        {
                                          post.Post.PostAttachments.find(
                                            (file) =>
                                              file.FileType.split("/")[0] ==
                                              "video"
                                          ).FileName
                                        }
                                      </span>
                                    </div>
                                  </a>
                                )}
                              <p className="card-text">
                                {post.Post.PostContent}
                              </p>
                              <div className="checkbox-group">
                                {post.Post.PostTags &&
                                  post.Post.PostTags.map((tag) => {
                                    return (
                                      <label className="btn btn-primary">
                                        {tag.TagName}
                                      </label>
                                    );
                                  })}
                              </div>
                            </div>
                            <div className="card-footer">
                              <div className="align-self-center">
                                <div
                                  className="custom-accordion accordion"
                                  id={"accordionExample" + post.Post.PostId}
                                >
                                  <div className="accordion-item">
                                    <span
                                      className="accordion-header"
                                      id={"headingOne" + post.Post.PostId}
                                    >
                                      <button
                                        className="accordion-button collapsed btn"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target={
                                          "#collapseOne" + post.Post.PostId
                                        }
                                        aria-expanded="false"
                                        aria-controls={
                                          "collapseOne" + post.Post.PostId
                                        }
                                        onClick={() =>
                                          ViewComments(post.Post.PostId, index)
                                        }
                                      >
                                        <img
                                          src={commentIcon}
                                          className="mx-2"
                                          alt=""
                                        />{" "}
                                        View comments (
                                        {post.PostAnalytics.TotalComments})
                                      </button>
                                    </span>
                                    <div
                                      id={"collapseOne" + post.Post.PostId}
                                      className="accordion-collapse collapse"
                                      aria-labelledby={
                                        "headingOne" + post.Post.PostId
                                      }
                                      data-bs-parent={
                                        "#accordionExample" + post.Post.PostId
                                      }
                                    >
                                      <div className="post-details border-0 p-0">
                                        <div className="accordion-body">
                                          {Comments[index] &&
                                            Comments[index].map((comment) => {
                                              return (
                                                <>
                                                  <div className="comments-panel">
                                                    <div className="date-time">
                                                      <label>
                                                        {format(
                                                          new Date(
                                                            comment.CreatedDate
                                                          ),
                                                          "MMMM dd, yyyy"
                                                        )}
                                                      </label>
                                                    </div>
                                                    <div className="comments">
                                                      <div className="user-profile">
                                                        <img
                                                          src={
                                                            comment.User
                                                              .ProfilePicture
                                                              ? filePickerService.getProfileLogo(
                                                                  comment.User
                                                                    .ProfilePicture
                                                                    .FileHandler
                                                                )
                                                              : UserProfile
                                                          }
                                                          alt=""
                                                        />
                                                      </div>
                                                      <div className="user-details">
                                                        <h3>
                                                          {
                                                            comment.User
                                                              .CompanyName
                                                          }
                                                        </h3>
                                                        <p>
                                                          {
                                                            comment.PostCommentContent
                                                          }
                                                        </p>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </>
                                              );
                                            })}
                                        </div>
                                      </div>

                                      <div className="form-group p-3 bg-white pb-0">
                                        <div className="row">
                                          <div className="col align-self-center">
                                            <input
                                              type="text"
                                              className="form-control"
                                              placeholder="Write your Comment"
                                              value={newComment}
                                              onChange={(e) =>
                                                setNewComment(e.target.value)
                                              }
                                            />
                                          </div>
                                          <div className="col-auto align-self-center">
                                            <button
                                              className="btn btn-primary btn-width"
                                              onClick={() =>
                                                AddComment(
                                                  post.Post.PostId,
                                                  index
                                                )
                                              }
                                            >
                                              Post
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </InfiniteScroll>
            )}
          </>

          {/* <div className="card simple-card">
            <div className="card-header bg-white d-flex justify-content-between">
              <div className="align-self-center">
                <h3 className="card-title">Training</h3>
              </div>
              <div className="btn-pane align-self-center">
                <a href="/" className="card-link">
                  Subscribe
                </a>
                <a href="/" className="card-link">
                  Share
                </a>
              </div>
            </div> */}

             {/* <div className="card-body">
              <h3 className="card-title mb-3">
                AWS Cloud Practitioner Essentials
              </h3>
              <h5 className="card-subtitle mb-3">48 minutes ago</h5>
              <p className="card-text">
                This advanced course demonstrates how to integrate testing and
                security into continous integration (CI), continuous delivery
                (CD), continour deployement (CD) pipelines. You will learn...
                <a href="/" className="card-link">
                  Read More
                </a>
              </p>
              <div className="text-end">
                <a href="/" className="card-link">
                  <i className="far fa-hand-point-right" aria-hidden="true"></i>
                </a>
                <a href="/" className="card-link">
                  <i className="far fa-star" aria-hidden="true"></i>
                </a>
                <a href="/" className="card-link">
                  <i className="far fa-comment-alt" aria-hidden="true"></i>
                </a>
              </div>
            </div>
          </div> */}

          <div className="card simple-card">
            <div className="card-header bg-white d-flex justify-content-between">
              <div className="align-self-center">
                <h3 className="card-title">Collaboration Request</h3>
              </div>
              <div className="btn-pane align-self-center">
                <a href="/" className="card-link">
                  Subscribe
                </a>
                <a href="/" className="card-link">
                  Share
                </a>
              </div>
            </div>

            <div className="card-body">
              <h4 className="card-title-primary">Neutral Tech</h4>
              <h5 className="card-subtitle mb-2">
                New York, New York | 48 minutes ago
              </h5>
              <p className="card-text">
                We are seeking an affliliate who has experience with project
                work in the manifufactoring industry. This project is focused on
                operation optimization EventModal their production plants. The
                lenght of the project is projected to be 3-4 months. Please
                reach out if you are interested in collaborating or learning
                more about the project!
              </p>
            </div>
            <div className="card-footer d-flex justify-content-between">
              <div className="align-self-center">
                <a href="/" className="btn btn-primary btn-width">
                  I’m Interested!
                </a>
              </div>
              <div className="align-self-center">
                <a href="/" className="card-link">
                  <i className="far fa-hand-point-right" aria-hidden="true"></i>
                </a>
                <a href="/" className="card-link">
                  <i className="far fa-star" aria-hidden="true"></i>
                </a>
                <a href="/" className="card-link">
                  <i className="far fa-comment-alt" aria-hidden="true"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card simple-card">
            <div className="card-body">
              <DashboardCalendar />
              <UpcomingEvents />
            </div>
          </div>
          {/* <div className='card simple-card'>
            <div className='card-body p-4'>
              <h3 className='card-title'>Featured Affiliates</h3>
              <div className='featured-affiliates'>
                <ul>
                  <li>
                    <div className='logo'>
                      <img src={MedTech} alt='' />
                    </div>
                    <div className='text'>MedTech</div>
                  </li>
                  <li>
                    <div className='logo'>
                      <img src={DataCorp} alt='' />
                    </div>
                    <div className='text'>MedTech</div>
                  </li>
                  <li>
                    <div className='logo'>
                      <img src={NeutralTech} alt='' />
                    </div>
                    <div className='text'>MedTech</div>
                  </li>
                  <li>
                    <div className='logo'>
                      <img src={BestSoftware} alt='' />
                    </div>
                    <div className='text'>MedTech</div>
                  </li>
                  <li>
                    <div className='logo'>
                      <img src={AiSolutions} alt='' />
                    </div>
                    <div className='text'>MedTech</div>
                  </li>
                </ul>
              </div>
            </div>
          </div> */}
        </div>
      </div>
      {selectedPostId && (
        <EditPostModel
          show={openPostModel}
          postselectid={selectedPostId}
          PostTags={postTags}
          onHide={() => setOpenPostModel(false)}
        />
      )}
      <FeaturedPostModal
        show={openFeaturedModel}
        onHide={() => setOpenFeaturedModel(false)}
      />
      <PostModel
        show={openModal}
        onHide={() => {
          setOpenModal(false);
          setpage(1);
          setPosts([]);
          getDataLength(1);
        }}
      />
      <AttachmentPreviewModal
        show={openPreviewModel}
        onHide={() => setopenPreviewModel(false)}
        filehandler={filecheck}
        filetype={filetypecheck}
      />
    </>
  );
}

export default AdminDashboardComponent