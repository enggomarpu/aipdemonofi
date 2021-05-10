import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import { Modal, Button, Image } from 'react-bootstrap'
import HttpService from '../../../shared/http.service'
import PlusCircle from '../../../img/plus-circle.png'
import TagAddModel from './tag-add-modal'
import { useToasts } from 'react-toast-notifications'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '../../sharedError/error.messages'
import ImagePicker from '../../../shared/image-picker/image-picker.component'
import FilePicker from '../../../shared/file-picker/file-picker.component'
import VideoPicker from '../../../shared/video-picker/video-picker.component'

const PostModel = (props) => {
  const { addToast } = useToasts()
  const [imagesUploaded, setImagesUploaded] = useState()
  const [docUploaded, setDocUploaded] = useState()
  const [videoUploaded, setVideoUploaded] = useState()
  const [tags, setTags] = useState([])
  const [options, setOptions] = useState([])

  const [postBtnTitle, setPostBtnTitle] = useState('Add Post')
  const [postHeader, setPostHeader] = useState('Add a Post')
  const [openModal, setOpenModal] = useState(false)
  const [modalType, setModalType] = useState(false)
  const { register, handleSubmit, errors, reset } = useForm()

  useEffect(() => {
    if (props.postselectid) {
      setPostBtnTitle('Save Post')
      setPostHeader('Edit a Post')
      get();
    }
    else {
      getLookup();
    }
  }, [props])

  const changeHandler = (option) => {
    setTags(option)
  }

  const get = async () => {
    await HttpService.get(`posts/${props.postselectid}`)
      .then((res) => {
        if (res) {
          reset(res.data.Post)
          if (res.data.Post.PostAttachments && res.data.Post.PostAttachments.length > 0) {
            let images = res.data.Post.PostAttachments.filter((attachment) => {
              let type = attachment.FileType.split('/')
              if (type[0] == 'image') {
                return attachment
              }
            })
            setImagesUploaded(images ? images[0] : null)
            let doc = res.data.Post.PostAttachments.filter((attachment) => {
              let type = attachment.FileType.split('/')
              if (type[0] != 'image' && type[0] != 'video') {
                return attachment
              }
            })
            setDocUploaded(doc ? doc[0] : null)
            let video = res.data.Post.PostAttachments.filter((attachment) => {
              let type = attachment.FileType.split('/')
              if (type[0] == 'video') {
                return attachment
              }
            })
            setVideoUploaded(video ? video[0] : null);
          }
          getLookup(res.data.Post.PostTags.map(tag => {
            return{value: tag.TagId,
            label: tag.TagName}
          })
          )
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const createTag = () => {
    setOpenModal(true)
    setModalType(1)
  }

  const getLookup = async (tags) => {
    await HttpService.get('tag/lookup')
      .then((res) => {
        if (res) {
          let data = res.data.map((item) => {
            return {
              value: item.TagId,
              label: item.TagName,
            }
          })
          setOptions(data)
          let postTags = tags
            ? tags
            : []
          setTags(postTags)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const modalLoaded = async () => {
  }

  const savePost = async (data) => {
    let attachment = []
    if (imagesUploaded && Object.keys(imagesUploaded).length !== 0) {
      attachment.push(imagesUploaded)
    }
    if (docUploaded && Object.keys(docUploaded).length !== 0) {
      attachment.push(docUploaded)
    }
    if (videoUploaded && Object.keys(videoUploaded).length !== 0) {
      attachment.push(videoUploaded)
    }
    data.PostAttachments = attachment
    if (tags && tags.length > 0) {
      data.TagIds = tags.map((item) => item.value)
    }
    if (props.postselectid) {
      await HttpService.put(`posts/${props.postselectid}`, data).then(() => {
        addToast('Post Updated Successfully', {
          appearance: 'success',
        })
      })
    } else {
      await HttpService.post('posts', data).then(() => {
        addToast('Post Created Successfully', {
          appearance: 'success',
        })
      })
    }
    props.onHide()
  }

  const onModalClose = (tag) => {
    setOpenModal(false)
    if (tag) {
      let newTags = [...tags, {value : tag.TagId, label: tag.TagName }]
      getLookup(newTags);
    }
  }


  const afterUploaded = (filedata) => {
    setImagesUploaded(filedata)
  }

  const afterDocUploaded = (filedata) => {
    setDocUploaded(filedata)
  }

  const afterVideoUploaded = (filedata) => {
    setVideoUploaded(filedata)
  }

  return (
    <>
      <Modal
        {...props}
        size='md'
        aria-labelledby='contained-modal-title-vcenter'
        centered
        backdrop='static'
        onEntered={modalLoaded}
      >
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-title-vcenter'>
            {postHeader}
          </Modal.Title>
        </Modal.Header>
        <form onSubmit={handleSubmit(savePost)}>
          <Modal.Body>
            <div className='mb-3'>
              <ImagePicker
                data={imagesUploaded}
                afterUpload={afterUploaded}
                label='Add a Photo'
              />

              <FilePicker
                data={docUploaded}
                afterUpload={afterDocUploaded}
                options={{ accept: ['text/*', 'application/*']}}
                label='Add a Document'
              />
              <VideoPicker
                data={videoUploaded}
                afterUpload={afterVideoUploaded}
                label='Add a Video'
              />
            </div>

            <div className='form-group'>
              <label htmlFor='PostTitle'>Post Title</label>
              <input
                className='form-control'
                type='text'
                name='PostTitle'
                id='PostTitle'
                placeholder='Enter text'
                ref={register({
                  required: true,
                })}
              />
              <ErrorMessage type={errors.PostTitle && errors.PostTitle.type} />
            </div>

            <div className='form-group'>
              <label htmlFor='inputTextArea'>Post Details</label>
              <textarea
                cols='30'
                rows='10'
                className='form-control'
                as='textarea'
                id='inputTextArea'
                name='PostContent'
                placeholder='Enter text'
                rows={8}
                ref={register({
                  required: true,
                })}
              ></textarea>
              <ErrorMessage
                type={errors.PostContent && errors.PostContent.type}
              />
            </div>

            <div className='form-group' controlId='tags'>
              <div className='justify-content-between d-flex mb-2'>
                <label className='mb-0 align-self-center'>Tags</label>
                <button type='button' className='btn p-0' onClick={createTag}>
                  <img src={PlusCircle} alt='PlusCircle' />
                </button>
              </div>

              <Select
                isMulti
                name='tags'
                value={tags}
                onChange={changeHandler}
                options={options}
              ></Select>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type='submit'>{postBtnTitle}</Button>
            <Button onClick={props.onHide}>Cancel</Button>
          </Modal.Footer>
        </form>
      </Modal>

      <TagAddModel
        modaltype={modalType}
        show={openModal}
        onHide={onModalClose}
      />
    </>
  )
}
export default PostModel
