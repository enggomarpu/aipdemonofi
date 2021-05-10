import { PickerDropPane } from 'filestack-react';
import React, { useEffect, useState } from 'react'
import { environment } from '../constants';
import filePickerService from '../file-picker/file-picker.service'



const FilePickerInline = (props) => {
  const [options, setOptions] = useState({
    displayMode: 'dropPane',
    container: '#inline',
    maxFiles: 500,
    fromSources: ['local_file_system'],
    onClose: () => {
      localStorage.removeItem('inline-files')
    },
  })
  const security = { security: { policy: environment.filePickerApi.policy, signature: environment.filePickerApi.signature } };
  const apiKey = environment.filePickerApi.key
  const [files, setFiles] = useState([])

  useEffect(() => {
    setFiles(props.data ? props.data : [])
    setOptions(Object.assign({}, options, props.options ? props.options : {}))
  }, [props])


  const onUploadDone = (fileData) => {
    let oldfiles = localStorage.getItem('inline-files')
      ? JSON.parse(localStorage.getItem('inline-files'))
      : []
    let newFiles = [...oldfiles]
    fileData.filesUploaded.map(function (file) {
      var fileAdded = newFiles.find((x) => x.FileHandler == file.handle)
      if (!fileAdded) {
        newFiles.push({
          FileHandler: file.handle,
          FileName: file.filename,
          FileSize: file.size,
          FileType: file.mimetype,
          FilePath: file.url,
        })
      }

    })
    setFiles(newFiles)
    localStorage.setItem('inline-files', JSON.stringify(newFiles))
    props.afterUpload(newFiles)
  }

  const remove = (key, e) => {
    e.preventDefault();
    let newFiles = files.slice(0, key);
    setFiles(newFiles);
    localStorage.setItem('inline-files', JSON.stringify(newFiles))
    props.afterUpload(newFiles)
  }

  return (
    <>
      <PickerDropPane
        apikey={apiKey}
        pickerOptions={options}
        clientOptions={security}
        onSuccess={onUploadDone}
      />
      <div id='inline' className='dropPane'></div>
      {files &&
        files.map((file, index) => {
          return (
            <div className='btn-panel'>
              <i
                className={filePickerService.getFileIcon(file.FileType)}
              ></i>
              {file.FileName}
              <button className="btn text-danger btn-sm" onClick={(e) => remove(index, e)}><i className='fa fa-times'></i></button>
            </div>
          )
        })}
    </>
  )
}


export default FilePickerInline
