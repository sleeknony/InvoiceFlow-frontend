import "./styles/PageHeader.css";

export default function CompactHeader({

    companyName,

    documentNumber

}) {

    return (

        <header className="compact-header">

            <div>

                {companyName}

            </div>

            <div>

                {documentNumber}

            </div>

        </header>

    );

}