import { PickerOverlay } from 'filestack-react'
import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { environment } from '../constants'
import filePickerService from '../file-picker/file-picker.service'
import ImgIcon from '../../img/video.png'

const VideoPicker = (props) => {
  const [btnLabel, setBtnLabel] = useState('')
  const [btnIcon, setBtnIcon] = useState('')
  const [showPicker, setShowPicker] = useState(false)
  const [options, setOptions] = useState({
    accept: 'video/*',
    maxFiles: 1,
    fromSources: ['local_file_system'],
    onClose: () => {
      setShowPicker(false)
    },
  })
  const security = { security: { policy: environment.filePickerApi.policy, signature: environment.filePickerApi.signature } };
  const apiKey = environment.filePickerApi.key

  const [video, setVideo] = useState({})

  useEffect(() => {
    setVideo(props.data ? props.data : {})
    setBtnIcon(props.icon ? props.icon : '')
    setBtnLabel(props.label ? props.label : '')
    setOptions(Object.assign({}, options, props.options ? props.options : {}))
  }, [props])

  const onUploadDone = (files) => {
    let newVideo = {}
    if (files.filesUploaded[0].handle !== video.FileHandler) {
      newVideo = {
        FileHandler: files.filesUploaded[0].handle,
        FileName: files.filesUploaded[0].filename,
        FileSize: files.filesUploaded[0].size,
        FileType: files.filesUploaded[0].mimetype,
        FilePath: files.filesUploaded[0].url,
      }
    }
    setVideo(newVideo)
    setShowPicker(false)
    props.afterUpload(newVideo)
  }

  const remove = () => {
    setVideo({})
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
        <img src={ImgIcon} alt='ImgIcon' />
        {btnLabel}
      </Button>
      {Object.entries(video).length !== 0 && (
        <>
          <div className='btn-panel'>
          <i className={filePickerService.getFileIcon(video.FileHandler)}></i>
            {video.FileName}
            <i className='fa fa-times' onClick={() => remove()}></i>
          </div>
        </>
      )}
    </>
  )
}

export default VideoPicker
