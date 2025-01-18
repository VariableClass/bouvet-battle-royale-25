import {useNavigate} from "react-router-dom";
import {useAtom} from "jotai";
import {nameAtom} from "../state/store.tsx";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function RegisterPage() {
    const [name, setName] = useAtom(nameAtom);
    const navigate = useNavigate()

    return (
        <>
            <h3>Name: <Input type="text" value={name} onChange={(e) => {
                setName(e.target.value)
            }}/></h3>
            <div className="card">
                <Button onClick={() => navigate("/connect")}>
                    Submit
                </Button>
            </div>
        </>
    )
}

export default RegisterPage
