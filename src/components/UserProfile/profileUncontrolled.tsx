import { useRef } from "react";
import { useDispatch, } from "react-redux";
import { addProfileDetails } from "../../slices/userProfileSlice";

function ProfileUncontrolledForm() {

    const profileRef = useRef(null)
    const dispatch = useDispatch();


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!profileRef.current) return
        const formData = new FormData(profileRef.current)
        const file = formData.get('picture') as File;
        const reader = new FileReader();
        reader.onload = () => {
            dispatch(addProfileDetails({
                profilePicture: reader.result as string,
                username: formData.get('name') as string,
                password: formData.get('password') as string,
            }));
        };
        reader.readAsDataURL(file);
    }

    return (
        <form
            ref={profileRef}
            action="submit"
            onSubmit={handleSubmit}
        >

            <label htmlFor="picture">Upload a profile picture</label>
            <input type="file" accept="image/*" name="picture" id="picture" />

            <label htmlFor="name">Enter your username</label>
            <input type="text" name="name" id="name" />

            <label htmlFor="password">Enter your password</label>
            <input type="text" name="password" id="password" />
        </form>
    )
}
export default ProfileUncontrolledForm