import ModernPaymentDetails from "../PaymentDetails/ModernPaymentDetails";
import ModernTotals from "../Totals/ModernTotals";

export default function BottomSection() {

    return (

        <div className="document-bottom">

            <ModernTotals />
            <ModernPaymentDetails />

            

        </div>

    );

}