import SVGs from '../files/svgs'

const FooterMenu = ({}) => {
  
  return (
    <div className="footerMenu">
      <div onClick={ () => window.open('https://gamesmith.com/home', '_blank').focus()} className="footerMenu-active"><SVGs svg={'home'} className="footerMenu-svg"/><span>Home</span></div>
      <div onClick={ () => window.open('https://gamesmith.com/games', '_blank').focus()}><SVGs svg={'games'} className="footerMenu-svg"/><span>Games</span></div>
      <div onClick={ () => window.open('https://gamesmith.com/makers', '_blank').focus()}><SVGs svg={'group'} className="footerMenu-svg"/><span>Makers</span></div>
      <div onClick={() => window.open('/', '_blank').focus()}><SVGs svg={'briefcase'} className="footerMenu-svg"/><span>Jobs</span></div>
      <div><SVGs svg={'user'} className="footerMenu-svg"/><span>My Profile</span></div>
    </div>
  )
}

export default FooterMenu
