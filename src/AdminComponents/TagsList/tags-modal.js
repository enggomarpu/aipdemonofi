import React, { useState } from 'react';
import { Modal, Button, Form, } from 'react-bootstrap';
import HttpService from '../../shared/http.service';
import { useToasts } from "react-toast-notifications";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { ErrorMessage } from '../sharedError/error.messages';

const TagModel = (props) => {

  const apiRoute = 'tag/';
    const { addToast } = useToasts();
    const [tagId, setTagId] = useState(props.tagId);
    const [approved, setApproved] = useState(props.tagId);
    const { register, handleSubmit, errors, reset } = useForm();

    const get = async (tagId) => {
        await HttpService.get(`${apiRoute}${tagId}`).then((res) => {
            if (res && res.data) {
                reset(res.data);
            }
        }).catch((err) => {
            console.log(err);
        });

    }

    const onSubmit = (data) => {
        tagId && tagId > 0 ? onEdit(data) : onAdd(data);
    }

    const onAdd = (data) => {
        HttpService.post(apiRoute, data).then((response) => {
            if (response) {
                addToast("Tag Created Successfully", {
                    appearance: "success",
                });
                props.onHide();
            }
        }).catch(() => {
            console.log('error');
        })
    }

    const onEdit = (data) => {
        HttpService.put(`${apiRoute}${tagId}`, data).then((response) => {
            reset(response.data)
            if (response) {
                addToast("Tag Updated Successfully", {
                    appearance: "success",
                });
                props.onHide();
            }
        }).catch(() => {

        })
    }

    const onDelete = () => {
        if (tagId) {
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!",
            }).then((result) => {
                if (result.isConfirmed) {
                    deleteRecord(tagId);
                }
            });
        }
    }

    const deleteRecord = () => {
        return HttpService.delete(apiRoute + tagId).then((response) => {
            if (response) {
                addToast("Tag Deleted Successfully", {
                    appearance: "success",
                });
                props.onHide();
            }
        }).catch(() => {
            //add alert here!
            console.log('something weired happened');
        });
    }

    const rejectTag = async () => {
      await HttpService.delete(`${apiRoute}${tagId}`).then((response) => {
        if(response){
          addToast("Tag Rejected Successfully", {
            appearance: "success",
          });
            props.onHide();
        }
      }).catch(()=>{
      })
    }

    const approveTag = async () => {
      await HttpService.get(`${apiRoute}admin-approve/${tagId}`).then((response) => {
        if(response){
          addToast("Tag Approved Successfully", {
            appearance: "success",
          });
            props.onHide();
        }
      }).catch(()=>{
      })
    }

    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onShow={() => {
                if (props.tagId && props.tagId > 0) {
                    setTagId(props.tagId)
                    setApproved(props.isApproved)
                    get(props.tagId);
                }
                else{
                  setTagId()
                  setApproved()
                  reset({})
                }
            }}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {tagId && tagId > 0 ? 'Update' : 'Create'} Tag
                </Modal.Title>

            </Modal.Header>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Body>
                    <div className='form-group'>
                        <label> Tag Name </label>
                        <input type='text'
                            className='form-control' name="TagName" ref={register({ required: true })} />
                        <ErrorMessage type={errors.TagName && errors.TagName.type} />

                    </div>

                </Modal.Body>
                <Modal.Footer>
                    {
                        tagId && tagId > 0
                            ?
                            <>
                                <Button type="submit">Save Changes</Button>
                                {!approved ? <>
                                  <Button onClick={approveTag}>Approve Tag</Button>
                                  <Button onClick={rejectTag}>Reject Tag</Button>
                                </> : ''}
                                <Button type="button" onClick={onDelete}>Delete</Button>
                            </>
                            :
                            <Button type="submit">Create</Button>
                    }
                </Modal.Footer>
            </form>
        </Modal>
    );
}
export default TagModel;