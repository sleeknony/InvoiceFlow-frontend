import Page from "./Page";

export default function PageManager({

    children

}) {

    return (

        <Page number={1}>

            {children}

        </Page>

    );

}