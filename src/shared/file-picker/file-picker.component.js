import { Button } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
import { PickerOverlay } from 'filestack-react'
import { environment } from '../constants'
import filePickerService from './file-picker.service'
import DocIcon from '../../img/file.png'

const FilePicker = (props) => {
  const [btnLabel, setBtnLabel] = useState('')
  const [btnIcon, setBtnIcon] = useState('')
  const [showPicker, setShowPicker] = useState(false)
  const [options, setOptions] = useState({
    maxFiles: 1,
    fromSources: ['local_file_system'],
    onClose: () => {
      setShowPicker(false)
    },
  })
  const security = {security: {policy: environment.filePickerApi.policy, signature: environment.filePickerApi.signature}};
  const apiKey = environment.filePickerApi.key

  const [file, setFile] = useState({})

  useEffect(() => {
    setFile(props.data ? props.data : {})
    setBtnLabel(props.label ? props.label : '')
    setBtnIcon(props.icon ? props.icon : '')
    setOptions(Object.assign({}, options, props.options ? props.options : {}))
  }, [props])

  const onUploadDone = (files) => {
    let newFile = {}
    if (files.filesUploaded[0].handle !== file.handle) {
      newFile = {
        FileHandler: files.filesUploaded[0].handle,
        FileName: files.filesUploaded[0].filename,
        FileSize: files.filesUploaded[0].size,
        FileType: files.filesUploaded[0].mimetype,
        FilePath: files.filesUploaded[0].url,
      }
    }
    setFile(newFile)
    setShowPicker(false)
    props.afterUpload(newFile)
  }

  const remove = (e) => {
    e.preventDefault()
    setFile({})
    props.afterUpload({})
  }

  return (
    <>
      {showPicker && (
        <PickerOverlay
          apikey={apiKey}
          pickerOptions={options}
          clientOptions={security}
          onSuccess={onUploadDone}
          className='simple-btn'
        />
      )}

      <Button className='simple-btn' onClick={() => setShowPicker(true)}>
        <img src={DocIcon} alt='imgIcon' />
        {btnLabel}
      </Button>
      {Object.entries(file).length !== 0 && (
        <>
          <div className='btn-panel'>
          <i
                className={filePickerService.getFileIcon(file.FileType)}
              ></i>
            {file.FileName}
            <button className="btn text-danger btn-sm" onClick={(e) => remove(e)}><i className='fa fa-times'></i></button>
          </div>
        </>
      )}
    </>
  )
}

export default FilePicker
