import React, { useEffect, useState } from 'react'
import { environment } from '../constants';
import filePickerService from '../file-picker/file-picker.service';
import ImgIcon from '../../img/image.png'

const MultiImagePicker = (props) => {

    const [btnLabel, setBtnLabel] = useState('');
    const [showPicker, setShowPicker] = useState(false);
    const [btnIcon, setBtnIcon] = useState('');
    const [options, setOptions] = useState({
        accept: 'image/*',
        maxFiles: 500,
        fromSources: ['local_file_system'],
        onClose: () => {
            setShowPicker(false);
        }
    });
    const security = { security: { policy: environment.filePickerApi.policy, signature: environment.filePickerApi.signature } };
    const apiKey = environment.filePickerApi.key;

    const [images, setImages] = useState([]);

    useEffect(() => {
        setImages(props.data ? props.data : []);
        setBtnLabel(props.label ? props.label : '');
        setBtnIcon(props.icon ? props.icon : '');
        setOptions(Object.assign({}, options, props.options ? props.options : {}));
    }, [props]);

    const onUploadDone = (files) => {
        let newImages = [...images];
        files.filesUploaded.map(function (image) {
            var imageAdded = newImages.find(x => x.FileHandler == image.handle);
            if (!imageAdded) {
                newImages.push({
                    FileHandler: image.handle,
                    FileName: image.filename,
                    FileSize: image.size,
                    FileType: image.mimetype,
                    FilePath: image.url,
                });
            }

        });
        setImages(newImages);
        setShowPicker(false)
        props.afterUpload(newImages);
    }

    const remove = (key) => {
        e.preventDefault()
        let newImages = images.slice(0, key);
        setImages(newImages);
        props.afterUpload(newImages);
    }

    return (
        <>
            {showPicker && <PickerOverlay
                apikey={apiKey}
                pickerOptions={options}
                clientOptions={security}
                onSuccess={onUploadDone}
            />}

            <Button className='simple-btn' onClick={() => setShowPicker(true)}>
                <img src={ImgIcon} alt='ImgIcon' />
                {btnLabel}
            </Button>
            {
                images &&
                images.map((image, index) => {
                    return (
                        <div className='btn-panel'>
                            <img
                                src={filePickerService.getSmallImage(image.FileHandler)}
                                alt='Place image title'
                            />
                            <button className="btn text-danger btn-sm" onClick={(e) => remove(index, e)}><i className='fa fa-times'></i></button>
                        </div>
                    );
                })
            }

        </>
    );
}

export default MultiImagePicker;