import ProfileHeader from "@/components/shared/ProfileHeader";
import { fetchSearchUsers, fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import { table } from "console";
import Image from "next/image";
import ThreadsTab from "@/components/shared/ThreadsTab";
import UserCard from "@/components/cards/UserCard";

const Page = async() => {

    const user = await currentUser();

    if(!user) return  null;

    const userInfo = await fetchUser(user.id);

    if(!userInfo?.onboarded) redirect('/onboarded')


    //fetch user
    const result = await fetchSearchUsers({
        userId: user.id,
        searchString: "",
        pageNumber: 1,
        pageSize: 25
    })



    return (
        <section>
            <h1 className="head-text mb-10">communities</h1>

            <div className="mt-14 flex flex-col gap-9">
                {result.users.length ===0 ? (
                    <p className="no-result">No Users</p>
                ) : (
                    <>
                        {result.users.map((person) => (
                            <UserCard 
                                key={person.id}
                                id={person.id}
                                name={person.name}
                                username={person.username}
                                imgUrl={person.image}
                                personType='User'
                            />
                        ))}
                    </>
                )}
            </div>
            {/* search bar  */}
        </section>
    )
}

export default Page;