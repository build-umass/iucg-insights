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
                                <div onClick={() => navigator("/create")}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" fill="#FFFFFF" /></svg>
                                </div>
                                <div onClick={() => {
                                    console.log("trying to remove cookie");
                                    removeCookie("loginToken", { path: "/" });
                                    removeCookie("isAdmin", { path: "/" });
                                    navigator(0);
                                    console.log("trying to remove cookie");
                                }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" fill="#FFFFFF" /></svg>
                                </div>
                                <div onClick={() => { navigator("/settings") }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm112-260q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Z" /></svg>
                                </div>
                                <div onClick={() => { navigator("/drafts") }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M360-360v-170l367-367q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L530-360H360Zm424-368 57-56-56-56-57 56 56 56ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h357L280-563v283h282l278-278v358q0 33-23.5 56.5T760-120H200Z" /></svg>
                                </div>
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
