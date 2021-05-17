import { Form, Modal, Button } from 'react-bootstrap';
import React, { useState, useEffect } from 'react'
import MultiFilePicker from "../../../shared/multi-file-picker/multi-file-picker.component";
import httpService from '../../../shared/http.service';
import { useToasts } from 'react-toast-notifications';
import FilePickerInline from '../../../shared/file-picker-inline/file-picker-inline';

const DocumentModal = (props) => {

  const [userId, setUserId] = useState();
  const [myDocuments, setDocuments] = useState([]);
  const { addToast } = useToasts();

  useEffect(() => {
    setUserId(props.userId)
  }, [props]);

  const afterDocUploaded = (filedata) => {
    let attachments =[];
    filedata.map((file) => {
      attachments.push(file);
    })
    setDocuments(attachments);
  }

  const saveDocuments= async () => {
      if(myDocuments.length > 0){
        let body ={
            AffiliateUserId: userId,
            Documents:myDocuments
          }
          await httpService.post(`user/admin-create-user-document`, body)
          .then((response) => {
            if (response) {
              onClose();
              addToast("Documents Added Successfully", {
                appearance: "success",
              });
            }
          })
          .catch(() => {
            console.log("something weired happened");
          });
      }
  }

  const onClose = () => {
    props.onHide();
    setDocuments([])
  }

  return ( 
        <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Add New Document</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
        <FilePickerInline data={myDocuments} afterUpload={afterDocUploaded} />
          
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={saveDocuments}>Add Documents</Button>
        <Button onClick={onClose}>Cancel</Button>
      </Modal.Footer>
    </Modal>
     );
}
 
export default DocumentModal;