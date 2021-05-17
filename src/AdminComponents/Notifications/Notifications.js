import React, { Component, useState, useEffect } from 'react'
import filePickerService from "../../shared/file-picker/file-picker.service";
import {Spinner} from 'react-bootstrap';
import HttpService from '../../shared/http.service';
import moment from 'moment';
import {  formatDistanceToNow } from "date-fns";
import NoImg from "../../img/noimage.png";
let userInfo = JSON.parse(localStorage.getItem("user-info"));
let userId = userInfo ? userInfo.userId : null

const Notifications = (props) => {
  const [openFeaturedModel, setOpenFeaturedModel] = useState(false)
  const [notificationsMessage, setNotificationsMessage] = useState([])
  const [loading, setLoading] = useState(true)
  const [openModal, setOpenModal] = useState(false)
  const [viewId, setviewId] = useState()
  const [notificationstypeid, setnotificationstypeid] = useState('')
  const [title, settitle] = useState('')
  const [NotiContent, setNotiContent] = useState('')
  const [postCon, setpostCon] = useState('')
  const [showDataHtml, setshowDataHtml] = useState(false)
const getTime = (date) => {
  return date.toLocaleTimeString('en-US')
}

useEffect(() => {
  props.setPageTitle();
  get()
}, [])

const get = async () => {
  await HttpService.get('notifications/full')
    .then((res) => {
      setLoading(false)
      setNotificationsMessage(res.data)
    })
    .catch((err) => {
      console.error('Api Call Error', err)
    })
}
const getNotificationDetail = async (type, id) => {
  let url = "";

  if (type == "New Post" || type == "Updated Post" || type == "Post Approved") {
    url = "posts/";
  }
  // else {
  //   return;
  // }

  await HttpService.get(url + id)
    .then((res) => {
      console.log(res);
      if (res && res.data) {
        const detail = (
          <span>
            <div className="row">
              <div className="col-md-3">
                <br />
                <img
                  className="card-img"
                  src={
                    res.data.Post.PostAttachments &&
                    res.data.Post.PostAttachments.find(
                      (file) => file.FileType.split("/")[0] == "image"
                    )
                      ? filePickerService.getImageLink(
                          res.data.Post.PostAttachments.find(
                            (file) => file.FileType.split("/")[0] == "image"
                          ).FileHandler
                        )
                      : NoImg
                  }
                />
              </div>
              <div className="col-md-9">
                <h3>{res.data.Post.PostTitle}</h3>
                <br />
                <h5 className="card-subtitle">
                  {formatDistanceToNow(
                    new Date(res.data.Post.CreatedDate),
                    new Date()
                  ) + " ago"}
                </h5>
                <br /> {res.data.Post.PostContent}
              </div>
            </div>
          </span>
        );
        setNotiContent(detail);
      }
    })
    .catch((err) => {
      setNotiContent("error");
    });
};
const showHTML = (NotificationType, typeid, veiwid, title, NotiCon, postCon) => {

  getNotificationDetail(NotificationType, typeid);

  setnotificationstypeid(typeid);
  setviewId(veiwid);
  settitle(title);
   //setNotiContent(NotiCon);
  setpostCon(postCon);
  setshowDataHtml(true);
};

return (
  <>
        <div className='row'>
          <div className='col-md-8'>
            <div className='card simple-card mb-0 rounded-0 notifications-card'>
              <div className='card-header notifications-header'>
                <div className='row justify-content-between'>
                  <div className='col-auto align-self-center'>
                    <div class='form-check d-inline-block'>
                      <input
                        class='form-check-input'
                        type='checkbox'
                        value=''
                        id='flexCheckDefault'
                      />
                      <label
                        class='form-check-label'
                        for='flexCheckDefault'
                      ></label>
                    </div>
                    <h4 className='h4  d-inline-block'>All</h4>
                  </div>

                  <div className='col-auto align-self-center'>
                    <ul className='nav'>
                      <li className='nav-item ps-3'>
                        <div className='input-group search-group'>
                          <button
                            className='btn btn-outline-secondary'
                            type='submit'
                          >
                            <i className='fas fa-search' />
                          </button>
                          <input
                            className='form-control'
                            type='search'
                            placeholder='Search affiliate'
                            aria-label='Search'
                          />
                        </div>
                      </li>

                      <li className='nav-item'>
                        <a className='navlink' href='/'>
                          <i className='fas fa-sort-amount-up' />
                          Sort
                        </a>
                      </li>

                      <li className='nav-item'>
                        <a className='navlink' href='/'>
                          <i className='fas fa-filter' />
                          Filter
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <>
                {loading ? (
                  <Spinner animation='border' />
                ) : (
                  notificationsMessage &&
                  notificationsMessage.map((notification, index) => {
                    return (
                      <>
                        <div className="card-body">
                          {" "}
                          <div className="row">
                            <div className="col-sm notifications-body">
                              <div className="row g-1">
                                <div className="col-auto">
                                  <div class="form-check">
                                    <input
                                      class="form-check-input"
                                      type="checkbox"
                                      value=""
                                      id="flexCheckDefault"
                                    />
                                    <label
                                      class="form-check-label"
                                      for="flexCheckDefault"
                                    ></label>
                                  </div>
                                </div>
                                <div
                                  className="col"
                                  onClick={() =>
                                    showHTML(
                                      notification.notification
                                        .NotificationType,
                                      notification.notification
                                        .NotificationTypeId,
                                      notification.notification.NotificationsId,
                                      notification.notification
                                        .NotificationTitle,
                                      notification.notification
                                        .NotificationContent,
                                      notification.notification.PostContent
                                    )
                                  }
                                >
                                  <h4 className="card-title">
                                    {
                                      notification.notification
                                        .NotificationTitle
                                    }
                                  </h4>
                                  <p>
                                    {
                                      notification.notification
                                        .NotificationContent
                                    }
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-auto">
                              <p className="time">
                                {moment(
                                  notification.notification.CreatedDate
                                ).fromNow()}
                              </p>
                            </div>
                          </div>
                        </div>

                        <p className="card-text">
                          {notification.notification.PostContent}
                        </p>
                      </>
                    );
                  })
                )}
              </>
            </div>
          </div>
          <div className='col-md-4'>
            {showDataHtml && (
              <>
                <div className='card simple-card'>
                  <div className='card-header bg-white p-0'>
                    <h3>{title}</h3>
                  </div>
                  <div className='card-body'>
                    <h6>{NotiContent}</h6>
                    <h6>{postCon}</h6>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
  </>
)
}

export default Notifications

