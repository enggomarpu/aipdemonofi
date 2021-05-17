// import React, { useEffect, useState } from 'react'
// import Select from 'react-select'
// import { Modal } from 'react-bootstrap'
// //import PlusCircle from '../../../shared/'
// import HttpService from '../../shared/http.service'
// import { useForm } from 'react-hook-form'
// import { ErrorMessage } from '../sharedError/error.messages'
// import FilePickerInline from '../../shared/file-picker-inline/file-picker-inline';
// import { useToasts } from 'react-toast-notifications'
// import SkillAddModel from '../../shared/skill-add-model'

// const CollaborationRequestModal = (props) => {
//   const [skills, setSkills] = useState([])
//   const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
//   const phoneRegex = /^(1|)?(\d{3})(\d{3})(\d{4})$/
//   const [openModal, setOpenModal] = useState(false)
//   const [modalType, setModalType] = useState(false)
//   const [tags, setTags] = useState([])
//   const [options, setOptions] = useState([])
//   const [isValid, setinValid] = useState(false)
//   const [isShow, setShow] = useState(true)
//   const [myDocuments, setDocuments] = useState([])
//   let [data, setData] = useState([])
//   const { addToast } = useToasts()
//   const [selectedCountry, setSelectedCountry] = useState()
//   const [selectedState, setSelectedState] = useState()
//   const [selectedPhone, setselectedPhone] = useState()

//   const { register, handleSubmit, errors, formState } = useForm({
//     mode: 'onBlur',
//   })

//   const {
//     register: register2,
//     handleSubmit: handleSubmit2,
//     errors: errors2,
//     formState: formState2,
//     reset: reset2,
//   } = useForm({
//     mode: 'onBlur',
//   })

//   useEffect(() => {
//     get()
//     getLookup();
//   }, [])

 
//   const onFirstSubmit = async (data) => {
//     if (formState.isValid) {
//       setData(data)
//       setShow(false)
//     }
//   }

//   const getLookup = async (tags) => {
//     await HttpService.get('all-skills')
//       .then((res) => {
//         if (res) {
//           let data = res.data.map((item) => {
//             return {
//               value: item.SkillId,
//               label: item.SkillName,
//             }
//           })
//           setOptions(data)
//           let postTags = tags
//             ? tags
//             : []
//           setTags(postTags)
//         }
//       })
//       .catch((err) => {
//         console.log(err)
//       })
//   }
//   const changeHandler = (option) => {
//     setTags(option)
//   }

//   const createTag = () => {
//     setOpenModal(true)
//     setModalType(1)
//   }
//   const onSecondSubmit = async (formData) => {
//     const { Email, Skills } = formData;
//     data = { ...data, Email };
//     //data = Object.assign(...data, formData);
//     data.skills = formData.Skills;
//     setData(data);
//     data.Documents = myDocuments
//     await HttpService.post('user/create-profile', data)
//       .then((res) => {
//         addToast('Affiliate Created Successfully', {
//           appearance: 'success',
//         })
//         window.location.reload()
//       })
//       .catch((err) => {
//         addToast(err.response.data.message, {
//           appearance: 'error',
//         })
//         console.log(err)
//       })
//   }

//   const get = async () => {
//     await HttpService.get('all-skills')
//       .then(async (res) => {
//         reset2(res.data)
//         setSkills(res.data)
//         console.log('All SKILLLLSSS', res.data)
//       })
//       .catch((err) => {
//         console.log(err)
//       })
//   }
//   const onModalClose = (tag) => {
//     setOpenModal(false)
//     if (tag) {
//       let newTags = [...tags, {value : tag.TagId, label: tag.TagName }]
//       getLookup(newTags);
//     }
//   }

//   const selectCountry = (val) => {
//     setSelectedCountry(val)
//   }

//   const selectRegion = (val) => {
//     setSelectedState(val)
//   }
//   const selectPhone = (val) => {
//     setselectedPhone(val)
//   }

//   const afterDocUploaded = (filedata) => {
//     let attachments = []
//     filedata.map((file) => {
//       attachments.push(file)
//     })
//     setDocuments(attachments)
//   }
  
//   const colourStyles = {
//     control: (styles) => ({ ...styles, backgroundColor: 'white' }),
//     option: (styles, { data, isDisabled }) => {
//     return {
//     ...styles,
//     backgroundColor: isDisabled ? 'gray' : null,
//     color: isDisabled ? 'white' : null,
//     cursor: isDisabled ? 'not-allowed' : 'default',
//     }
//     },
//     }
//   return (
//     <>
//     <Modal
//         {...props}
//         size='lg'
//         aria-labelledby='contained-modal-title-vcenter'
//         centered
//         backdrop='static'
//       >

//       <Modal.Header closeButton>
//           <Modal.Title id='contained-modal-title-vcenter'> Collaboration Request</Modal.Title>
        
//         </Modal.Header>

//       <Modal.Body>
     
//         {isShow ? (
//           <form key={1} onSubmit={handleSubmit(onFirstSubmit)} >
         
//           <p>
//           Fill out the form below in order to submit a post to other
//           affiliates outlining your upcoming project and how other
//           affiliates can help you.
//           </p>
//             <div className='row justify-content-center'>
//                     <div className='col-md-8 col-12'>
//                     <div className='form-group'>
//                         <label> Project Name</label>
//                         <input
//                           type='text'
//                           className='form-control'
//                           name='Name'
//                           placeholder='Name of Project'
//                           ref={register({ required: true })}
//                         />
//                         <ErrorMessage type={errors.Name && errors.Name.type} />
//                       </div>
//                       <div className='form-group'>
//                          <label>Project Timeline</label>
//                          <div className='row'>
//                            <div className='col-md-6'>
//                            <input
//                                className='form-control'
//                                type='date'
//                                placeholder='Start Date'
//                                ref={register({ required: true })}
//                              />
//                            </div>

//                            <div className='col-md-6'>
//                              <input
//                                className='form-control'
//                                type='date'
//                                placeholder='End Date'
//                                ref={register({ required: true })}
//                              />
//                            </div>
//                          </div>
//                          </div>

//                       <label>Related Industury</label>
//                         <div className='form-group'>
//                         <input
//                         className='form-control'
//                         as='textarea'
//                         id='inputTextArea'
//                         name='Industury'
//                         placeholder='Select an industry'
//                         rows={8}
//                         ref={register({
//                         required: true,
//                         })}
//                         />
//                         <ErrorMessage
//                         type={errors.PostContent && errors.PostContent.type}
//                         />
//                         </div>

//                         <div className='form-group'>
//                         <label>Project Detail</label>
//                         <textarea
//                           type='text'
//                           style={{ minHeight: '150px' }}
//                           className='form-control'
//                           name='PostContent'
//                           placeholder='Write bit about your project.What are you seeking?'
//                           ref={register({ required: false })}
//                         />
//                         <ErrorMessage
//                         type={errors.PostContent && errors.PostContent.type}
//                         />
//                       </div>
//                         <div className='form-group' controlId='tags'>
//                         <div className='justify-content-between d-flex mb-2'>
//                         <label className='mb-0 align-self-center'>
//                         Priority Level
//                         </label>
//                         </div>
                        
//                         <Select
//                         isMulti
//                         name='tags'
//                         value={tags}
//                         placeholder='Select a level'
//                         onChange={changeHandler}
//                         options={options}
//                         styles={colourStyles}
//                         ></Select>
//                         </div>
                        
//                         <label className='mr-4'>Step 1 of 2</label>
//                         <button
//                         onClick={props.onHide}
//                         className='btn border btn-block btn-height'>
//                          Cancel
//                          </button>
//                         <button
//                           type='submit'
//                           className='btn btn-primary btn-block btn-height'
//                         >
//                           Next
//                         </button>
//                       </div>
//                   </div>
//           </form>

//         ) : (
//           <form key={2} onSubmit={handleSubmit2(onSecondSubmit)}>
//           <p>
//           Upload images and files related to the project to help affiliates
//           get a better understanding of the project you wish to collaborate
//           on.
//           </p>
//             <div className='form-group'>
//             <label>Upload File and Images</label>
//           </div>
//             <div className='form-group'>
//             <FilePickerInline data={myDocuments} afterUpload={afterDocUploaded} />
//           </div>

//             <div className='form-group'>
//               <label htmlFor=''>Project Tags</label>
//               <p>
//                 Add up to 4 tags that best describe this type of project. This
//                 will help connect you with the right affiliates.
//               </p>
//             </div>
//             <div className='form-group' controlId='tags'>
//             <div className='justify-content-between d-flex mb-2'>
//               <button type='button' className='btn p-0' onClick={createTag}>
//                 {/* <img src={PlusCircle} alt='PlusCircle' /> */}
//               </button>
//             </div>

//             <Select
//               isMulti
//               name='tags'
//               value={tags}
//               onChange={changeHandler}
//               options={tags.length === 4 ? [] : options}
//               noOptionsMessage={() => {
//                 return tags.length === 4 ? 'You have reached the max options value' : 'No options available' ;
//               }}
//             ></Select>
//           </div>

         

//          <div className='form-group'>
//          <label className='mr-4'>Step 2 of 2</label>
//          <button
//          onClick={props.onHide}
//          className='btn border btn-block btn-height'>
//           Cancel
//           </button>
//           <button
//           type='submit'
//           className='btn btn-primary btn-block btn-height'>
//         Submit
//         </button>
//             </div>
//           </form>
//         )}
//       </Modal.Body>
//       </Modal>
//       <SkillAddModel
//       modaltype={modalType}
//       show={openModal}
//       onHide={onModalClose}
//     />
//     </>
//   )
// }

// export default CollaborationRequestModal
