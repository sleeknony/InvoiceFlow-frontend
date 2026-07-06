import sampleDocument from "../../../templates/sampleDocument";

import { getTemplate } from "../../../templates/getTemplate";

export default function SettingsPreview({

    settings

}) {

    const Template =

        getTemplate(

            settings.documentTemplate

        );

    return (

        <Template

            document={sampleDocument}

            settings={settings}

        />

    );

}