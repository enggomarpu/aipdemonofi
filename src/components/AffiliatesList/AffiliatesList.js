import React, { useState, lazy, useMemo, useCallback, useRef, useEffect } from 'react'
import './AffiliatesList.scss'
import { store } from '../../App'
import Table from '../ReactTable/data-table';
import httpService from '../../shared/http.service';
import { RequestQueryBuilder } from '@nestjsx/crud-request';
import { Link } from 'react-router-dom';
import GlobalFilter from '../ReactTable/GlobalFilter';
import Sorting from '../ReactTable/Sorting';
import Select from 'react-select';
import NoImg from '../../img/noimage.png'
import filePickerService from '../../shared/file-picker/file-picker.service';
import Star from "../../img/star.png";
import StarFill from '../../img/star-fill.png'
import { useToasts } from 'react-toast-notifications';

const CollaborationRequestModal = lazy(() =>
  import('../Collaboration-Request/Collaboration-Request.module').then(module => {
    store.injectReducer('colab_request', module.default.reducer);
    store.injectSaga('colab_request', module.default.saga);
    return import('../Collaboration-Request/Collaboration-Request.component');
  })
);

const AffiliatesList = (props) => {
console.log('props', props );
  const COLUMNS = [
    {
      Header: "",
      accessor: "IsActive",
      Cell: favColumn,
      filter: false,
    },
    {
      Header: "Affiliate Name",
      accessor: "Name",
      Cell: PictureColumn,
      filter: true,
    },
    {
      Header: "Industry",
      accessor: "Interests",
      Cell: InterestsColumn,
      filter: true,
      globalFilterKey: "Interests.InterestName",
    },
    {
      Header: "Location",
      accessor: "Address",
      filter: true,
    },
    {
      Header: "Skills",
      accessor: "Skills",
      Cell: SkillsColumn,
      filter: true,
      globalFilterKey: "Skills.SkillName",
    },
    {
      Header: "Actions",
      accessor: "UserId",
      filter: false,
      Cell: ActionColumn,
    },
  ];

  const { addToast } = useToasts()
  const columns = useMemo(() => COLUMNS, [])
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [pageCount, setPageCount] = useState(0)
  const fetchIdRef = useRef(0)
  let [total, settotal] = useState("")
  const [allSkills, setAllSkills] = useState([])
  const [allInterests, setAllInterests] = useState([])

  const [skillFilterValue, setSkillFilterValue] = useState({});
  const [skillsValue, setSkillsValue] = useState([]);
  const [interestFilterValue, setInterestFilterValue] = useState({});
  const [interestsValue, setInterestsValue] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false)
  const [globalfilterValue, setGlobalFilterValue] = useState({});
  const [filter, setFilter] = useState({});
  const [sort, setSort] = useState({});

  const [openCollaborationRequestModel, setOpenCollaborationRequestModel] = useState(false);

  useEffect(() => {
    getLookup();
  }, []);

  const getLookup = async () => {
    
    await httpService.get('all-interests').then(async (res) => {
      let data = res.data.map((item) => {
        return {
          value: item.InterestId,
          label: item.InterestName,
        }
      })
      setAllInterests(data)
    })
    await httpService.get('all-skills').then((skillres) => {
      let data = skillres.data.map((item) => {
        return {
          value: item.SkillId,
          label: item.SkillName,
        }
      })
      setAllSkills(data)
    })
  }

  const fetchData = useCallback(({ pageSize, pageIndex, filter, sort }) => {

    // Give this fetch an ID
    const fetchId = ++fetchIdRef.current

    // Set the loading state
    setLoading(true);
    const qb = RequestQueryBuilder.create();

    qb.search(filter)
      .sortBy(sort.field ? sort : { field: 'UserId', order: "DESC" })
      .setLimit(pageSize)
      .setPage(pageIndex + 1)
      .resetCache(true)
      .query();

    if (fetchId === fetchIdRef.current) {
      httpService.get('affiliate-list?' + qb.queryString)
        .then((res) => {
          httpService.get('user/get-contacts').then((contactRes) => {
          res.data.data.Contacts = contactRes.data.Contacts;
          setData(res.data.data)
          setPageCount(res.data.pageCount)
          setLoading(false)
          settotal(res.data.total)
          })
          
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [])

  const handleModelOpen = (event) => {
    event.preventDefault()
    setOpenCollaborationRequestModel(true)
  }

  const search = () => {
    setShowDropdown(false)
    let query = { "$and": [globalfilterValue, skillFilterValue, interestFilterValue] };
    setFilter(query);
  }

  const onSkillsChangeHandler = (skills) => {
    setSkillsValue(skills)
    let query = {};
    if (skills.length > 0) {
      query = { "Skills.SkillId": { "$in": skills.map(skill => skill.value) } }
    }
    setSkillFilterValue(query);
  }

  const onInterestsChangeHandler = (interests) => {
    setInterestsValue(interests)
    let query = {};
    if (interests.length > 0) {
      query = { "Interests.InterestId": { "$in": interests.map(interest => interest.value) } }
    }
    setInterestFilterValue(query)
  }

  const setGlobalFilter = (value) => {
    setGlobalFilterValue(value);
    let query = { "$or": [value, skillFilterValue, interestFilterValue] };
    setFilter(query);
  }

  return (
    <>
      <div className='main-wrapper'>
        <div className='list-container'>
          <div className='row g-0 justify-content-between mb-3'>
            <div className='col'>
              <h2 className='custom-heading'>Affiliates List</h2>
            </div>
            <div className='col-auto'>
              <ul className='nav'>
                <li className='nav-item'>
                  <div className='d-grid'>
                    <button className='btn btn-primary' onClick={(e) => handleModelOpen(e)}>
                      New Collaboration Request
                  </button>
                  </div>
                </li>
                <li className='nav-item ps-3'>
                  <GlobalFilter
                    setGlobalFilter={(value) => { setGlobalFilter(value) }}
                    columns={columns}
                  />
                </li>

                <li className='nav-item'>
                  <Sorting
                    recentKey='UserId'
                    alphaKey='Name'
                    setSort={(value) => { setSort(value) }} />
                </li>
                <li className='nav-item'>
                  <a className='navlink' onClick={() => setShowDropdown(!showDropdown)}>
                    <i className="fas fa-filter">Filter</i>
                  </a>

                  {showDropdown &&
                    <div className='card custom-card filter-box'>
                      <div className='card-header'>Filtration</div>
                      <div className='card-body'>
                        <h3>Industry</h3>
                        <Select
                          name='interest'
                          options={allInterests}
                          value={interestsValue}
                          onChange={(e) => onInterestsChangeHandler(e)}
                          isMulti>
                        </Select>
                        <h3>Skills</h3>
                        <Select
                          name='skill'
                          options={allSkills}
                          value={skillsValue}
                          onChange={(e) => onSkillsChangeHandler(e)}
                          isMulti>
                        </Select>

                        <div className='form-group text-end mb-0 mt-15'>
                          <button className='btn btn-outline-primary' onClick={() => setShowDropdown(false)}>
                            cancel
                              </button>
                          <button className='btn btn-primary' onClick={search}>Update Search</button>
                        </div>
                      </div>
                    </div>

                  }
                </li>
              </ul>
            </div>
          </div>
          <Table
            columns={columns}
            data={data}
            fetchData={fetchData}
            loading={loading}
            pageCount={pageCount}
            total={total}
            filter={filter}
            sort={sort}
          />
        </div>
      </div>

      {openCollaborationRequestModel && <CollaborationRequestModal
        show={openCollaborationRequestModel}
        onHide={() => { setOpenCollaborationRequestModel(false); }}
      />}
    </>
  )
  
  
  function SkillsColumn({ value }) {
    let skills = []
    skills = value.map(v => v.SkillName);
    return skills.join(", ")
  }
  
  function InterestsColumn({ value }) {
    let interests = []
    interests = value.map(v => v.InterestName);
    return interests.join(", ")
  }
  
  function ActionColumn({ value }) {
    return (<Link
      className='d-grid btn btn-secondary'
      to={`/profile/${value}`}>View</Link>)
  }
  
  function PictureColumn({row}) {
    return (
      <>
        <div className="d-flex">
          <div className="image-panel">
            <img
              style={{
                maxHeight: 50,
                maxWidth: 50,
                minWidth: 50,
                minHeight: 50,
              }}
              className="card-img thumbnail-img"
              src={
                row.original.ProfilePicture &&
                row.original.ProfilePicture.FileHandler
                  ? filePickerService.getImageLink(
                      row.original.ProfilePicture.FileHandler
                    )
                  : NoImg
              }
            />
          </div>
          <div className="ms-3">
            <p className="mb-4">{row.original.CompanyName}</p>
          </div>
        </div>
      </>
    );
  }
  
  function favColumn(params) {
    let userContact = params.data.Contacts.find(user => user.UserId == params.row.original.UserId);
    return userContact? (<img
      src={StarFill} onClick={(e) =>
        removeFromContacts(params.row.original.UserId)
      }
    />)
      : <img src={Star} alt="star" onClick={(e) =>
        addToContacts(params.row.original.UserId)
      } />
  }

  function addToContacts(userId) {
    httpService.get('user/add-to-contact/' + userId).then((res) => {
      addToast('Contact added Successfully', {
        appearance: 'success',
      })
      fetchData({ pageSize:10, pageIndex:0, filter:{}, sort:{}})
    })
  }

  function removeFromContacts(userId) {
    httpService.get('user/remove-from-contact/' + userId).then((res) => {
      addToast('Contact removed Successfully', {
        appearance: 'success',
      })
      fetchData({ pageSize:10, pageIndex:0, filter:{}, sort:{}})
    })
  }
}

export default AffiliatesList
