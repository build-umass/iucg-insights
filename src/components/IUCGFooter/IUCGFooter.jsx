import "./IUCGFooter.css"
import "./IUCGFonts.css"
import "./FooterPatches.css"
import { useCookies } from "react-cookie"
import { useNavigate } from "react-router-dom"

export default function IUCGFooter(){
    const [cookies, , removeCookie] = useCookies(['myCookie']);
  const navigator = useNavigate();
    return <footer
    id="footer"
    className="site-footer"
    role="contentinfo"
    itemScope="itemscope"
    itemType="https://schema.org/WPFooter"
    >
    <div className="container">
        <div className="row">
        <div className="col-sm-5">
            <div id="text-8" className="widget widget_text">
            <h3 className="widgettitle title m_title m_title_ext text-custom">
                SUBSCRIBE TO OUR NEWSLETTER
            </h3>{" "}
            <div className="textwidget">
                <div
                className="wpcf7 no-js"
                id="wpcf7-f2903-o1"
                lang="en-US"
                dir="ltr"
                >
                <div className="screen-reader-response">
                    <p role="status" aria-live="polite" aria-atomic="true" /> <ul />
                </div>
                <form
                    action="/#wpcf7-f2903-o1"
                    method="post"
                    className="wpcf7-form init"
                    aria-label="Contact form"
                    noValidate="novalidate"
                    data-status="init"
                >
                    <div style={{ display: "none" }}>
                    <input type="hidden" name="_wpcf7" defaultValue={2903} />
                    <input
                        type="hidden"
                        name="_wpcf7_version"
                        defaultValue="5.7.7"
                    />
                    <input
                        type="hidden"
                        name="_wpcf7_locale"
                        defaultValue="en_US"
                    />
                    <input
                        type="hidden"
                        name="_wpcf7_unit_tag"
                        defaultValue="wpcf7-f2903-o1"
                    />
                    <input
                        type="hidden"
                        name="_wpcf7_container_post"
                        defaultValue={0}
                    />
                    <input
                        type="hidden"
                        name="_wpcf7_posted_data_hash"
                        defaultValue=""
                    />
                    </div>
                    <p>
                    <span
                        className="wpcf7-form-control-wrap"
                        data-name="text-267"
                    >
                        <input
                        size={40}
                        className="wpcf7-form-control wpcf7-text wpcf7-validates-as-required footer-form-entry"
                        aria-required="true"
                        aria-invalid="false"
                        placeholder="Your Name"
                        defaultValue=""
                        type="text"
                        name="text-267"
                        />
                    </span>
                    </p>
                    <div
                    style={{
                        position: "relative !important",
                        height: "0px !important",
                        width: "0px !important",
                        float: "left !important"
                    }}
                    data-lastpass-icon-root=""
                    />
                    <p />
                    <p>
                    <span
                        className="wpcf7-form-control-wrap"
                        data-name="email-970"
                    >
                        <input
                        size={40}
                        className="wpcf7-form-control wpcf7-text wpcf7-email wpcf7-validates-as-required wpcf7-validates-as-email footer-form-entry"
                        aria-required="true"
                        aria-invalid="false"
                        placeholder="Your Email"
                        defaultValue=""
                        type="email"
                        name="email-970"
                        />
                    </span>
                    </p>
                    <p>
                    <span
                        className="wpcf7-form-control-wrap"
                        data-name="menu-583"
                    >
                        <select
                        className="wpcf7-form-control wpcf7-select wpcf7-validates-as-required footer-form-entry"
                        aria-required="true"
                        aria-invalid="false"
                        name="menu-583"
                        >
                        <option value="I am a...">I am a...</option>
                        <option value="Student">Student</option>
                        <option value="Client">Client</option>
                        <option value="Recruiter">Recruiter</option>
                        <option value="Alumnus/Alumna">Alumnus/Alumna</option>
                        <option value="Faculty/Staff">Faculty/Staff</option>
                        </select>
                    </span>
                    </p>
                    <p>
                    <input
                        className="wpcf7-form-control has-spinner wpcf7-submit"
                        type="submit"
                        value="Sign Up"
                        id="footer-sign-up-button"
                    />
                    </p>
                    <div className="wpcf7-response-output" aria-hidden="true" />
                </form>
                </div>
            </div>
            </div>
        </div>
        <div className="col-sm-4">
            <div id="text-7" className="widget widget_text">
            <h3 className="widgettitle title m_title m_title_ext text-custom">
                GET IN TOUCH
            </h3>{" "}
            <div className="textwidget">
                <p>
                <strong>Email:</strong>
                <br />
                <a href="mailto:isenbergucg@umass.edu">isenbergucg@umass.edu</a>
                </p>
                <p>
                <strong>Address:</strong>
                <br />
                Isenberg School of Management,
                <br />
                UMass Amherst, 121 Presidents Dr,
                <br />
                Amherst, MA 01003, USA
                </p>
                <p>
                <a
                    href="https://www.google.com/maps/place/Isenberg+School+of+Management,+UMass+Amherst/@42.386697,-72.5270817,17z/data=!3m1!4b1!4m5!3m4!1s0x89e6d2743fd14531:0xb563acd3e798a189!8m2!3d42.386697!4d-72.524893?hl=en"
                    target="_blank"
                    rel="noopener"
                >
                    <i className="glyphicon glyphicon-map-marker kl-icon-white" />{" "}
                    Open in Google Maps
                </a>
                </p>
            </div>
            </div>
        </div>
        <div className="col-sm-3">
            <div
            id="wpcw_social-2"
            className="widget wpcw-widgets wpcw-widget-social"
            >
            <h3 className="widgettitle title m_title m_title_ext text-custom">
                STAY CONNECTED
            </h3>
            <ul>
                <li className="no-label">
                <a
                    href="https://www.linkedin.com/company/the-isenberg-consulting-group"
                    target="_blank"
                    title="Visit Isenberg Undergraduate Consulting Group on LinkedIn"
                >
                    <span className="fa fa-2x fa-linkedin"></span>
                </a>
                </li>
            </ul>
            </div>
            <div id="text-10" className="widget widget_text">
            <h3 className="widgettitle title m_title m_title_ext text-custom">
                USER PORTAL
            </h3>{" "}
            <div className="textwidget loginIcon">
                {cookies.isAdmin && <div onClick={() => navigator("/create")}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" fill="#FFFFFF"/></svg>
                </div>}
                {!cookies.isAdmin ?
                <div onClick={() => navigator("/login")}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" fill="#FFFFFF"/></svg>
                </div> :
                <div onClick={() => {removeCookie("isAdmin"); navigator(0)}}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" fill="#FFFFFF"/></svg>
                </div>}
            </div>
            </div>
        </div>
        </div>
        {/* end row */}
        <div className="row">
        <div className="col-sm-12">
            <div className="bottom site-footer-bottom clearfix">
            <div className="zn_footer_nav-wrapper">
                <ul id="menu-footer-menu-bottom" className="footer_nav">
                <li
                    id="menu-item-1801"
                    className="menu-item menu-item-type-custom menu-item-object-custom menu-item-1801"
                >
                    <a href="#">DISCLAIMER</a>
                </li>
                <li
                    id="menu-item-1802"
                    className="menu-item menu-item-type-custom menu-item-object-custom menu-item-1802"
                >
                    <a href="#">SUPPORT POLICY</a>
                </li>
                <li
                    id="menu-item-1803"
                    className="menu-item menu-item-type-custom menu-item-object-custom menu-item-1803"
                >
                    <a href="#">LEGAL</a>
                </li>
                </ul>
            </div>
            <div className="copyright footer-copyright">
                <a
                href="https://www.isenbergconsulting.org"
                className="footer-copyright-link"
                >
                <noscript>
                    &lt;img class="footer-copyright-img"
                    src="https://www.isenbergconsulting.org/wp-content/uploads/2018/10/logo_bottom_hover.png"
                    width="300" height="55" alt="Isenberg Undergraduate Consulting
                    Group" /&gt;
                </noscript>
                <img
                    className="lazy footer-copyright-img entered loaded"
                    src="https://www.isenbergconsulting.org/wp-content/uploads/2018/10/logo_bottom_hover.png"
                    data-src="https://www.isenbergconsulting.org/wp-content/uploads/2018/10/logo_bottom_hover.png"
                    width={300}
                    height={55}
                    alt="Isenberg Undergraduate Consulting Group"
                    data-ll-status="loaded"
                />
                </a>
                <p className="footer-copyright-text">
                © 2018 | Isenberg Undergraduate Consulting Group | Designed By{" "}
                <a href="https://www.sociolus.com/">Sociolus.</a>
                </p>{" "}
            </div>
            {/* end copyright */}
            </div>
            {/* end bottom */}
        </div>
        </div>
        {/* end row */}
    </div>
    </footer>
}