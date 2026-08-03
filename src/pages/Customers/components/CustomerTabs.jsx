export default function CustomerTabs({

    activeTab,

    onChange

}) {

    const tabs = [

        {
            key: "overview",
            label: "Overview"
        },

        {
            key: "documents",
            label: "Documents"
        },

        {
            key: "statement",
            label: "Statement"
        },

        {
            key: "activity",
            label: "Activity"
        }

    ];

    return (

        <div className="card border-0 shadow-sm rounded-4 mb-4">

            <div className="card-body py-2">

                <ul className="nav nav-pills">

                    {

                        tabs.map(tab => (

                            <li
                                key={tab.key}
                                className="nav-item"
                            >

                                <button

                                    className={`nav-link ${activeTab === tab.key
                                            ? "active"
                                            : ""
                                        }`}

                                    onClick={() =>
                                        onChange(tab.key)
                                    }

                                >

                                    {tab.label}

                                </button>

                            </li>

                        ))

                    }

                </ul>

            </div>

        </div>

    );

}