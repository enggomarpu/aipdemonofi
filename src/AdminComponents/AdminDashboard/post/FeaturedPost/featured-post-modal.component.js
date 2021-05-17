import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import { Modal, Button, Image } from 'react-bootstrap'
import HttpService from '../../../../shared/http.service'
import { useToasts } from 'react-toast-notifications'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '../../../sharedError/error.messages'
import ImagePicker from '../../../../shared/image-picker/image-picker.component'
import FilePicker from '../../../../shared/file-picker/file-picker.component'
import VideoPicker from '../../../../shared/video-picker/video-picker.component'

const FeaturedPostModel = (props) => {
  const { addToast } = useToasts()
  const [imagesUploaded, setImagesUploaded] = useState()
  const [videoUploaded, setVideoUploaded] = useState()
  const [docUploaded, setDocUploaded] = useState()
  const [tags, setTags] = useState([])
  const [options, setOptions] = useState([])

  const [postBtnTitle, setPostBtnTitle] = useState('Add Post')
  const [postHeader, setPostHeader] = useState('Add Featured Post')
  const { register, handleSubmit, errors, reset } = useForm()

  useEffect(() => {
    if (props.postId) {
      setPostBtnTitle('Save Post')
      setPostHeader('Edit a Post')
      get()
    }
  }, [props])

  const get = async () => {
    await HttpService.get(`posts/${props.postId}`)
      .then((res) => {
        if (res) {
          reset(res.data.Post)
          let postTags = res.data.Post.PostTags
            ? res.data.Post.PostTags.map((item) => {
                return {
                  value: item.TagId,
                  label: item.TagName,
                  isDisabled: !item.IsApproved,
                }
              })
            : []
          setTags(postTags)
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
            setVideoUploaded(video ? video[0] : null)
          }
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const getLookup = async () => {
    await HttpService.get('tag/lookup')
      .then((res) => {
        if (res) {
          let data = res.data.map((item) => {
            return {
              value: item.TagId,
              label: item.TagName,
              isDisabled: !item.IsApproved,
            }
          })
          setOptions(data)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const modalLoaded = async () => {
    getLookup()
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
    if (props.postId) {
      await HttpService.put(`posts/${props.postId}`, data).then(() => {
        addToast('Post Updated Successfully', {
          appearance: 'success',
        })
      })
    } else {
      await HttpService.post('posts/admin-all-promotional', data).then(() => {
        addToast('Post Created Successfully', {
          appearance: 'success',
        })
      })
    }
    props.onHide()
  }

  const colourStyles = {
    control: (styles) => ({ ...styles, backgroundColor: 'white' }),
    option: (styles, { data, isDisabled }) => {
      return {
        ...styles,
        backgroundColor: isDisabled ? 'gray' : null,
        color: isDisabled ? 'white' : null,
        cursor: isDisabled ? 'not-allowed' : 'default',
      }
    },
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
              <label htmlFor='post'>Post Title</label>
              <input
                className='form-control'
                type='text'
                id='post'
                name='PostTitle'
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
                className='form-control'
                type='textarea'
                id='inputTextArea'
                rows='8'
                name='PostContent'
                placeholder=''
                cols='30'
                rows='10'
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
                <label>Tags</label>
              <Select
                isMulti
                name='tags'
                value={tags}
                onChange={(option) => setTags(option)}
                options={options}
                styles={colourStyles}
              ></Select>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type='submit'>{postBtnTitle}</Button>
            <Button onClick={props.onHide}>Cancel</Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  )
}
export default FeaturedPostModel
