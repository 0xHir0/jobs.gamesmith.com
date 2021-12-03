import axios from 'axios'
import {API} from '../config'

const withData = Page => {
  const withPageData = props => <Page {...props} />
  withPageData.getInitialProps = async (context)  => {
    let dataObject = new Object()
    
    try {
      const responseCategories = await axios.get(`${API}/jobs/categories`)
      const responseJobs = await axios.get(`${API}/jobs/browse`)

      dataObject.jobs = responseJobs.data
      dataObject.categories = responseCategories.data
      
    } catch (error) {
      console.log(error)
    }

    try {
      const responseLocations = await axios.get('https://staging-backend.gamesmith.com/api/browse/countriesList')
      dataObject.locations = responseLocations.data
    } catch (error) {
      console.log(error)
    }
   
    if(dataObject == null){
      context.res.writeHead(302, {
          Location: '/'
      });
      context.res.end();
    }else{
      return {
          ...(Page.getInitialProps ? await Page.getInitialProps(context) : {}),
          dataObject
      }
    }
  }

  return withPageData
}

export default withData