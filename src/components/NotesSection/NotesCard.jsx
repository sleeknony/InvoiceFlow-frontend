import { FiFileText } from "react-icons/fi";

export default function NotesCard({

    doc,

    setDoc

}) {

    return (

        <div className="card border-0 shadow-sm rounded-4">

            <div className="card-body p-4">

                <div className="d-flex align-items-center mb-4">

                    <div
                        className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center me-3"
                        style={{
                            width: 48,
                            height: 48
                        }}>

                        <FiFileText
                            size={20}
                            className="text-primary"
                        />

                    </div>

                    <div>

                        <h5 className="fw-bold mb-1">

                            Notes

                        </h5>

                        <small className="text-muted">

                            Information that will appear at the bottom of the document.

                        </small>

                    </div>

                </div>

                <textarea

                    rows="8"

                    className="form-control"

                    placeholder="Thank you for your business..."

                    value={doc.notes || ""}

                    onChange={(e) =>

                        setDoc(prev => ({

                            ...prev,

                            notes: e.target.value

                        }))

                    }

                />

                <div className="d-flex justify-content-between mt-3">

                    <small className="text-muted">

                        These notes will appear on the printed document.

                    </small>

                    <small className="text-muted">

                        {(doc.notes || "").length} characters

                    </small>

                </div>

            </div>

        </div>

    );

}