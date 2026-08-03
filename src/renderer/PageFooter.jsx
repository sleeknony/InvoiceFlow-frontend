
import "./styles/PageFooter.css";

export default function PageFooter({

    children

}) {

    return (

        <footer className="page-footer">

            {children}

        </footer>

    );

}

//import useRenderContext from "./useRenderContext";

//export default function PageFooter() {

//    const {
//        pageNumber,
//        totalPages
//    } = useRenderContext();

//    return (

//        <div className="page-footer">

//            Page {pageNumber} of {totalPages}

//        </div>

//    );
//}