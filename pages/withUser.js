import {API} from '../config'
import axios from 'axios'
import {getUser} from '../utils/user'
axios.defaults.withCredentials = true

const withUser = Page => {
    const WithAuthUser = props => <Page {...props} />
    WithAuthUser.getInitialProps = async (context)  => {
      const user = getUser(context.req, context.res)
      let newUser = null
      
      // console.log(user)
      
      if(user){newUser = user.split('=')[1]}

      // console.log(JSON.parse(decodeURIComponent(newUser)))

      if(newUser == null){
        return {
          ...(Page.getInitialProps ? await Page.getInitialProps(context) : {}),
          newUser,
        }
      }else{
        return {
            ...(Page.getInitialProps ? await Page.getInitialProps(context) : {}),
            newUser,
        }
      }
    }

    return WithAuthUser
}

export default withUser