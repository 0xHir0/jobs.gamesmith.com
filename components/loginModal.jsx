import {useState} from 'react'
import SVGs from '../files/svgs'
import axios from 'axios'
import {API} from '../config'
import {useRouter} from 'next/router'
axios.defaults.withCredentials = true

const loginModal = ({setmodal, job}) => {
  const router = useRouter()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(false)

  const signin = async (e) => {
    e.preventDefault()
    try {
        const responseLogin = await axios.post(`${API}/auth/signin`, {email, password})
        router.query.id ? window.location.href = `/job/${router.query.id}/${router.query.slug}?job=${encodeURIComponent(JSON.stringify(job))}` : window.location.href = `/`
    } catch (error) {
      console.log(error.response.data)
      if(error) error.response ? error.response.data ? setMessage(error.response.data.message) : null : null
    }
  }
  
  return (
    <div className="login-modal">
      <div className="login-modal-box">
        <div className="login-modal-box-header">
          <span>Sign in</span>
          <div onClick={() => setmodal(false)}><SVGs svg={'close'}/></div>
        </div>
        <form className="login-modal-form form" onSubmit={signin}>
          <div className="form-group-single">
            <label htmlFor="email"></label>
            <input type="email" name="email" onChange={(e) => setEmail(e.target.value)}  value={email} placeholder="Sign In"/>
          </div>
          <div className="form-group-single">
            <label htmlFor="password"></label>
            <input type="password" name="password" onChange={(e) => setPassword(e.target.value)} value={password} placeholder="password"/>
          </div>
          {message ? <div className="form-group-messageHandling">{message}</div> : <div className="form-group-messageHandling"></div>}
          <button>Submit</button>
        </form>
      </div>
    </div>
  )
}

export default loginModal
