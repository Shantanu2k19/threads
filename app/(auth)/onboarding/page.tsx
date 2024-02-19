import AccounProfile from "@/components/forms/AccountProfile"
import { currentUser } from '@clerk/nextjs';

async function Page(){
    const user = await currentUser();

    const userInfo = {
        id :"1",
        objectId : "d",
        username : "shan",
        name : "shann",
        imageUrl : "sd",
        bio : "wedf",
    };

    const userData = {
        id: user?.id || "",
        objectId : userInfo?.objectId || "",
        username : userInfo?.username || "",
        name : userInfo?.name || user?.firstName || "",
        image : userInfo?.imageUrl || user?.imageUrl || 
        "",
        bio: userInfo?.bio || "",
    }

    return (
        <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
            <h1 className="head-text"> Onboarding</h1>
            <p className="mt-3 text-base-regular text-light-2">
                Complete your profile to use Threads
            </p>

            <section className="mt-9 bg-dark-2 p-10">
                <AccounProfile
                    user={userData}
                    btnTitle="Continue"
                />
            </section>
        </main>
    )
}

export default Page;
