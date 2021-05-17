import React, { useState, useEffect } from 'react'
import httpService from '../../../shared/http.service'
import PlusCircle from '../../../img/plus-circle.png'
import DocumentModal from './document-modal'
import { useToasts } from 'react-toast-notifications'
import filePickerService from '../../../shared/file-picker/file-picker.service'
import Swal from 'sweetalert2'

const documentsfile = (props) => {
  const [userDocuments, setuserDocuments] = useState([])
  const [openDocModel, setOpenDocModel] = useState(false)
  const [userId, setUserId] = useState()
  const { addToast } = useToasts()

  useEffect(() => {
    get()
    setUserId(props.userId)
  }, [props, openDocModel])

  const get = async () => {
    await httpService
      .get(`user/profile/${props.userId}`)
      .then((res) => {
        if (res) {
          setuserDocuments(res.data.MyDocuments)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const onDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteRecord(id)
      }
    })
  }

  const deleteRecord = (id) => {
    return httpService.get('user/admin-delete-user-document/' + id)
      .then((response) => {
        if (response) {
          addToast('Document Deleted Successfully', {
            appearance: 'success',
          })
          get()
        }
      })
      .catch(() => {
        //add alert here!
        console.log('something weired happened')
      })
  }

  return (
    <>
      <div className='card custom-card'>
        <div className='card-header d-flex justify-content-between'>
          <h5 className='card-title align-self-center'>Documents</h5>
          <div className='header-button align-self-center'>
            <label>
              Add new document
              <button
                type='button'
                className='btn p-1 ms-1'
                onClick={() => setOpenDocModel(true)}
              >
                <img src={PlusCircle} alt='PlusCircle' />
              </button>
            </label>
          </div>
        </div>

        <div className='card-body p-0'>
          <ul className='accounts-list'>
            {userDocuments.map((result, index) => {
              return (
                <li key={index}>
                  <div className='row' key={result.Document.AttachmentId}>
                    <div className='align-self-center col-sm-10'>
                    <a style= {{color : "red", textDecoration: "none"}} href={filePickerService.getDownloadLink(result.Document.FileHandler)}>
                      <div
                        className={filePickerService.getFileIcon(result.Document.FileType)}
                      ></div>
                      <span className='ms-2'>{result.Document.FileName}</span>
                    </a>
                    </div>
                    <div className='align-self-center col-sm-auto text-end'>
                      <button
                        className='btn text-danger btn-sm'
                        onClick={() => onDelete(result.UserDocumentId)}
                      >
                        <i className='fa fa-trash'></i>
                      </button>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
      <DocumentModal
        show={openDocModel}
        userId={userId}
        onHide={() => setOpenDocModel(false)}
      />
    </>
  )
}

export default documentsfile
