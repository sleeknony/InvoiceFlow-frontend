import "./styles/PageHeader.css";

export default function PageHeader({

    children

}) {

    return (

        <header className="page-header">

            {children}

        </header>

    );

}



//import useRenderContext from "./useRenderContext";

//export default function PageHeader() {

//    const {
//        document,
//        pageNumber
//    } = useRenderContext();

//    if (pageNumber === 1)
//        return null;

//    return (

//        <div className="page-header">

//            <strong>

//                {document.documentNumber}

//            </strong>

//            <span>

//                {document.type}

//            </span>

//        </div>

//    );
//}