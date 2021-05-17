import React, { useEffect, useState } from 'react'
import httpService from '../../shared/http.service';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import PlusCircle from '../../img/plus-circle.png'
import { format } from 'date-fns';
import TagModel from './tags-modal';

const TagsList = () => {
    const [tags, setPTags] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [tagId, setTagId] = useState({});
    const [isApproved, setIsApproved] = useState({});


    useEffect(() => {
        get();
    }, [openModal]);

    const get = async () => {
        await httpService.get('tag/admin').then(async (res) => {
            if (res) {
                setPTags(res.data);
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    const createTag = () => {
        setTagId();
        setIsApproved();
        setOpenModal(true);
    }

    const editTag = (id, isApproved) => {
        setTagId(id);
        setIsApproved(isApproved);
        setOpenModal(true);
    }

    return (
        <>
            <Header
                heading="Tags"
            />
            <div className='main'>
                <div className='siderbar'>
                    <Sidebar />
                </div>
                <div className='main-wrapper'>
                    <div className='card custom-card'>
                        <div className='card-header d-flex justify-content-between mb-3'>
                            <h5 className='card-title align-self-center'>Tags</h5>
                            <div className='header-button align-self-center'>
                                <label>
                                    Add Tag
                                            <button
                                        type='button'
                                        className='btn p-1 ms-1'
                                        onClick={createTag}

                                    >
                                        <img src={PlusCircle} alt='PlusCircle' />
                                    </button>
                                </label>
                            </div>
                        </div>

                        <div className='card-body'>
                            <div className='table-responsive'>
                                <table className='table'>
                                    <thead>
                                        <tr>

                                            <th scope='col'>Tag Name</th>
                                            <th scope='col'>Created Date</th>
                                            <th scope='col'>Status</th>
                                            <th scope='col'>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tags && tags.map((tag) => {
                                            return (
                                                <tr >

                                                    <td style={{ textAlign: "center" }}>{tag.TagName}</td>

                                                    <td style={{ textAlign: "center" }}>{format(new Date(tag.CreatedDate), 'yyyy-MM-dd')}</td>
                                                    <td style={{ textAlign: "center" }}>{tag.IsApproved? "Approved": "Pending"}</td>
                                                    <td>
                                                        <div className='dropdown d-inline-block'>
                                                            <button
                                                                className='btn'
                                                                type='button'
                                                                id='dropdownMenuButton1'
                                                                data-bs-toggle='dropdown'
                                                                aria-expanded='false'
                                                            >
                                                                <i className='fas fa-ellipsis-v'></i>
                                                            </button>
                                                            <ul
                                                                className='dropdown-menu'
                                                                aria-labelledby='dropdownMenuButton1'
                                                            >
                                                                <li>
                                                                    <button className='dropdown-item' onClick={() => editTag(tag.TagId)}>
                                                                        Update Tag
                                                                    </button>
                                                                </li>
                                                            </ul>

                                                        </div>
                                                    </td>
                                                </tr>
                                            )

                                        })}


                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <TagModel
            show={openModal}
            tagId= {tagId}
            isApproved = {isApproved}
            onHide={() => setOpenModal(false)}
            />
        </>

    )
}

export default TagsList;