import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import filePickerService from '../../shared/file-picker/file-picker.service'
import Header from '../Header/Header'
import GlobalFilter from '../ReactTable/GlobalFilter'
import Sidebar from '../Sidebar/Sidebar'
import NoImg from '../../img/noimage.png'
import Sorting from '../ReactTable/Sorting'
import { RequestQueryBuilder } from '@nestjsx/crud-request'
import httpService from '../../shared/http.service'
import Table from '../ReactTable/data-table'

const AffiliatesContacts = (props) => {

  const columns = useMemo(() => COLUMNS, [])
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [pageCount, setPageCount] = useState(0)
  const fetchIdRef = useRef(0)
  let [total, settotal] = useState("")
  const [filter, setFilter] = useState({});
  const [sort, setSort] = useState({});

  let userInfo = JSON.parse(localStorage.getItem('user-info'))
  let userId = userInfo.userId;

  useEffect(() => {
   
  }, [])

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
      httpService.get('affiliate-contacts/' + userId + '/all?' + qb.queryString)
        .then((res) => {
          setData(res.data.data[0]? res.data.data[0].Contacts: [])
          setPageCount(res.data.pageCount)
          setLoading(false)
          settotal(res.data.total)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [])

  return (
    <>
    <Header
        heading="Contacts"
      />

      <div className='main'>
        <div className='siderbar'>
          <Sidebar />
        </div>
        <div className='main-wrapper'>
      <div className='list-container'>
        <div className='row g-0 justify-content-between mb-3'>
          <div className='col'>
            <h2 className='custom-heading'>My Contacts</h2>
          </div>
          <div className='col-auto'>
            <ul className='nav'>
              <li className='nav-item ps-3'>
              <GlobalFilter
                    setGlobalFilter={(value) => { setFilter(value) }}
                    columns={columns}
                  />
              </li>

              <li className='nav-item'>
              <Sorting
                    recentKey='UserId'
                    alphaKey='CompanyName'
                    setSort={(value) => { setSort(value) }} />
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
      </div>
    </>
  )
}

const COLUMNS = [
  {
    Header: 'Comapny Name',
    accessor: "CompanyName",
    Cell: PictureColumn,
    filter: true,
    globalFilterKey: 'Contacts.CompanyName'
  },
  {
    Header: 'Contact Name',
    accessor: "Name",
    filter: true,
    globalFilterKey: 'Contacts.Name'
  },
  {
    Header: 'Contact Email',
    accessor: "Email",
    filter: true,
    globalFilterKey: 'Contacts.Email'
  },
  {
    Header: 'Phone',
    accessor: "PhoneNumber",
    filter: true,
    globalFilterKey: 'Contacts.PhoneNumber'
  },
  {
    Header: 'Location',
    accessor: "Country",
    Cell: LocationColumn,
    filter: true,
    globalFilterKey: 'Contacts.Country'
  },
  {
    Header: 'Address',
    accessor: "Address",
    Cell: AddressColumn,
    filter: true,
    globalFilterKey: 'Contacts.Address'
  },
  {
    Header: 'Actions',
    accessor: "UserId",
    filter: false,
    Cell: ActionColumn,
  }
]

function AddressColumn({ row }) {
  return row.original.Address + ", " + row.original.City + ", " + row.original.State + ", " + row.original.Country;
}

function LocationColumn({ row }) {
  return row.original.Country + ", " + row.original.State;
}

function ActionColumn({ value }) {
  return (<Link
    className='d-grid btn btn-secondary'
    to={`/profile/${value}`}>View Profile</Link>)
}

function PictureColumn({row}) {
  return (<>
    <div className='d-flex'>
    <div className='image-panel'>
      <img
        className='card-img thumbnail-img'
        src={ row.original.ProfilePicture && row.original.ProfilePicture.FileHandler ? filePickerService.getImageLink(
          row.original.ProfilePicture.FileHandler
        ) : NoImg}
      />
    </div>
    <div className='ms-3'>
    <p className='mb-4'>{row.original.CompanyName}</p>
    </div>
    </div>
  </>)
}

export default AffiliatesContacts