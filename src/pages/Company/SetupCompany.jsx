import { useState } from "react";
import { useNavigate } from "react-router-dom";
import http from "../../api/http";
import {
    FiBriefcase,
    FiMapPin,
    FiFileText
} from "react-icons/fi";
import "./SetupCompany.css";

export default function SetupCompany() {

    const navigate = useNavigate();

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const [form, setForm] = useState({

        companyName: "",

        email: "",

        phone: "",

        website: "",

        taxNumber: "",

        country: "Nigeria",

        currency: "NGN",

        address: ""

    });

    function handleChange(e) {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    }

    async function handleSubmit(e) {

        e.preventDefault();

        try {

            setSaving(true);

            setError("");

            await http.post(
                "/settings/setup",
                form
            );

            navigate("/dashboard");

        }
        catch (err) {

            setError(

                err.response?.data?.message ||

                "Unable to create company."

            );

        }
        finally {

            setSaving(false);

        }

    }

    return (

        <div className="setup-page">

            <div className="setup-card">

                <div className="setup-header">

                    <span className="setup-step">

                        STEP 1 OF 2

                    </span>

                    <h1>

                        Welcome 👋

                    </h1>

                    <p>

                        Let's create your company workspace.

                        This takes less than a minute.

                    </p>

                </div>

                {error && (

                    <div className="setup-error">

                        {error}

                    </div>

                )}

                <form
                    onSubmit={handleSubmit}
                >

                    <section>

                        <h3>
                            <FiBriefcase />
                            Company Information
                        </h3>

                        <div className="setup-grid">

                            <div>

                                <label>

                                    Company Name *

                                </label>

                                <input

                                    name="companyName"

                                    value={form.companyName}

                                    onChange={handleChange}

                                    required

                                />

                            </div>

                            <div>

                                <label>

                                    Business Email

                                </label>

                                <input

                                    type="email"

                                    name="email"

                                    value={form.email}

                                    onChange={handleChange}

                                />

                            </div>

                            <div>

                                <label>

                                    Phone Number

                                </label>

                                <input

                                    name="phone"

                                    value={form.phone}

                                    onChange={handleChange}

                                />

                            </div>

                            <div>

                                <label>

                                    Website

                                </label>

                                <input

                                    name="website"

                                    value={form.website}

                                    onChange={handleChange}

                                />

                            </div>

                        </div>

                    </section>

                    <section>

                        <h3>
                            <FiMapPin />
                            Business Location
                        </h3>

                        <div className="setup-grid">

                            <div>

                                <label>

                                    Country

                                </label>

                                <input

                                    name="country"

                                    value={form.country}

                                    onChange={handleChange}

                                />

                            </div>

                            <div>

                                <label>

                                    Currency

                                </label>

                                <select

                                    name="currency"

                                    value={form.currency}

                                    onChange={handleChange}

                                >

                                    <option value="NGN">

                                        NGN

                                    </option>

                                    <option value="USD">

                                        USD

                                    </option>

                                    <option value="GBP">

                                        GBP

                                    </option>

                                    <option value="EUR">

                                        EUR

                                    </option>

                                </select>

                            </div>

                        </div>

                    </section>

                    <section>

                        <h3>
                            <FiFileText />
                            Additional Information
                        </h3>

                        <label>

                            Tax Number

                        </label>

                        <input

                            name="taxNumber"

                            value={form.taxNumber}

                            onChange={handleChange}

                        />

                        <label>

                            Address

                        </label>

                        <textarea

                            rows="4"

                            name="address"

                            value={form.address}

                            onChange={handleChange}

                        />

                    </section>

                    <button

                        className="setup-button"

                        disabled={saving}

                    >

                        {

                            saving

                                ? "Creating Workspace..."

                                : "Continue"

                        }

                    </button>

                </form>

            </div>

        </div>

    );

}