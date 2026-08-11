import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import PaymentAccountsTable from "./components/PaymentAccountsTable";
import PaymentInstructions from "./components/PaymentInstructions";
import BankAccountModal from "./components/BankAccountModal";
import "./Tab.css";
import {
    getBankAccounts, createBankAccount, updateBankAccount, archiveBankAccount, reorderBankAccounts, setDefaultBankAccount
} from "../../../services/settingsService";

export default function PaymentTab({
    form,
    setForm
}) {

   
    const [accounts, setAccounts] = useState([]);

    const [showModal, setShowModal] =
        useState(false);

    const [selectedAccount, setSelectedAccount] =
        useState(null);

    function handleAdd() {

        setSelectedAccount(null);

        setShowModal(true);

    }

    function handleEdit(account) {

        setSelectedAccount(account);

        setShowModal(true);

    }

    async function handleDelete(account) {

        try {

            await archiveBankAccount(account.id);

            await loadAccounts();

            toast.success("Bank account archived.");

        }
        catch (err) {

            console.error(err);

            toast.error("Unable to archive bank account.");

        }

    }

  
    useEffect(() => {

        loadAccounts();

    }, []);

    async function loadAccounts() {

        try {

            const result =
                await getBankAccounts();

            setAccounts(result);

        }

        catch (err) {

            console.error(err);

            toast.error(
                "Unable to load bank accounts."
            );

        }

    }


    async function handleSave(dto) {

        try {

            if (dto.id > 0) {

                await updateBankAccount(
                    dto.id,
                    dto
                );

                toast.success(
                    "Bank account updated."
                );

            }
            else {

                if (accounts.length >= 3) {

                    toast.error(
                        "Maximum of 3 bank accounts allowed."
                    );

                    return;

                }

                await createBankAccount(dto);

                toast.success(
                    "Bank account added."
                );

            }

            await loadAccounts();

            setShowModal(false);

            setSelectedAccount(null);

        }
        catch (err) {

            console.error(err);

            toast.error(
                err?.response?.data?.message ??
                "Unable to save bank account."
            );

        }

    }

    async function handleReorder(reordered) {

        setAccounts(reordered);

        try {

            await reorderBankAccounts(
                reordered.map((x, index) => ({
                    id: x.id,
                    displayOrder: index + 1
                }))
            );

        }
        catch {

            await loadAccounts();

        }

    }

    return (
        <>

            <h4 className="tab-title">
                Payment
            </h4>

            <p className="tab-subtitle">
                Manage the payment accounts that customers can use when paying your invoices.
            </p>

            
            <PaymentAccountsTable
                accounts={accounts}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onReorder={handleReorder}
            />
            
            <PaymentInstructions

                form={form}

                setForm={setForm}

            />

            <BankAccountModal

                show={showModal}

                account={selectedAccount}

                onClose={() => {

                    setShowModal(false);

                    setSelectedAccount(null);

                }}

                onSave={handleSave}

            />

        </>
    );

}