import '../styles/app.css'
import Head from 'next/head'
import FooterMenu from '../components/footer-menu'
import {useState} from 'react'

function MyApp({ Component, pageProps }) {

  const [job, setJob] = useState(null)
  const [modal, setModal] = useState(false)

  const sendJob = (item) => {setJob(item); window.localStorage.setItem('job', JSON.stringify(item))}
  
  return <>
    <Head>
      <title>Gamesmith</title>
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/>
      <link rel="preconnect" href="https://fonts.gstatic.com"></link>
      <link rel="preconnect" href="https://fonts.gstatic.com"/>
      <link href="https://fonts.googleapis.com/css2?family=Palanquin:wght@100&display=swap" rel="stylesheet"></link>
      <link rel="preconnect" href="https://fonts.gstatic.com"/>
      <link href="https://fonts.googleapis.com/css2?family=Palanquin:wght@100;600&display=swap" rel="stylesheet"></link>
      <link href="https://fonts.googleapis.com/css2?family=Palanquin&display=swap" rel="stylesheet"></link>
      <link rel="preconnect" href="https://fonts.gstatic.com"/>
      <link href="https://fonts.googleapis.com/css2?family=Palanquin:wght@100;200;600&display=swap" rel="stylesheet"></link>
    </Head>
    <Component {...pageProps} jobState={sendJob} jobOpen={job} setModal={setModal} modal={modal}/>
    <FooterMenu setModal={setModal} modal={modal} />
  </>
}

export default MyApp
