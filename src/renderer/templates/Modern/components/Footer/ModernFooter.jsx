import "./ModernFooter.css";

import { useDocument } from "../../../../RenderContext";

export default function ModernFooter() {

    const {

        company

    } = useDocument();
   

    return (

        <footer className="modern-footer">

            <div className="modern-footer-left">

                Thank you for your business.

            </div>

            <div className="modern-footer-right">

                {

                    company.website &&

                    <span>

                        {company.website}

                    </span>

                }

                {

                    company.website && company.phone &&

                    <span className="footer-separator">

                        /

                    </span>

                }

                {

                    company.phone &&

                    <span>

                        {company.phone}

                    </span>

                }

            </div>

        </footer>

    );

}