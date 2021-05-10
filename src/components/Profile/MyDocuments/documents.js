import React, { useState, useEffect } from 'react'
import AttachmentPreviewModal from '../../../shared/attachment-preview-modal/attachment-preview-modal';
import httpService from '../../../shared/http.service';
import PlusCircle from '../../../img/plus-circle.png';
import filePickerService from '../../../shared/file-picker/file-picker.service';

const documentsfile = () => {

  const [userDocuments, setuserDocuments] = useState([]);
  const [openModel, setOpenModel] = useState(false)
  const [fileHandle, setFileHandle] = useState(false)

  useEffect(() => {
    get();
  }, []);

  const get = async () => {
    await httpService.get('user/my-documents').then((res) => {
      if (res) {
        setuserDocuments(res.data);
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  return (
    <>
      <div className='card custom-card'>
        <div className='card-header d-flex justify-content-between'>
          <h5 className='card-title align-self-center'>Documents</h5>
        </div>

        <div className='card-body p-0'>

          <ul className='accounts-list'>
            {userDocuments.map((result) => {
              return (
                <li>
                  <div className='d-flex justify-content-between' key={result.Document.AttachmentId}>
                    <div className='align-self-center'>
                    <a href={filePickerService.getDownloadLink(result.Document.FileHandler)}>
                      <div
                        className={filePickerService.getFileIcon(result.Document.FileType)}
                      ></div>
                      <span className='ms-2'>{result.Document.FileName}</span>
                    </a>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
      <AttachmentPreviewModal
        show={openModel}
        fileHandle={fileHandle}
        onHide={() => setOpenModel(false)}
      />
    </>
  )
}

export default documentsfile
