import Nav from '../../components/nav'
import LoginModal from '../../components/loginModal'
import React, {useState, useEffect} from 'react'
import withData from '../withData'
import slugify from 'slugify'
import Categories from '../../utils/categories'
import WorkCategories from '../../utils/workCategories'
import withUser from '../withUser'
import axios from 'axios'
import {API} from '../../config'
import {useRouter} from 'next/router'
import Head from 'next/head'

const Home = ({dataObject, newUser, jobState}) => {
  const router = useRouter()
  
  // console.log(dataObject)
  const [data, setData] = useState(dataObject)
  const [dataLocations, setLocationsData] = useState(dataObject.locations ? dataObject.locations : null)
  const [search, setSearch] = useState('')

  // RIGHT PANEL DATA
  const [selected, setSelected] = useState('')
  const [job, setJob] = useState('')
  const [location, setLocation] = useState('')
  const [position, setPosition] = useState('')
  const [time, setTime] = useState('')
  const [image, setImage] = useState('')
  const [description, setDescription] = useState('')
  const [id, setID] = useState('')

  const [modal, setModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [categorySearch, setCategorySearch] = useState([])
  const [employmentTypeSearch, setEmploymentTypeSearch] = useState([])
  const [locationSearch, setLocationSearch] = useState([])
  const [error, setError] = useState(null)

  // MOBILE RESPONSIVENESS STATES
  const [dropdown, setDropdown] = useState(null)
  const [filters, setFilters] = useState(null)
  const [listContainerSticky, setListContainerSticky] = useState(false)

  // HANDLE SCROLL POSITIONS
  useEffect( () => {
    // console.log(router.query)
    window.addEventListener('scroll', handleScroll);
  }, [])

  const handleScroll = () => {
    const wrappedElement = document.getElementById('list-container');
    // console.log(wrappedElement.getBoundingClientRect().top)
    if(wrappedElement) wrappedElement.getBoundingClientRect().top < 0 ? setListContainerSticky(true) : setListContainerSticky(false)
  }

  const toggle = (key) => {
    dropdown == key ? setDropdown(null) : setDropdown(key)
    key == 'filters' ? setFilters(true) : null
    key == 'closeFilter' ? setFilters(null) : null
  }

  const openJob = (id, position, location) => {
    const slugPosition = slugify(position)
    const slugLocation = slugify(location)

    let jobSelected = data.jobs.filter( (item) => {
      if(item.id == id) return item
    })

    jobState(jobSelected)
    window.localStorage.setItem('data', JSON.stringify(data))
    window.location.href = `job/${id}/${slugPosition}_${slugLocation}`
    // window.location.href = `https://gamesmith.com/job-apply/${id}/${slugPosition}_${slugLocation}`
  }

  const updateSearchList = (e, item, listType) => {
    let el = e.target
    let isActive = el.classList.contains('home-search-form-group-dropdown-group-list-active')
    
    isActive == true ? 
    (
      el.classList.remove('home-search-form-group-dropdown-group-list-active'), 
      listType == 'categories' ? setCategorySearch( prevState => [...categorySearch.filter( remove => remove !== item)]) : null,
      listType == 'employmentType' ? setEmploymentTypeSearch( prevState => employmentTypeSearch.filter(remove => remove !== item)) : null,
      listType == 'locations' ? setLocationSearch( prevState => locationSearch.filter(remove => remove !== item)) : null
    ) 
    : 
    (
      el.classList.add('home-search-form-group-dropdown-group-list-active'), 
      listType == 'categories' ? setCategorySearch( prevState => [...categorySearch, item]) : null,
      listType == 'employmentType' ? setEmploymentTypeSearch( prevState => [...employmentTypeSearch, item]) : null,
      listType == 'locations' ? setLocationSearch( prevState => [...locationSearch, item]) : null
    )
  }

  useEffect(() => {
    if(categorySearch.length > 0) return searchJobs()
    if(employmentTypeSearch.length > 0) return searchJobs()
    if(locationSearch.length > 0) return searchJobs()
  }, [categorySearch, employmentTypeSearch, locationSearch])

  const searchJobs = async (e) => {
    e ? e.preventDefault() : null
    setLoading(true)
    setError(null)
    try {
      const responseSearch = await axios.post(`${API}/jobs/search`, {jobFamily: [...categorySearch], location: [...locationSearch], employment: [...employmentTypeSearch], query: search})
      setData({
        categories: [...dataObject.categories],
        jobs: [...responseSearch.data]
      })
      setLoading(false)
    } catch (error) {
      console.log(error.response? error.response.data : null)
      if(error) error.response? (setError(error.response.data), setLoading(false)) : null
    }
  }
  
  return (
    <>
    <Head>
      <meta property="og:title" content="Discovery platform for the games industry" />
      <meta property="og:description" content="Gamesmith covers everyone working in the industry from accounting to animation, PR to product, development to deployment." />
      <meta property="og:url" content="https://gamesmith.com/" />
      <meta property="og:image" content="https://gamesmith.com/wp-content/uploads/2021/04/G_Vertical.jpg" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@GameSmith_Inc" />
      <meta name="twitter:domain" content="gamesmith.com" />
      <meta name="twitter:title" content="Gamesmith - Discovery platform for the games industry" />
      <meta name="twitter:description" content="Gamesmith covers everyone working in the industry from accounting to animation, PR to product, development to deployment." />
      <meta name="twitter:image" content="https://gamesmith.com/wp-content/uploads/2021/04/G_Vertical.jpg" />
    </Head>
    <Nav setmodal={setModal} newUser={newUser}></Nav>
    <div className="home">
      <div className="home-search-container">
        <div className={`home-search ` + (filters == true ? ' search-appear' : '')}>
          <h1 className="home-search-heading">Find your next great gaming gig at GameSmith</h1>
          {/* TODO: Make search filters mobile friendly */}
          <form className="home-search-form" onSubmit={(e) => searchJobs(e)}>
            <div className="home-search-form-group">
              <svg onClick={searchJobs}><use xlinkHref="sprite.svg#icon-search"></use></svg>
              <input type="text" name="search" placeholder="Search by title or keyword" value={search} onChange={(e) => setSearch(e.target.value)}/>
            </div>
            <div className="home-search-form-mobile-icon" onClick={() => toggle('filters')}><svg><use xlinkHref="sprite.svg#icon-equalizer"></use></svg></div>
            <div className={`home-search-form-group-dropdown` + (filters == true ? ' filters-dropdown' : '')}>
              <div className="home-search-form-group-dropdown-toggle">
                <svg className="home-search-form-group-dropdown-toggle-svg" onClick={() => toggle('closeFilter')}><use xlinkHref="sprite.svg#icon-close"></use></svg>
                <span>Filters</span>
              </div>
              <div className="home-search-form-group-dropdown-group">
                <div onClick={() => toggle(0)}className="home-search-form-group-dropdown-group-container">
                  <svg><use xlinkHref="sprite.svg#icon-location2"></use></svg>
                  <div>Location</div>
                  <svg><use xlinkHref="sprite.svg#icon-chevron-down"></use></svg>
                </div>
                <ul className={`home-search-form-group-dropdown-group-list ` + (dropdown == 0 ? ' dropdown' : null)}>
                  {dataLocations && dataLocations.sort((a, b) => a.value > b.value ? 1 : -1).map( (item, idx) =>
                    // <li className="home-search-form-group-dropdown-group-list-item location-item" key={idx} onClick={(e) => updateSearchList(e, item.location ? item.location.split(',')[2].trim().toUpperCase() : item.location.split(',')[1].trim().toUpperCase() ? item.location.split(',')[1].trim().toUpperCase() : item.location.split(',')[0].trim().toUpperCase(), 'locations')}>{item.value}</li>
                    <li className="home-search-form-group-dropdown-group-list-item location-item" key={idx} onClick={(e) => updateSearchList(e, item.value.toUpperCase(), 'locations')}>{item.value}</li>
                  )
                  }
                </ul>
              </div>
              <div className="home-search-form-group-dropdown-group">
                <div onClick={() => toggle(1)} className="home-search-form-group-dropdown-group-container">
                  <svg><use xlinkHref="sprite.svg#icon-briefcase"></use></svg>
                  <div>Job Category</div>
                  <svg><use xlinkHref="sprite.svg#icon-chevron-down"></use></svg>
                </div>
                <ul className={`home-search-form-group-dropdown-group-list list-border` + (dropdown == 1 ? ' dropdown' : null)}>
                  {/* {data.categories !== undefined && data.categories.map( (category, idx) => 
                    <li key={idx} onClick={() => searchCategory(category)}>{category}</li>
                  )
                  } */}
                  {Categories.map( (category, idx) =>
                    <li className="home-search-form-group-dropdown-group-list-item" key={idx} onClick={(e) => (updateSearchList(e, category.value, 'categories'))}>{category.label}</li>
                  )
                  }
                </ul>
              </div>
              <div className="home-search-form-group-dropdown-group" onClick={() => toggle(2)}>
                <div onClick={() => toggle(2)} className="home-search-form-group-dropdown-group-container">
                  <svg><use xlinkHref="sprite.svg#icon-pen"></use></svg>
                  <div>Employment Type</div>
                  <svg><use xlinkHref="sprite.svg#icon-chevron-down"></use></svg>
                </div>
                <ul className={`home-search-form-group-dropdown-group-list list-border` + (dropdown == 2 ? ' dropdown' : null)}>
                {WorkCategories.map( (type, idx) =>
                    <li className="home-search-form-group-dropdown-group-list-item" key={idx} onClick={(e) => updateSearchList(e, type.value, 'employmentType')}>{type.label}</li>
                  )
                }
                </ul>
              </div>
            </div>
          </form>
        </div>
      </div>
      {loading ? <div className="loading-container"><div className="loading"></div></div> : null}
      {error ? <div className="search-error-container"><div className="search-error">{error}</div></div> : null}
      {!loading && !error &&
      <div className="home-list-container" id="list-container">
        <div className="home-list">
          <div className="home-list-left-container">
            <div className="home-list-left">
              {data && Object.keys(data).length !== 0 && data.jobs.map((item, idx) => 
                <div key={idx} className="home-list-left-box" onClick={() => openJob(item.id, item.role.name, item.location)}>
                  <div className="home-list-left-box-image"><img src={(item.imgUrl ? item.imgUrl : item.company.logo)}  alt="" /></div>
                  <div className="home-list-left-box-description">
                    <img src={(item.company.logo ? item.company.logo : '')} alt="" />
                    <div className="home-list-left-box-description-content">
                      <h3>{item.company ? item.company.name : 'Unknown'}</h3>
                      <h2>{item.role ? item.role.name : 'Unknown'}</h2>
                      <div className="home-list-left-box-description-content-tags">
                        <div className="home-list-left-box-description-content-tags-group">
                          <svg><use xlinkHref="sprite.svg#icon-location2"></use></svg>
                          <span>{item.location ? item.location : 'Unknown'}</span>
                        </div>
                        <div className="home-list-left-box-description-content-tags-group">
                          <svg><use xlinkHref="sprite.svg#icon-briefcase"></use></svg>
                          {WorkCategories.map( (cat, idx) => {
                            return item.workCategories.includes(parseInt(cat.value)) ? <span key={idx}>{cat.label}</span> : false
                          })}
                        </div>
                        <div className="home-list-left-box-description-content-tags-group">
                          <svg><use xlinkHref="sprite.svg#icon-pen"></use></svg>
                          {Categories.map( (cat, idx) => {
                            return item.jobFamilyId == cat.value ? <span key={idx}>{cat.label}</span> : false
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="home-list-left-mobile">
              {data && Object.keys(data).length !== 0 && data.jobs.map((item, idx) =>
                <div key={idx} className="home-list-left-mobile-box" onClick={() => openJob(item.id, item.role.name, item.location)}>
                  <div className="home-list-left-mobile-box-image"><img src={(item.imgUrl ? item.imgUrl : item.company.logo)}  alt="" /></div>
                  <div className="home-list-left-mobile-box-description">
                    <img src={(item.company.logo ? item.company.logo : '')} alt="" />
                    <div className="home-list-left-mobile-box-description-content">
                      <h3>{item.company ? item.company.name : 'Unknown'}</h3>
                      <h2>{item.role ? item.role.name : 'Unknown'}</h2>
                      <div className="home-list-left-mobile-box-description-content-tags">
                        <div className="home-list-left-mobile-box-description-content-tags-group">
                          <svg><use xlinkHref="sprite.svg#icon-location2"></use></svg>
                          <span>{item.location ? item.location : 'Unknown'}</span>
                        </div>
                        <div className="home-list-left-mobile-box-description-content-tags-group">
                          <svg><use xlinkHref="sprite.svg#icon-briefcase"></use></svg>
                          {WorkCategories.map( (cat, idx) => {
                            return item.workCategories.includes(parseInt(cat.value)) ? <span key={idx}>{cat.label}</span> : false
                          })}
                        </div>
                        <div className="home-list-left-mobile-box-description-content-tags-group">
                          <svg><use xlinkHref="sprite.svg#icon-pen"></use></svg>
                          {Categories.map( (cat, idx) => {
                            return item.jobFamilyId == cat.value ? <span key={idx}>{cat.label}</span> : false
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          { selected.length > 0 &&
          <div className={`home-list-selected-container` + (listContainerSticky ? ' home-list-selected-container-sticky' : '')}>
            <div className="home-list-selected" onClick={() => openJob(id, position, location)}>
              <span className="home-list-selected-close" onClick={ (e) => (e.stopPropagation(), setSelected('', setJob(''), setLocation(''), setPosition(''), setTime(''), setImage('')))}></span>
              <h2 className="home-list-selected-title">{selected}</h2>
              <h3 className="home-list-selected-job">{job}</h3>
              <div className="home-list-selected-tags">
                <div className="home-list-selected-tags-group">
                  <svg><use xlinkHref="sprite.svg#icon-location2"></use></svg>
                  <span>{location}</span>
                </div>
                <div className="home-list-selected-tags-group">
                  <svg><use xlinkHref="sprite.svg#icon-briefcase"></use></svg>
                  <span>{position}</span>
                </div>
                <div className="home-list-selected-tags-group">
                  <svg><use xlinkHref="sprite.svg#icon-pen"></use></svg>
                  <span>{time}</span>
                </div>
              </div>
              <img src={`${image}`} alt="" className="home-list-selected-image" />
              <div className="home-list-selected-description">
                <div className="home-list-selected-description-heading">WHY {selected}?</div>
                <div dangerouslySetInnerHTML={ { __html: description } }></div>
              </div>
            </div>
            {newUser == null ? <div className="home-list-selected-button"><button onClick={() => setModal(true)}>Sign In</button></div> : null }
            {newUser !== null ? <div className="home-list-selected-button"><button>Apply</button></div> : null }
          </div>
          }
        </div>
      </div>
      } 
      {modal && <LoginModal setmodal={setModal}/>}
    </div>
    </>
  )
}

export default withUser(withData(Home))
