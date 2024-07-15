"use client"

import { useRouter } from "next/navigation";
import { ChangeEvent, use, useState } from "react"

export default function CreatePage(){

    const[formData, setFormData] = useState({term: "", interpretation: ""});
    const[isLoading, setIsLoading]  = useState(false);
    const[error, setError] = useState<string | null>(null);

    const router = useRouter();


    const handleInputChange = (e:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>{
        setFormData((prevData)=>(
            {...prevData, [e.target.name] : e.target.value}
        ))
    }

    const handleSubmit = async (e:React.FormEvent) =>{
        e.preventDefault();

        if(!formData.term || !formData.interpretation){
            setError("Please fill in all the fields");
            return;
        }

        setError(null);
        setIsLoading(true);
        try {
            const response = await fetch("/api/interpretations", {method: "POST", headers: {'Content-Type': "application/json"},
            body:JSON.stringify(formData)})
            if(!response.ok){
                throw new Error("Failed to create interpretation")
            }
            router.push("/")
        } catch (error) {
            console.log(error);
            setError("Something went wrong, Please Try Again")
        } finally{
            setIsLoading(false);
        }
    }

    return(
        <div>
            <h2 className="text-2xl font-bold my-8">Add New Interpretation</h2>

            <form className="flex gap-3 flex-col" onSubmit={handleSubmit}>
                <input type="text" name="term" value={formData.term} placeholder="Term" className="py-1 px-4 border rounded-md" onChange={handleInputChange} />
                <textarea name="interpretation" value={formData.interpretation} rows={4} placeholder="Interpretation"
                className="py-1 px-4 border rounded-md resize-none" onChange={handleInputChange}></textarea>
                <button className="bg-black text-white mt-5 px-4 py-1 rounded-md cursor-pointer" type="submit" disabled={isLoading}>{isLoading ? "Adding" : "Add Interpretation"}</button>
            </form>
            {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
    )
}