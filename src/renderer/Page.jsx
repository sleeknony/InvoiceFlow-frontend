import "../Styles/PageManager.css";

export default function Page({

    children,

    number

}) {

    return (

        <section className="render-page">

            <div className="render-page-body">

                {children}

            </div>

        </section>

    );

}