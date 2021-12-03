import {useEffect, useState} from 'react'
import SVGs from '../files/svgs'
import axios from 'axios'
import {API} from '../config'

const Nav = ({setmodal, newUser}) => {

  const [burgerMenuList, setBurgerMenuList] = useState(false)
  const [user, setUser] = useState(newUser ? JSON.parse(decodeURIComponent(newUser)) : null)
  const [acronym, setAcronym] = useState(newUser ? JSON.parse(decodeURIComponent(newUser)).email.match(/\b(\w)/g) : null)
  const [profileDropdown, setProfileDropdown] = useState(false)
  
  const checkBurgerMenu = () => {
   let el = document.querySelector('.nav-mobile-checkbox')
   el.checked ? setBurgerMenuList(true) : setBurgerMenuList(false)
  }

  const signOut = async () => {
    try {
      const responseSignout = await axios.get(`${API}/auth/signout`)
      window.location.href = '/'
    } catch (error) {
      console.log(error)
    }
  }
  
  return (
    <>
    <div className="nav">
      <div className="nav-left">
        <div className="nav-left-logo" onClick={() => window.location.href = "/"}>
          <SVGs svg={'logo'}/>
          {/* <svg><use xlinkHref="sprite.svg#icon-pacman"></use></svg> */}
          <span>Gamesmith</span>
        </div>
      </div>
      <div className="nav-middle">
        <ul>
          <li className="nav-middle-item" onClick={ () => window.open('https://gamesmith.com/home', '_blank').focus()}>Tribe</li>
          <li className="nav-middle-item" onClick={ () => window.open('https://gamesmith.com/games', '_blank').focus()}>Games</li>
          <li className="nav-middle-item" onClick={ () => window.open('https://gamesmith.com/makers', '_blank').focus()}>Makers</li>
          <li className="nav-middle-item" onClick={ () => window.open('https://gamesmith.com/studios', '_blank').focus()}>Studios</li>
          <li className="nav-middle-item" onClick={() => window.open('/', '_blank').focus() }>Jobs</li>
          <li className="nav-middle-item" onClick={ () => window.open('https://devmap.gamesmith.com/', '_blank').focus()}>Tools</li>
        </ul>
      </div>
      <div className="nav-right">
        {newUser && <><div className="nav-right-button">
            <SVGs svg={'rocket'}/>
            <span>Boost My Score</span>
          </div>
          <div className="nav-right-profile" onClick={() => setProfileDropdown(!profileDropdown)}>
            {/* <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80" alt="Profile Picture"/> */}
            <div className="nav-right-profile-acronym">{acronym.join('')}</div>
            <span>{user.email.toLowerCase()}{profileDropdown ? <svg><use xlinkHref="sprite.svg#icon-cheveron-up"></use></svg> : <svg><use xlinkHref="sprite.svg#icon-chevron-down"></use></svg>}</span>
            <div className={`nav-right-profile-dropdown ` + (profileDropdown ? 'profile-dropdown-display' : '')}>
              <a onClick={signOut}>Sign out</a>
            </div>
          </div>
        </>
        }
        {!newUser && <a className="nav-right-signin" onClick={() => setmodal(true)}>Sign in</a>}
      </div>
    </div>
    <div className="nav-mobile">
      <a href='/' className="nav-mobile-logo">
        <SVGs svg={'logo'}/>
        <span>Gamesmith</span>
      </a>
      {!newUser && <a className="nav-mobile-signin" onClick={() => setmodal(true)}>Sign in</a>}
      {newUser && <a className="nav-mobile-signin" onClick={signOut}>Sign out</a>}
      {/* <div className="nav-mobile-menu">
        <input type="checkbox" className="nav-mobile-checkbox" id="nav-toggle" onClick={checkBurgerMenu}/>
        <label htmlFor="nav-toggle" className="nav-mobile-button">
          <span className="nav-mobile-icon">&nbsp;</span>
        </label>
      </div>
      <ul className={`nav-mobile-list` + (burgerMenuList ? ' burger-menu' : '')}>
        <li className="nav-mobile-list-item">Tribe</li>
        <li className="nav-mobile-list-item">Games</li>
        <li className="nav-mobile-list-item">Makers</li>
        <li className="nav-mobile-list-item">Studios</li>
        <li className="nav-mobile-list-item">Jobs</li>
        <li className="nav-mobile-list-item">Tools</li>
        <li className="nav-mobile-list-item">Messaging</li>
      </ul> */}
    </div>
    </>
  )
}

export default Nav
