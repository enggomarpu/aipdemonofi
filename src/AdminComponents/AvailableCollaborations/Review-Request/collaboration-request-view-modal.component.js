import { Modal } from 'react-bootstrap'
import React, { useEffect, useState, lazy } from 'react'
import Icon from '../../../img/icon.png'
import SaveIcon from '../../../img/save.png'
import ShareIcon from '../../../img/share-icon.png'
import { useDispatch, useSelector } from 'react-redux'
import { getCollaboration } from '../Collaboration-List/collaboration-list.reducer'
import filePickerService from '../../../shared/file-picker/file-picker.service'
import Moment from 'moment'
import { store } from '../../../App'

const ViewComments = lazy(() =>
  import('./request-view.module').then((module) => {
    store.injectReducer('collaborationViewRequest', module.default.reducer)
    store.injectSaga('collaborationViewRequest', module.default.saga)
    return import('./collaboration-comment.component')
  })
)
const CollaborationsRequestViewModal = (props) => {
  const dispatch = useDispatch()

  const CollabationRequestState = useSelector((state) => state.collaborationlist)
  const CollabationRequestData = CollabationRequestState && CollabationRequestState.CollabationRequestData;

  const [viewComment, setViewComment] = useState(false)

  // useEffect(() => {
  //   console.log('hello id', props.collabid);
  //   dispatch(
  //     getCollaboration({
  //       CollaborationRequestId: props.collabid,
  //     })
  //   )
  // }, [])

  const modalLoaded = () => {
     console.log('hello id', props.collabid);
     dispatch(getCollaboration({CollaborationRequestId:props.collabid,}))
  }
  const openComments = () => {
    setViewComment(true)
  }
  return (
    <>
      <Modal
        {...props}
        size='lg'
        aria-labelledby='contained-modal-title-vcenter'
        centered
        onEntered={modalLoaded}
      >
        <Modal.Header closeButton className='border-0 pb-0'>
          <div className='col post-info d-flex align-self-center'>
            <div className='userprofile align-self-center'></div>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className='modal-1'>
            <div className='row mb-4'>
              <div className='col'>
                <h1>
                  {(CollabationRequestData && CollabationRequestData.StartedByUser &&
                        CollabationRequestData.StartedByUser.ProfilePicture)  && 
                  <img
                    src={filePickerService.getProfileLogo(
                      CollabationRequestData.StartedByUser
                        .ProfilePicture.FileHandler
                    )}
                    alt=''
                    className='rounded-circle'
                  />
                  }
                  {CollabationRequestData && CollabationRequestData.ProjectName}
                </h1>
              </div>
              {/* <div className='col-auto align-self-center'>
                <a className='link'>
                  <img src={SaveIcon} alt='' />
                  Save post
                </a>
                <a className='link ms-3'>
                  <img src={ShareIcon} alt='' />
                  Share post
                </a>
              </div> */}
            </div>

            <div className='checkbox-group mb-3'>
              {CollabationRequestData && CollabationRequestData.RequestSkills &&
                CollabationRequestData.RequestSkills.map((skill, index) => {
                  return (
                    <span key={index} className='btn btn-primary'>
                      {skill.SkillName &&
                        skill.SkillName +
                          (CollabationRequestData.RequestSkills.length - 1 >
                          index
                            ? ' '
                            : '')}
                    </span>
                  )
                })}
            </div>

            <div className='custom-list'>
              <div className='row mb-3'>
                <div className='col-3'>
                  <b>Project Name</b>
                </div>
                <div className='col-9'>
                  {CollabationRequestData && CollabationRequestData.ProjectName}
                </div>
              </div>

              <div className='row mb-3'>
                <div className='col-3'>
                  <b>Project Timeline</b>
                </div>
                <div className='col-9'>
                  {Moment(CollabationRequestData && CollabationRequestData.StartDate).format(
                    'DD-MM-YYYY'
                  )}{' '}
                  -{' '}
                  {Moment(CollabationRequestData && CollabationRequestData.EndDate).format('DD-MM-YYYY')}
                </div>
              </div>

              <div className='row mb-3'>
                <div className='col-3'>
                  <b>Related Industry</b>
                </div>
                <div className='col-9'>
                  {CollabationRequestData && CollabationRequestData.RelatedIndustry}{' '}
                </div>
              </div>

              <div className='row mb-3'>
                <div className='col-3'>
                  <b>Project Details</b>
                </div>
                <div className='col-9'>
                  {CollabationRequestData && CollabationRequestData.ProjectDetails}
                </div>
              </div>

              <div className='row mb-3'>
                <div className='col-3'>
                  <b>Priority Level</b>
                </div>
                <div className='col-9'>
                  <span className='text-danger'>
                    {CollabationRequestData && CollabationRequestData.PriorityLevel}
                  </span>
                </div>
              </div>
              {CollabationRequestData && CollabationRequestData.StartedWithUser !== null &&       
              <div className='row mb-3'>
                <div className='col-3'>
                  <b>Partnered Affiliate</b>
                </div>
                <div className='col-9'>
                  
                  {CollabationRequestData && CollabationRequestData.StartedWithUser && CollabationRequestData.StartedWithUser.CompanyName}
                  
                </div>
              </div>}

              <div className='row mb-3'>
                <div className='col-3'>
                  <b>Project Files</b>
                </div>
                <div className='col-9'>

                <div className='row'>
                {CollabationRequestData && CollabationRequestData.RequestAttachments &&
                    CollabationRequestData.RequestAttachments.map(
                      (attachment) => {
                        return (
                          <div className='col-6'>
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
                            <span className='ms-2'>{filePickerService.getFileName(
                                attachment.FileName
                              )}</span>
                          </a>
                          </div>
                        )
                      }
                    )}
                </div>
                </div>
              </div>
             
              {CollabationRequestData && CollabationRequestData.StartCollaborationDate && 
                  <div className='row mb-3'>
                    <div className='col-3'>
                      <b>Started Date</b>
                    </div>
                    <div className='col-9'>
                    {Moment(CollabationRequestData && CollabationRequestData.StartCollaborationDate).format(
                    'DD-MM-YYYY'
                    )}
                    </div>
                  </div>
              }
             
              {CollabationRequestData && CollabationRequestData.StatusDate && 
                  <div className='row mb-3'>
                    <div className='col-3'>
                      <b>Completed/Cancelled Date</b>
                    </div>
                    <div className='col-9'>
                    {Moment(CollabationRequestData.StatusDate).format(
                    'DD-MM-YYYY'
                    )}
                    </div>
                  </div>
              }
            
              <div className='row mb-3'>
                <div className='col-5'>
                  <button
                    className='link underline btn p-0'
                    onClick={() => openComments()}
                  >
                    View Comments
                  </button>
                </div>
              </div>

            </div>
            {/* <div className='text-end mb-3 mt-5'>
              <button className='btn btn-primary btn-width'>Close</button>
            </div> */}
          </div>
        </Modal.Body>
      </Modal>
      <ViewComments
        show={viewComment}
        postselectid={props.CollabId}
        onHide={() => {
          setViewComment(false)
        }}
        onPrevHide={props.onHide}
      />
    </>
  )
}

export default CollaborationsRequestViewModal
