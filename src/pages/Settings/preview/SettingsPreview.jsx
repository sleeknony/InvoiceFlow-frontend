import { useMemo } from "react";

import sampleDocument from "../../../renderer/templates/sampleDocument";

import DocumentPipeline
    from "../../../DocumentEngine/Pipeline/DocumentPipeline";

import { getDocumentConfig }
    from "../../../renderer/templates/config/documentConfigService";

import { DocumentRenderer }
    from "../../../renderer";

export default function SettingsPreview({

    settings

}) {

    const renderDocument =
        useMemo(() =>

            DocumentPipeline.build({

                document: sampleDocument,

                settings,

                config:
                    getDocumentConfig(
                        sampleDocument.type
                    ),

                payments: [],

                approvalHistory: []

            }),

            [settings]

        );

    return (

        <DocumentRenderer

            renderDocument={renderDocument}

        />

    );

}