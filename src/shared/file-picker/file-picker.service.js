import { environment } from "../constants";

const filestackUrl = 'https://cdn.filestackcontent.com/';


class FilePickerService{

    getPreviewLink(handle){
        return (filestackUrl + 'preview/security=policy:' + environment.filePickerApi.policy + ',signature:' + environment.filePickerApi.signature + '/' + handle);
    }

    getProfileLogo(handle){
        return (filestackUrl + 'resize=height:100,width:100/security=policy:' + environment.filePickerApi.policy + ',signature:' + environment.filePickerApi.signature + '/' + handle);
    }

    getSmallImage(handle){
        return (filestackUrl + 'resize=height:200,width:200/security=policy:' + environment.filePickerApi.policy + ',signature:' + environment.filePickerApi.signature + '/' + handle);
    }

    getVideo(handle){
        return (filestackUrl + 'video_convert=height:200,width:200/security=policy:' + environment.filePickerApi.policy + ',signature:' + environment.filePickerApi.signature + '/' + handle);
    }

    getImageLink(handle){
        return (filestackUrl + handle + '?policy=' + environment.filePickerApi.policy + '&signature=' + environment.filePickerApi.signature);
    }
    getVideoLink(handle){
        return (filestackUrl + handle + '?policy=' + environment.filePickerApi.policy + '&signature=' + environment.filePickerApi.signature);
    }

    getFileIcon(type){
        return ('fa fa-file-' + 
        (type.split('/')[0] === 'image'? 'image-o'
        : type.split('/')[1] === 'msword'? 'word-o'
        : type.split('/')[1] === 'vnd.ms-excel'? 'excel-o'
        : type.split('/')[1] === 'vnd.ms-powerpoint'? 'powerpoint-o'
        : type.split('/')[1] === 'pdf'? 'pdf-o'
        : type.split('/')[0] === 'text'? 'text-o'
        : type.split('/')[0] === 'video'? 'video-o'
        : ''));
    }

    getDownloadLink(handle){
        return (filestackUrl + handle + '?policy=' + environment.filePickerApi.policy + '&signature=' + environment.filePickerApi.signature + '&dl=true') 
    }
  
    getFileName(filename){
        let name = filename.split('.');
        return name[0].substring(0,8) + '.' + name[1];
    }
}

export default new FilePickerService();