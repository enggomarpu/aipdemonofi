import { Modal, Button } from 'react-bootstrap'
import React, { lazy, useEffect, useState } from 'react'
import { store } from '../../../App'
import SaveIcon from '../../../img/save.png'
import ShareIcon from '../../../img/share-icon.png'
import { useDispatch, useSelector } from 'react-redux'
import filePickerService from '../../../shared/file-picker/file-picker.service'
import format from 'date-fns/format'
import { get, getComment, resetState, save } from './collaboration-detail.redux'
import jsPDF from 'jspdf'
import httpService from '../../../shared/http.service'
import { useToasts } from 'react-toast-notifications'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '../../sharedError/error.messages'
import MultiFilePicker from '../../../shared/multi-file-picker/multi-file-picker.component'

const CollaborationsDetailModal = (props) => {
  const {
    register,
    handleSubmit,
    errors,
    formState,
    reset,
    setValue,
  } = useForm()
  const [documents, setDocuments] = useState([])
  const dispatch = useDispatch()
  const serverData = useSelector((state) => state.collaboration_detail.data)
  const commentData = useSelector((state) => state.collaboration_detail.comment)
  const funcType = useSelector((state) => state.collaboration_detail.type)
  const errorMessage = useSelector(
    (state) => state.collaboration_detail.errorMessage
  )
  const [commentId, setCommentId] = useState(false)
  const [isShow, setIsShow] = useState(true)
  let userInfo = JSON.parse(localStorage.getItem('user-info'))
  let userId = userInfo.userId
  const { addToast } = useToasts()

  useEffect(() => {
    switch (funcType) {
      case 'collaboration_detail/getCommentSuccess':
        reset(commentData)
        setDocuments(commentData.CollaborationRequestCommentAttachments)
        break
      case 'collaboration_detail/saveSuccess':
        if (commentId) {
          addToast('Collaboration request updated successfully', {
            appearance: 'success',
          })
        } else {
          addToast('Collaboration request sent successfully', {
            appearance: 'success',
          })
        }
        onCommentClose()
        break
      case 'collaboration_detail/error':
        addToast(errorMessage, {
          appearance: 'error',
        })
        break
      default:
        break
    }
  }, [funcType])

  const onCommentClose = () => {
    reset({})
    setDocuments([])
    dispatch(
      get({
        CollaborationRequestId: props.requestId,
      })
    )
    setIsShow(true)
  }

  const [collaborationData, setcollaborationData] = useState('')

  const generatePDF = async (event, idvalue) => {
    event.preventDefault()
    //  setSelectedPostId(idvalue)
    //  setPostTags(postTags)
    console.log('in a pdf button', idvalue)

    await httpService
      .get(`collaboration-request/${idvalue}`)
      .then((res) => {
        if (res) {
          var doc = new jsPDF('p', 'pt')
          setcollaborationData(res.data)
          doc.setFont('helvetica')
          doc.text(40, 20, 'Project Name')
          doc.text(180, 20, res.data.ProjectName)

          doc.setFont('helvetica')
          doc.text(40, 60, 'Project Timeline')
          //doc.text(20, 40, res.data.Post.PostContent)

          doc.setFont('helvetica')
          doc.text(40, 100, 'Related Industry')
          doc.text(180, 100, res.data.RelatedIndustry)

          doc.setFont('helvetica')
          doc.text(40, 140, 'Project Details')
          doc.text(180, 140, res.data.ProjectDetails)

          doc.setFont('helvetica')
          doc.text(40, 180, 'Priority Level')
          doc.text(180, 180, res.data.PriorityLevel)

          doc.save('Collaboration Details.pdf')
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const onModalEntered = () => {
    dispatch(
      get({
        CollaborationRequestId: props.requestId,
      })
    )
  }

  const onSubmit = async (formData, e) => {
    e.preventDefault()
    let payload = { ...formData, RequestCommentAttachments: documents }
    dispatch(
      save({ requestId: props.requestId, commentId: commentId, data: payload })
    )
  }

  const afterDocUploaded = (filedata) => {
    let attachments = []
    filedata.map((file) => {
      attachments.push(file)
    })
    setDocuments(attachments)
  }

  const openCommentForm = (id) => {
    setIsShow(false)
    dispatch(getComment(id))
    setCommentId(id)
  }

  const onclose = () => {
    dispatch(resetState())
    props.onHide()
  }

  return (
    <>
      <Modal
        {...props}
        size='lg'
        backdrop='static'
        keyboard={false}
        aria-labelledby='contained-modal-title-vcenter'
        onEntered={onModalEntered}
        centered
      >
        <Modal.Header className='border-0 pb-0'>
          <div className='col post-info d-flex align-self-center'>
            <div className='userprofile align-self-center'></div>
          </div>
        </Modal.Header>
        <Modal.Body>
          {isShow ? (
            serverData.requestdata && (
              <div className='modal-1'>
                <div className='row mb-3'>
                  <div className='col'>
                    <h1>
                      {serverData.requestdata.StartedByUser &&
                        serverData.requestdata.StartedByUser.ProfilePicture && (
                          <img
                            src={filePickerService.getProfileLogo(
                              serverData.requestdata.StartedByUser
                                .ProfilePicture.FileHandler
                            )}
                            alt=''
                            className='rounded-circle'
                          />
                        )}
                      {serverData.requestdata.StartedByUser
                        ? serverData.requestdata.StartedByUser.Name
                        : ''}
                    </h1>
                  </div>
                  <div className='col-auto align-self-center'>
                    <a
                      className='link'
                      onClick={(e) =>
                        generatePDF(
                          e,
                          serverData.requestdata.CollaborationRequestId
                        )
                      }
                    >
                      <img src={SaveIcon} alt='' />
                      Save As PDF
                    </a>
                    <a className='link ms-3'>
                      <img src={ShareIcon} alt='' />
                      Share post
                    </a>
                  </div>
                </div>

                <div className='checkbox-group mb-3'>
                  {serverData.requestdata.RequestSkills &&
                    serverData.requestdata.RequestSkills.map((skill) => {
                      return (
                        <label className='btn btn-primary'>
                          {skill.SkillName}
                        </label>
                      )
                    })}
                </div>

                <div className='custom-list'>
                  <div className='row mb-3'>
                    <div className='col-3'>
                      <b>Project Name</b>
                    </div>
                    <div className='col-9'>
                      {serverData.requestdata.ProjectName}
                    </div>
                  </div>

                  <div className='row mb-3'>
                    <div className='col-3'>
                      <b>Project Timeline</b>
                    </div>
                    <div className='col-9'>
                      {format(
                        new Date(serverData.requestdata.StartDate),
                        'MMMM dd'
                      )}{' '}
                      - {format(new Date(serverData.requestdata.EndDate), 'PP')}
                    </div>
                  </div>

                  <div className='row mb-3'>
                    <div className='col-3'>
                      <b>Related Industry</b>
                    </div>
                    <div className='col-9'>
                      {serverData.requestdata.RelatedIndustry}
                    </div>
                  </div>

                  <div className='row mb-3'>
                    <div className='col-3'>
                      <b>Project Details</b>
                    </div>
                    <div className='col-9'>
                      {serverData.requestdata.ProjectDetails}
                    </div>
                  </div>

                  <div className='row mb-3'>
                    <div className='col-3'>
                      <b>Priority Level</b>
                    </div>
                    <div className='col-9'>
                      <span className='text-danger'>
                        {serverData.requestdata.PriorityLevel}
                      </span>
                    </div>
                  </div>

                  <div
                    className={
                      'row ' +
                      (serverData.checkCollaboration &&
                      serverData.checkCollaboration.IsAlreadyCommented
                        ? 'mb-3'
                        : '')
                    }
                  >
                    <div className='col-3'>
                      <b>Project Files</b>
                    </div>
                    <div className='col-9'>
                      {serverData.requestdata.RequestAttachments &&
                        serverData.requestdata.RequestAttachments.map(
                          (attachment) => {
                            return (
                              <a
                                className='link ms-2'
                                href={filePickerService.getDownloadLink(
                                  attachment.FileHandler
                                )}
                              >
                                <div
                                  className={filePickerService.getFileIcon(
                                    attachment.FileType
                                  )}
                                ></div>
                                <span className='ms-2'>
                                  {attachment.FileName}
                                </span>
                              </a>
                            )
                          }
                        )}
                    </div>
                  </div>
                  {serverData.checkCollaboration &&
                    serverData.checkCollaboration.IsAlreadyCommented && (
                      <>
                        <div className='row'>
                          <div className='col-3'>
                            <b>My Comment</b>
                          </div>
                          <div className='col-6'>
                            {
                              serverData.checkCollaboration.RequestComment
                                .CollaborationRequestComment
                            }
                          </div>
                          <div className='col-3'>
                            <div className='text-end'>
                              <button
                                className='btn text-primary btn-sm'
                                onClick={() => {
                                  openCommentForm(
                                    serverData.checkCollaboration.RequestComment
                                      .CollaborationRequestCommentId
                                  )
                                }}
                              >
                                <i className='fas fa-pen'></i>
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className='row'>
                          <div className='col-3'></div>
                          <div className='col-9'>
                            {serverData.checkCollaboration.RequestComment
                              .CollaborationRequestCommentAttachments &&
                              serverData.checkCollaboration.RequestComment.CollaborationRequestCommentAttachments.map(
                                (attachment) => {
                                  return (
                                    <a
                                      className='link ms-2'
                                      href={filePickerService.getDownloadLink(
                                        attachment.FileHandler
                                      )}
                                    >
                                      <div
                                        className={filePickerService.getFileIcon(
                                          attachment.FileType
                                        )}
                                      ></div>
                                      <span className='ms-2'>
                                        {attachment.FileName}
                                      </span>
                                    </a>
                                  )
                                }
                              )}
                          </div>
                        </div>
                      </>
                    )}
                </div>

                <div className='text-end mb-3 mt-3'>
                  <Button
                    className='btn-outline-primary btn-width'
                    onClick={onclose}
                  >
                    Close
                  </Button>
                  {serverData.checkCollaboration &&
                    !serverData.checkCollaboration.IsAlreadyCommented &&
                    userId != serverData.requestdata.CreatedUserId && (
                      <Button
                        className='btn btn-primary btn-width'
                        onClick={() => setIsShow(false)}
                      >
                        Request to Collaborate
                      </Button>
                    )}
                </div>
              </div>
            )
          ) : (
            <>
              <div className='mb-3'>
                <button
                  className='btn btn-primary btn-width'
                  onClick={onCommentClose}
                >
                  back
                </button>
              </div>
              <form key={2} onSubmit={handleSubmit(onSubmit)}>
                <div className='modal-1'>
                  <div className='form-group'>
                    <label htmlFor=''>Request to Collaborate</label>
                    <p>
                      Send a message to th affiliate to let them know you're
                      interested and wouldlike to hear more about the project!
                    </p>
                    <textarea
                      type='text'
                      style={{ minHeight: '150px' }}
                      className='form-control'
                      name='Comment'
                      ref={register({ required: true })}
                    />
                    <ErrorMessage
                      type={errors.Comment && errors.Comment.type}
                    />
                  </div>
                  <div className='form-group'>
                    <MultiFilePicker
                      data={documents}
                      afterUpload={afterDocUploaded}
                      label='Add attachment(s)'
                    />
                  </div>
                  <div className='text-end mb-3 mt-5'>
                    <button type='submit' className='btn btn-primary btn-width'>
                      Send Request
                    </button>
                  </div>
                </div>
              </form>
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  )
}

export default CollaborationsDetailModal
