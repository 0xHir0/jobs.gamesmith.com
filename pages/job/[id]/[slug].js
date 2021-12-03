import Nav from '../../../components/nav'
import LoginModal from '../../../components/loginModal'
import React, {useState, useEffect} from 'react'
import withData from '../../withData'
import slugify from 'slugify'
import Categories from '../../../utils/categories'
import WorkCategories from '../../../utils/workCategories'
import withUser from '../../withUser'
import axios from 'axios'
import SVGs from '../../../files/svgs'
import {API} from '../../../config'
import {useRouter} from 'next/router'
import {matchWorkCategories} from '../../../utils/match'
import Head from 'next/head'
import absoluteUrl from "next-absolute-url";
import { stripHtml } from "string-strip-html";


const Home = ({dataObject, newUser, jobState, jobPosting, uri}) => {
  const router = useRouter()
  // console.log(dataObject)
  // console.log(jobPosting)
  console.log("jobPosting.jobCardDetails.createdAt:  " + jobPosting.jobCardDetails.createdAt)
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
  const [loading, setLoading] = useState(true)
  const [categorySearch, setCategorySearch] = useState([])
  const [employmentTypeSearch, setEmploymentTypeSearch] = useState([])
  const [locationSearch, setLocationSearch] = useState([])
  const [error, setError] = useState(null)

  // MOBILE RESPONSIVENESS STATES
  const [dropdown, setDropdown] = useState(null)
  const [filters, setFilters] = useState(null)
  const [listContainerSticky, setListContainerSticky] = useState(false)

  var endDateRaw = Date.parse( jobPosting.jobCardDetails.createdAt )
  var validThrough = new Date((endDateRaw) + 2592000000).toISOString()	// 2592000000 is 30 days in milliseconds

  console.log ("endDate:  " + validThrough + "    Raw:  " + endDateRaw)


  // HANDLE SCROLL POSITIONS
  useEffect( () => {
    window.addEventListener('scroll', handleScroll);
  }, [])

  useEffect(() => {
    
    try {
      let local = JSON.parse(window.localStorage.getItem('data')) ? JSON.parse(window.localStorage.getItem('data')) : dataObject
      setData(local)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
    
    setSelected(jobPosting.company ? jobPosting.company.name : 'Unknown');
    setJob(jobPosting.role ? jobPosting.role.name : 'Unknown');
    setLocation(jobPosting.location ? jobPosting.location : 'Unknown'); 
    setPosition(jobPosting.role ? jobPosting.role.name : 'Unknown'); 
    setTime(matchWorkCategories(jobPosting.workCategories));
    setImage(jobPosting.imgUrl ? jobPosting.imgUrl : jobPosting.company.logo);
    setDescription(jobPosting.description);
    setID(jobPosting.id);
  }, [router])

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
    // window.location.href = `jobs/${id}/${slugPosition}_${slugLocation}`
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

  const changeURI = (id, job, location) => {
    setLoading(true)
    window.localStorage.setItem('data', JSON.stringify(data))
    window.location.href = `/job/${id}/${encodeURIComponent(job)}_${(location)}`
  }
  
  return (
    <>
    <Head>
    <meta property="og:site_name" content="Gamesmith | Discovery platform for the games industry" />
		<meta property="og:type" content="website" />
		<meta property="og:title" content={`Gamesmith | ${jobPosting.role.name}`} />
		<meta property="og:description" content={`${jobPosting.description.replace(/\s/g, " ").substring(0,200)}`} />
		<meta property="og:url" content={`${uri}`} />
		<meta property="og:image" content={`${jobPosting.company.logo}`} />
		
		<meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@GameSmith_Inc" />
		<meta name="twitter:domain" content="gamesmith.com" />
		<meta name="twitter:title" content={`Gamesmith | ${jobPosting.role.name}`} />
		<meta name="twitter:description" content={`${jobPosting.description.replace(/\s/g, " ").substring(0,200)}`}/>
		<meta name="twitter:image" content={`${jobPosting.company.logo}`} />
    <script type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(
        {
          "@context": "https://schema.org/",
          "@type" : "JobPosting",
          "title" : `${jobPosting.role.name}`,
          "description" : `${jobPosting.description.replace(/\s/g, " ").substring(0,200)}`,
          "identifier": {
            "@type": "PropertyValue",
            "name": `${jobPosting.company.name}`,
            "value": `${jobPosting.company.id}`
          },
          "datePosted" : `${jobPosting.jobCardDetails.createdAt}`,
          "validThrough" : `${validThrough}`,
          "employmentType" : `${WorkCategories.map((item) => {
            if(jobPosting.workCategories.indexOf(item.id) !== -1) return item.label
          })}`,		// Currently you map these to 'Full-time', 'Remote' etc. Use the same text
          "hiringOrganization" : {
            "@type" : "Organization",
            "name" : `${jobPosting.company.name}`,
            "sameAs" : "", 									// Exclude this
            "logo" : `${jobPosting.company.logo}`
          },
          "jobLocation": {
          "@type": "Place",
            "address": {
            "@type": "PostalAddress",
            "streetAddress": `${jobPosting.address.city ? jobPosting.address.city + ', ' : null }${jobPosting.address.state ? jobPosting.address.state + ', ' : ''}, ${jobPosting.address.country ? jobPosting.address.country + ', ' : ''}`,	// Only include the data point and comma if the variable is populated
            "addressLocality": `${jobPosting.address.city}`,
            "addressRegion": `${jobPosting.address.state}`,
            "postalCode": "",								// Exclude this
            "addressCountry": `${jobPosting.address.country}`
            }
          },
          "baseSalary": {
            "@type": "MonetaryAmount",
            "currency": "USD",
            "value": {
              "@type": "QuantitativeValue",
              "value": "",
              "unitText": ""
            }
          }
        }
      )}}
    />
    </Head>
    <Nav setmodal={setModal} newUser={newUser}></Nav>
    <div className="home">
      <div className="home-search-container">
        <div className={`home-search ` + (filters == true ? ' search-appear' : '')}>
          <h1 className="home-search-heading">Find your next great gaming gig at GameSmith</h1>
          {/* TODO: Make search filters mobile friendly */}
          <form className="home-search-form" onSubmit={(e) => searchJobs(e)}>
            <div className="home-search-form-group">
              <div onClick={searchJobs}><SVGs svg={'search'}/></div>
              <input type="text" name="search" placeholder="Search by title or keyword" value={search} onChange={(e) => setSearch(e.target.value)}/>
            </div>
            <div className="home-search-form-mobile-icon" onClick={() => toggle('filters')}><SVGs svg={'equalizer'}/></div>
            <div className={`home-search-form-group-dropdown` + (filters == true ? ' filters-dropdown' : '')}>
              <div className="home-search-form-group-dropdown-toggle">
                <div onClick={() => toggle('closeFilter')}><SVGs className="home-search-form-group-dropdown-toggle-svg" svg={'close'}/></div>
                <span>Filters</span>
              </div>
              <div className="home-search-form-group-dropdown-group">
                <div onClick={() => toggle(0)}className="home-search-form-group-dropdown-group-container">
                  <SVGs svg={'location'}/>
                  <div>Location</div>
                  <SVGs svg={'arrow-down'}/>
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
                  <SVGs svg={'briefcase'}/>
                  <div>Job Category</div>
                  <SVGs svg={'arrow-down'}/>
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
                  <SVGs svg={'pen'}/>
                  <div>Employment Type</div>
                  <SVGs svg={'arrow-down'}/>
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
      <div className="home-list-container-dynamic" id="list-container">
        <div className="home-list">
          <div className="home-list-left-container">
            <div className="home-list-left">
              {data && Object.keys(data).length !== 0 && data.jobs.map((item, idx) => 
                <div key={idx} className="home-list-left-box" onClick={() => (changeURI(item.id, item.role.name, item.location),setSelected(item.company ? item.company.name : 'Unknown'), setJob(item.role ? item.role.name : 'Unknown'), setLocation(item.location ? item.location : 'Unknown'), setPosition(item.role ? item.role.name : 'Unknown'), setTime(matchWorkCategories(item.workCategories)), setImage(item.imgUrl ? item.imgUrl : item.company.logo), setDescription(item.description), setID(item.id))}>
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
          {selected.length > 0 &&
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
                  {time.map((t, idx) => 
                    <span key={idx}>{t}</span>
                  )}
                </div>
              </div>
              <img src={`${image}`} alt="" className="home-list-selected-image" />
              <div className="home-list-selected-description">
                <div className="home-list-selected-description-heading">WHY {selected}?</div>
                <div dangerouslySetInnerHTML={ { __html: description } }></div>
              </div>
            </div>
            {/* {newUser == null ? <div className="home-list-selected-button"><button onClick={() => setModal(true)}>Sign In</button></div> : null } */}
            {/* {newUser !== null ? <div className="home-list-selected-button" onClick={() => window.open(`https://gamesmith.com/job/${router.query.id}?${router.query.slug}`)}><button>Apply</button></div> : null } */}
            <div className="home-list-selected-button" onClick={() => window.open(`https://gamesmith.com/job-apply/${router.query.id}?${router.query.slug}`)}><button>Apply</button></div>
          </div>
          }
        </div>
      </div>
      }
      {selected.length > 0 &&
      <div className="job">
        <div className="job-back-mobile"><SVGs svg={'left-arrow'} onClick={() => window.location.href = '/'}/> <span onClick={() => window.location.href = '/'}>Back to jobs</span></div>
        <div className="job-back-container"><div className="job-back"><SVGs svg={'left-arrow'} onClick={() => window.location.href = '/'}/> <span onClick={() => window.location.href = '/'}>Back to jobs</span> </div></div>
        <div className="job-heading-container">
          <div className="job-title">{selected}</div>
        </div>
        <div className="job-content-container">
          <div className="job-content">
            <img src={image} alt={image} className="job-content-image" />
            <div className="job-content-header">
              <h1>{job}</h1>
              <span className="job-content-header-location">{location}</span>
              <a href="#" className="job-content-header-all">See all jobs from {selected}</a>
            </div>
            <div className="job-content-description" dangerouslySetInnerHTML={{ __html: description}}></div>
            {/* {newUser == null ? <div className="job-content-button"><button onClick={() => setModal(true)}>Sign In</button></div> : null } */}
            {/* {newUser !== null ? <div className="job-content-button"><button>Apply</button></div> : null } */}
            <div className="job-content-button"><button>Apply</button></div>
          </div>
        </div>
      </div>
      }
      {modal && <LoginModal setmodal={setModal}/>}
    </div>
    </>
  )
}

Home.getInitialProps = async ({req, query}) => {
  
  const { origin } = absoluteUrl(req)
  let uri = `${origin}${req.url}`

  let jobFound = null

  try {
    const responseSearch = await axios.post(`${API}/jobs/find-jobCard`, {id: query.id})
    jobFound = responseSearch.data
  } catch (error) {
    if(error) error.response? (setError(error.response.data), setLoading(false)) : setError('Cannot find job.')
  }

  const unixTimestamp = jobFound ? jobFound.jobCardDetails.createdAt : null
  const dateObject = new Date(unixTimestamp)
  if(jobFound) jobFound.jobCardDetails.createdAt = dateObject.toISOString()

  const {result} = stripHtml(jobFound.description)
  jobFound.description = result
  
  return {
    jobPosting: jobFound ? jobFound : null,
    uri: uri
  }
}

export default withUser(withData(Home))
