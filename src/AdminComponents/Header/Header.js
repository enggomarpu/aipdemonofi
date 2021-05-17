import React, { useState, useEffect } from 'react'
import Logo from '../../img/logo.png'
import { useHistory } from 'react-router-dom'
import UserProfile from '../../img/carbon_user.png'
import notifications from '../../img/notifications.png'
import { useToasts } from 'react-toast-notifications'
import HttpService from '../../shared/http.service'
import { Link } from 'react-router-dom'
import moment from 'moment'
// import { Event } from 'react-socket-io';
// <Event event='notification' handler={onMessage} />

import './Header.scss'
import ChangePasswordComponent from '../authentication/change-password/change-password.component'

const Header = (props) => {
  const history = useHistory()
  const { addToast } = useToasts()
  const user = JSON.parse(localStorage.getItem('user-info'))
  const [openModel, setOpenModel] = useState(false)
  const isRefresh = false;
  //const [isRefresh, setIsRefresh] = useState(false)
  const [notificationsMessage, setNotificationsMessage] = useState([])

  if (!user) {
    addToast('Please log in first!', { appearance: 'error' })
    history.push('/')
  }

  useEffect(() => {
    get();
  }, [isRefresh])

  const get = async () => {
    await HttpService.get('notifications/top')
      .then((res) => {
        setNotificationsMessage(res.data)
      })
      .catch((err) => {
        console.error('Api Call Error', err)
      })
  }

  const logout = () => {
    props.setIsLoggedIn(false);
    localStorage.removeItem('user-info');
    history.push('/');
    window.location.reload();
  }

  return (
    <>
      <div className='header'>
        <nav className='navbar navbar-expand-lg'>
          <div className='navbar-brand'>
            <div className='header-logo'>
              <img src={Logo} alt='Logo' className='img-fluid' />
            </div>
          </div>
          <button
            className='navbar-toggler'
            type='button'
            data-bs-toggle='collapse'
            data-bs-target='#navbarText'
            aria-controls='navbarText'
            aria-expanded='false'
            aria-label='Toggle navigation'
          >
            <span className='navbar-toggler-icon' />
          </button>
          <h2>{props.heading}</h2>
          <div className='collapse navbar-collapse' id='navbarText'>
            <form className='d-flex ms-auto'>
              {/* <div className='input-group search-group'>
                <button className='btn btn-outline-secondary' type='submit'>
                  <i className='fas fa-search' />
                </button>
                <input
                  className='form-control'
                  type='search'
                  placeholder='Search'
                  aria-label='Search'
                />
              </div> */}

              <div className='nav-item dropdown notification-dropdown'>
                <Link
                  className='nav-link dropdown-toggle'
                  to=''
                  id='navbarDarkDropdownMenuLink'
                  role='button'
                  data-bs-toggle='dropdown'
                  aria-expanded='false'
                >
                  <img src={notifications} alt='UserProfile' />
                </Link>
                <div
                  className='dropdown-menu notify-drop dropdown-menu-dark'
                  aria-labelledby='navbarDarkDropdownMenuLink'
                >
                  <div className='notify-drop-title justify-content-between'>
                    <h3>Notifications</h3>
                    <Link
                      to="/notifications"
                      className='rIcon allRead'
                      data-tooltip='tooltip'
                      data-placement='bottom'
                      title='tümü okundu.'
                    >
                      View all
                    </Link>
                  </div>
                  <div className='drop-content'>
                    {notificationsMessage.map((result, index) => {
                      return (
                        <>
                          <div className='drop-body unread'>
                            <div className='notify-content'>
                              <h4>{result.notification.NotificationTitle}</h4>
                              <p>{result.notification.NotificationContent}</p>
                            </div>
                            <div className='notify-time'>
                              <p className='time'>
                                {moment(result.notification.CreatedDate).fromNow()}
                              </p>
                            </div>
                          </div>
                        </>
                      )
                    })}
                  </div>
                </div>
              </div>
            </form>
            <ul className='navbar-nav mb-2 mb-lg-0'>
              <li className='nav-item'>
                <img src={UserProfile} alt='UserProfile' />
              </li>
              <li className='nav-item dropdown'>
                <a
                  className='nav-link dropdown-toggle'
                  href='/'
                  id='navbarDropdown'
                  role='button'
                  data-bs-toggle='dropdown'
                  aria-expanded='false'
                >
                  <strong className='d-block'>{user && user.companyName}</strong>
                  <small>{user && user.name}</small>
                </a>
                <ul className='dropdown-menu' aria-labelledby='navbarDropdown'>
                  {/* <li>
                    <Link className='dropdown-item' to='#'>
                      My Profile
                    </Link>
                  </li> */}
                  <li>
                    <Link className='dropdown-item' to='/Affiliates/affiliateslist'>
                      Affiliates List
                    </Link>
                  </li>
                  <li>
                    <button
                      className='dropdown-item'
                      onClick={() => {
                        setOpenModel(true)
                      }}
                    >
                      Change Password
                    </button>
                  </li>
                  <li>
                    <hr className='dropdown-divider' />
                  </li>
                  <li>
                    <button className='dropdown-item' onClick={logout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      <ChangePasswordComponent
        show={openModel}
        onHide={() => {
          setOpenModel(false)
        }}
      />
    </>
  )
}

export default Header
