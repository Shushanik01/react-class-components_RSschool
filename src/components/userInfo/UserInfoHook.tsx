import { useForm } from "react-hook-form";
import { addUserInfo } from "../../slices/userInfoSlice";
import {useDispatch} from 'react-redux';
import type { UserInfo } from "../../slices/userInfoSlice";


export default function UserInfoHook() {

    const { register, handleSubmit, formState:{errors} } = useForm<UserInfo>();

    const dispatch = useDispatch();

    const sendDataToStore = (data: UserInfo)=>{
        dispatch(addUserInfo(data))
    }

    return (
        <form 
        action="submit"
        onSubmit={handleSubmit(sendDataToStore)}
        >
            <label htmlFor="text">Enter your name</label>
            <input {...register('name')} type="text" />
            {errors.name && <span>{errors.name.message}</span>}

            <label htmlFor="text">Enter your email</label>
            <input {...register('email')} type="text" />
            {errors.email && <span>{errors.email.message}</span>}

            <label htmlFor="">Select your gender</label>
            <select {...register('gender')} name="gender" id="gender">

                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="none">none</option>
            </select>

            <label htmlFor="number">Enter your age</label>
            <input {...register('age')} type="number" />
            {errors.age && <span>{errors.age.message}</span>}

            <label htmlFor="">I agree with your terms and conditions</label>
            <input {...register('termsAccepted')} type="checkbox" />
            {errors.termsAccepted && <span>{errors.termsAccepted.message}</span>}

            <button>Submit</button>
        </form>
    )

}