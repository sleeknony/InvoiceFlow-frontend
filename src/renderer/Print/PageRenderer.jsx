import "../Styles/PageRenderer.css";

import SectionRenderer from "../Layout/SectionRenderer";

import { Fragment } from "react";

export default function PageRenderer({

    page

}) {

 
    console.group(`Rendering Page ${page.pageNumber}`);

    page.sections.forEach((section, i) => {

        console.log(

            i,

            section.type,

            section.height,

            section.keepTogether,

            section.allowBreak

        );

    });

    console.groupEnd();

    return (

        <section className="print-page">

            <div className="page-content">

               

                

                {page.sections.map((section, index) => (

                    <Fragment key={index}>

                        {SectionRenderer.render(section)}

                    </Fragment>

                ))}

            </div>

            <div className="page-number">

                Page {page.pageNumber}

            </div>

        </section>

    );

}