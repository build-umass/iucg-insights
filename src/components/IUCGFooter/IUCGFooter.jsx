import "./IUCGFooterNew.css"
import "./IUCGFonts.css"
import { useCookies } from "react-cookie"
import { useNavigate } from "react-router-dom"
import { GoogleLogin } from '@react-oauth/google';
import { getIdentity, login } from "../../api";

export default function IUCGFooter() {
    const [cookies, setCookie, removeCookie] = useCookies(['loginToken', 'isAdmin']);
    const navigator = useNavigate();
    return <footer className="site-footer" role="contentinfo">
        <div className="container">
            <div className="clearfix top-row">
                <div className="col-1">
                    <h3>SUBSCRIBE TO OUR NEWSLETTER</h3>
                    <div lang="en-US" dir="ltr">
                        <p role="status" aria-live="polite" aria-atomic="true" /> <ul />
                        <form action="/footer-form" method="post" className="footer-form" aria-label="Contact form" noValidate="novalidate">
                            <p> <input className="footer-form-entry" aria-required="true" placeholder="Your Name" type="text" name="footer-form-name" /> </p>
                            <p> <input size={40} className="footer-form-entry" aria-required="true" placeholder="Your Email" type="email" name="footer-form-email" /> </p>
                            <p> <select className="footer-form-entry" aria-required="true" name="footer-form-job" >
                                <option value="I am a...">I am a...</option>
                                <option value="Student">Student</option>
                                <option value="Client">Client</option>
                                <option value="Recruiter">Recruiter</option>
                                <option value="Alumnus/Alumna">Alumnus/Alumna</option>
                                <option value="Faculty/Staff">Faculty/Staff</option>
                            </select> </p>
                            <p> <input type="submit" value="Sign Up" id="footer-sign-up-button" /> </p>
                        </form>
                    </div>
                </div>
                <div className="col-2">
                    <h3>GET IN TOUCH</h3>
                    <div>
                        <p> <strong>Email:</strong> <br /> <a href="mailto:isenbergucg@umass.edu">isenbergucg@umass.edu</a> </p>
                        <p> <strong>Address:</strong> <br /> Isenberg School of Management, <br /> UMass Amherst, 121 Presidents Dr, <br /> Amherst, MA 01003, USA </p>
                        <p> <a href="https://www.google.com/maps/place/Isenberg+School+of+Management,+UMass+Amherst/@42.386697,-72.5270817,17z/data=!3m1!4b1!4m5!3m4!1s0x89e6d2743fd14531:0xb563acd3e798a189!8m2!3d42.386697!4d-72.524893?hl=en" rel="noopener" > <span className="fa-icon">{'\uf041'}</span> Open in Google Maps </a> </p>
                    </div>
                </div>
                <div className="col-3">
                    <div className="col-3-entry">
                        <h3>STAY CONNECTED</h3> <a href="https://www.linkedin.com/company/the-isenberg-consulting-group" title="Visit Isenberg Undergraduate Consulting Group on LinkedIn" > <span className="fa-icon large">{'\uf0e1'}</span> </a>
                    </div>
                    <div className="col-3-entry">
                        <h3>USER PORTAL</h3>
                        <div className="textwidget loginIcon">
                            {cookies.loginToken ? <>
                                <div onClick={() => {
                                    console.log("trying to remove cookie");
                                    removeCookie("loginToken", { path: "/" });
                                    removeCookie("isAdmin", { path: "/" });
                                    navigator(0);
                                    console.log("trying to remove cookie");}}
                                    className="material-symbols-outlined">logout</div>
                                <div className="material-symbols-outlined" onClick={()=>navigator("/settings")}>settings</div>
                                <div className="material-symbols-outlined" onClick={()=>navigator("/create")}>add_box</div>
                                <div className="material-symbols-outlined" onClick={()=>navigator("/drafts")}>edit_note</div>
                            </> :
                                <GoogleLogin
                                    type="icon"
                                    size="medium"
                                    theme="outline"
                                    shape="circle"
                                    onSuccess={async (credential) => {
                                        await login(credential);
                                        navigator(0);
                                    }}
                                    onError={() => {
                                        console.log('Login Failed');
                                    }}
                                />}
                        </div>
                    </div>
                </div>
            </div>
            <div className="clearfix bottom-row">
                <div className="float-right">
                    <ul className="footer-nav">
                        <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-1801" > <a href="https://www.isenbergconsulting.org/">DISCLAIMER</a> </li>
                        <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-1802" > <a href="https://www.isenbergconsulting.org/">SUPPORT POLICY</a> </li>
                        <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-1803" > <a href="https://www.isenbergconsulting.org/">LEGAL</a> </li>
                    </ul>
                </div>
                <a href="https://www.isenbergconsulting.org" > <img className="float-left" src="https://www.isenbergconsulting.org/wp-content/uploads/2018/10/logo_bottom_hover.png" width={300} height={55} alt="Isenberg Undergraduate Consulting Group" /> </a>
                <div className="copyright"> <p> © 2018 | Isenberg Undergraduate Consulting Group | Designed By <a href="https://www.sociolus.com/"> Sociolus.</a> </p> </div>
            </div>
        </div>
    </footer>
}
