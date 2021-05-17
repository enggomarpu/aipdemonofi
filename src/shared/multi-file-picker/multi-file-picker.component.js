import { PickerOverlay } from 'filestack-react'
import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { environment } from '../constants'
import filePickerService from '../file-picker/file-picker.service'
import DocIcon from '../../img/file.png'

const MultiFilePicker = (props) => {
  const [btnLabel, setBtnLabel] = useState('')
  const [btnIcon, setBtnIcon] = useState('')
  const [showPicker, setShowPicker] = useState(false)
  const [options, setOptions] = useState({
    maxFiles: 500,
    fromSources: ['local_file_system'],
    onClose: () => {
      setShowPicker(false)
    },
  })
  const security = { security: { policy: environment.filePickerApi.policy, signature: environment.filePickerApi.signature } };
  const apiKey = environment.filePickerApi.key

  const [files, setFiles] = useState([])

  useEffect(() => {
    setFiles(props.data ? props.data : [])
    setBtnLabel(props.label ? props.label : '')
    setBtnIcon(props.icon ? props.icon : '')
    setOptions(Object.assign({}, options, props.options ? props.options : {}))
  }, [props])

  const onUploadDone = (fileData) => {
    let newFiles = [...files]
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
    setShowPicker(false)
    props.afterUpload(newFiles)
  }

  const remove = (key, e) => {
    e.preventDefault();
    let newFiles = files.slice(0, key);
    setFiles(newFiles);
    props.afterUpload(newFiles)
  }

  return (
    <>
      {showPicker && (
        <PickerOverlay
          apikey={apiKey}
          pickerOptions={options}
          clientOptions={security}
          onSuccess={onUploadDone}
        />
      )}

      <Button className='simple-btn' onClick={() => setShowPicker(true)}>
        <img src={DocIcon} alt='ImageIcon' />
        <span>{btnLabel}</span>
      </Button>
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

export default MultiFilePicker
