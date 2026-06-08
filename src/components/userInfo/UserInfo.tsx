import { useEffect, useRef } from "react";
import {  useDispatch } from "react-redux";
import { addUserInfo } from "../../slices/userInfoSlice";


export default function UserInfoUncontrolled() {

    const userRef = useRef<HTMLFormElement>(null);

    useEffect(()=>{
        userRef.current?.focus()
    });

    const dispatch = useDispatch()

    const handleSubmit = (e: React.FormEvent)=>{
        e.preventDefault();

        const data = new FormData(userRef.current)

        dispatch(addUserInfo({
            name: data.get('name') as string,
            email: data.get('email') as string,
            gender: data.get('gender') as string,
            age: Number(data.get('age')),
            termsAccepted: data.get('termsAccepted') === 'on'
        }))
    }

    return (
        <div>
            <form
            ref={userRef}
            action="submit"
            onSubmit={handleSubmit}
            >
            <label htmlFor="text">Enter your name</label>
            <input type="text" />
            <label htmlFor="text">Enter your email</label>
            <input type="text" />
            <label htmlFor="">Select your gender</label>
            <select name="gender" id="gender">
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="none">none</option>
            </select>
            <label htmlFor="number">Enter your age</label>
            <input type="number" />
            <label htmlFor="">I agree with your terms and conditions</label>
            <input type="checkbox" />

            <button
            >Submit</button>
            </form>
        </div>
    )
}