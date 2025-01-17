import {useNavigate} from "react-router-dom";
import {useAtom} from "jotai";
import {nameAtom} from "../state/store.tsx";
import React from "react";

function RegisterPage() {
    const [name, setName] = useAtom(nameAtom);
    const navigate = useNavigate()

    return (
        <>
            <h3>Name: <input type="text" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                console.log(e.target.value)
                setName(e.target.value)
            }}/></h3>
            <div className="card">
                <button onClick={() => navigate("/connect")}>
                    Submit
                </button>
            </div>
        </>
    )
}

export default RegisterPage
