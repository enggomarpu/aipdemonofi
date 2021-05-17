import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import { Modal } from 'react-bootstrap'
import PlusCircle from '../../img/plus-circle.png'
import { useForm, Controller } from 'react-hook-form'
import { ErrorMessage } from '../sharedError/error.messages'
import FilePickerInline from '../../shared/file-picker-inline/file-picker-inline'
import { useToasts } from 'react-toast-notifications'
import { useDispatch, useSelector } from 'react-redux'
import { get, save } from './Collaboration-Request.redux'

const CollaborationRequestModal = (props) => {
  let [data, setData] = useState([])
  const dispatch = useDispatch()
  const serverData = useSelector((state) => state.colab_request.data)
  const funcType = useSelector((state) => state.colab_request.type)
  const errorMessage = useSelector((state) => state.colab_request.errorMessage)
  const [isShow, setShow] = useState(true)
  const [myDocuments, setDocuments] = useState([])
  const { addToast } = useToasts()
  const {
    register,
    handleSubmit,
    errors,
    formState,
    reset,
    control,
    setValue,
  } = useForm()
  const {
    handleSubmit: handleSubmit2,
    register: register2,
    errors: errors2,
    formState: formState2,
    reset: reset2,
    control: control2,
  } = useForm()

  useEffect(() => {
    switch (funcType) {
      case 'colab_request/getSuccess':
        reset(serverData)
        reset2(serverData)
        setDocuments(serverData.RequestAttachments)
        break
      case 'colab_request/saveSuccess':
        addToast('Successfully created a collaboration request', {
          appearance: 'success',
        })
        reset({})
        setDocuments([])
        props.onHide()
        break
      case 'colab_request/error':
        addToast(errorMessage, {
          appearance: 'error',
        })
        break
      default:
        break
    }
  }, [funcType])

  const onFirstSubmit = (data, e) => {
    e.preventDefault()
    setData(data)
    setShow(false)
  }

  const onSecondSubmit = async (formData, e) => {
    e.preventDefault()
    data.PriorityLevel = data.PriorityLevel.value
    let payload = { ...data }
    payload.RequestSkillsIds = []
    formData.RequestSkills.map((item) => {
      payload.RequestSkillsIds.push(item.value)
    })
    payload.RequestAttachments = myDocuments
    dispatch(
      save({
        selectedCollaborationId: props.selectedCollaborationId,
        data: payload,
      })
    )
  }

  const afterDocUploaded = (filedata) => {
    let attachments = []
    filedata.map((file) => {
      attachments.push(file)
    })
    setDocuments(attachments)
  }

  const onModalEntered = () => {
    if (props.selectedCollaborationId) {
      dispatch(get(props.selectedCollaborationId))
    }
  }

  return (
    <>
      <Modal
        {...props}
        size='md'
        aria-labelledby='contained-modal-title-vcenter'
        centered
        onEntered={onModalEntered}
        backdrop='static'
      >
        <Modal.Header closeButton>
          <div>
            <Modal.Title id='contained-modal-title-vcenter'>
              Collaboration Request
            </Modal.Title>
          </div>
        </Modal.Header>

        <Modal.Body>
          {isShow ? (
            <form key={1} onSubmit={handleSubmit(onFirstSubmit)}>
              <p>
                Fill out the form below in order to submit a post to other
                affiliates outlining your upcoming project and how other
                affiliates can help you.
              </p>
              <div className='row'>
                <div className='col-12'>
                  <div className='form-group'>
                    <label> Project Name</label>
                    <input
                      type='text'
                      className='form-control'
                      name='ProjectName'
                      placeholder='Name of Project'
                      ref={register({ required: true })}
                    />
                    <ErrorMessage
                      type={errors.ProjectName && errors.ProjectName.type}
                    />
                  </div>
                  <div className='form-group'>
                    <label>Project Timeline</label>
                    <div className='row'>
                      <div className='col-md-6'>
                        <input
                          className='form-control'
                          name='StartDate'
                          type='date'
                          placeholder='Start Date'
                          ref={register({ required: true })}
                        />
                        <ErrorMessage
                          type={errors.StartDate && errors.StartDate.type}
                        />
                      </div>

                      <div className='col-md-6'>
                        <input
                          className='form-control'
                          name='EndDate'
                          type='date'
                          placeholder='End Date'
                          ref={register({ required: true })}
                        />
                        <ErrorMessage
                          type={errors.EndDate && errors.EndDate.type}
                        />
                      </div>
                    </div>
                  </div>
                  <label>Related Industury</label>
                  <div className='form-group'>
                    <input
                      className='form-control'
                      as='textarea'
                      id='inputTextArea'
                      name='RelatedIndustry'
                      placeholder='Select an industry'
                      rows={8}
                      ref={register({
                        required: true,
                      })}
                    />
                    <ErrorMessage
                      type={
                        errors.RelatedIndustry && errors.RelatedIndustry.type
                      }
                    />
                  </div>
                  <div className='form-group'>
                    <label>Project Detail</label>
                    <textarea
                      type='text'
                      style={{ minHeight: '150px' }}
                      className='form-control'
                      name='ProjectDetails'
                      placeholder='Write bit about your project.What are you seeking?'
                      ref={register({ required: true })}
                    />
                    <ErrorMessage
                      type={errors.ProjectDetails && errors.ProjectDetails.type}
                    />
                  </div>
                  <div className='form-group' controlId='PriorityLevel'>
                    <div className='justify-content-between d-flex mb-2'>
                      <label className='mb-0 align-self-center'>
                        Priority Level
                      </label>
                    </div>
                    <Controller
                      control={control}
                      name='PriorityLevel'
                      ref={register({ required: true })}
                      render={(props) => (
                        <Select
                          value={props.value}
                          onChange={(e) => {
                            props.onChange(e)
                          }}
                          isClearable
                          options={serverData.priorityOptions}
                        />
                      )}
                    />
                    <ErrorMessage
                      type={errors.PriorityLevel && errors.PriorityLevel.type}
                    />
                  </div>
                  <div className='mt-4 d-flex justify-content-between'>
                    <label className='mr-4 align-self-center'>
                      Step 1 of 2
                    </label>
                    <div>
                      <button
                        onClick={props.onHide}
                        className='btn btn-outline-primary btn-width'
                      >
                        Cancel
                      </button>
                      <button
                        type='submit'
                        className='btn btn-primary btn-block  btn-width'
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <form key={2} onSubmit={handleSubmit2(onSecondSubmit)}>
              <div className='mb-3'>
                <button
                  className='btn btn-primary btn-block  btn-width'
                  onClick={() => setShow(true)}
                >
                  back
                </button>
              </div>
              <p>
                Upload images and files related to the project to help
                affiliates get a better understanding of the project you wish to
                collaborate on.
              </p>
              <div className='form-group'>
                <label>Upload File and Images</label>
              </div>
              <div className='form-group'>
                <FilePickerInline
                  data={myDocuments}
                  afterUpload={afterDocUploaded}
                />
              </div>
              <div className='form-group'>
                <label htmlFor=''>Project Tags</label>
                <p>
                  Add up to 4 tags that best describe this type of project. This
                  will help connect you with the right affiliates.
                </p>
              </div>
              <div className='form-group' controlId='RequestSkills'>
                <Controller
                  control={control2}
                  name='RequestSkills'
                  ref={register2({ required: true })}
                  render={(props) => (
                    <Select
                      isMulti
                      value={props.value}
                      onChange={(e) => {
                        props.onChange(e)
                      }}
                      isClearable
                      options={
                        props.value && props.value.length === 4
                          ? []
                          : serverData.skills
                      }
                      noOptionsMessage={() => {
                        return props.value && props.value.length === 4
                          ? 'You have reached the max options value'
                          : 'No options available'
                      }}
                    />
                  )}
                />
                <ErrorMessage
                  type={errors.RequestSkills && errors.RequestSkills.type}
                />
              </div>
              <div className='d-flex justify-content-between mt-4'>
                <label className='mb-0 align-self-center'>Step 2 of 2</label>
                <div>
                  <button
                    onClick={props.onHide}
                    className='btn btn-outline-primary btn-width'
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    className='btn btn-primary btn-width btn-block'
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
          )}
        </Modal.Body>
      </Modal>
    </>
  )
}

export default CollaborationRequestModal
