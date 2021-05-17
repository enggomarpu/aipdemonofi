import { PickerOverlay } from 'filestack-react'
import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { environment } from '../constants'
import filePickerService from '../file-picker/file-picker.service'
import ImageIcon from '../../img/image.png'

const ImagePicker = (props) => {
  const [btnLabel, setBtnLabel] = useState('')
  const [btnIcon, setBtnIcon] = useState('')
  const [showPicker, setShowPicker] = useState(false)
  const [options, setOptions] = useState({
    accept: 'image/*',
    maxFiles: 1,
    fromSources: ['local_file_system'],
    onClose: () => {
      setShowPicker(false)
    },
  })
  const security = {security: {policy: environment.filePickerApi.policy, signature: environment.filePickerApi.signature}};
  const apiKey = environment.filePickerApi.key

  const [image, setImage] = useState({})

  useEffect(() => {
    setImage(props.data ? props.data : {})
    setBtnIcon(props.icon ? props.icon : '')
    setBtnLabel(props.label ? props.label : '')
    setOptions(Object.assign({}, options, props.options ? props.options : {}))
  }, [props])

  const onUploadDone = (files) => {
    let newImage = {}
    if (files.filesUploaded[0].handle !== image.FileHandler) {
      newImage = {
        FileHandler: files.filesUploaded[0].handle,
        FileName: files.filesUploaded[0].filename,
        FileSize: files.filesUploaded[0].size,
        FileType: files.filesUploaded[0].mimetype,
        FilePath: files.filesUploaded[0].url,
      }
    }
    setImage(newImage)
    setShowPicker(false)
    props.afterUpload(newImage)
  }

  const remove = (e) => {
    e.preventDefault()
    setImage({})
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
        />
      )}
      <Button className='simple-btn' onClick={() => setShowPicker(true)}>
        <img src={ImageIcon} alt='ImageIcon' />
        <span>{btnLabel}</span>
      </Button>
      {Object.entries(image).length !== 0 && (
        <>
          <div className='btn-panel'>
            <img
              src={filePickerService.getSmallImage(image.FileHandler)}
              alt='Place image title'
            />
            <button className="btn text-danger btn-sm" onClick={(e) => remove(e)}><i className='fa fa-times'></i></button>
          </div>
        </>
      )}
    </>
  )
}

export default ImagePicker
