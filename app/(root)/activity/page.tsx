import ProfileHeader from "@/components/shared/ProfileHeader";
import { fetchSearchUsers, fetchUser, getActivity } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import { table } from "console";
import Image from "next/image";
import ThreadsTab from "@/components/shared/ThreadsTab";
import UserCard from "@/components/cards/UserCard";
import Link from "next/link";


//getActivity

const Page = async() => {

    const user = await currentUser();

    if(!user) return  null;

    const userInfo = await fetchUser(user.id);

    if(!userInfo?.onboarded) redirect('/onboarding')
 
    const activity = await getActivity(userInfo._id)

    return (
        <section>
            <h1 className="head-text mb-10">Activity</h1>

            <section className="mt-10 flex flecx-col gap-5">
                {activity.length >0 ? (
                    <>
                        {activity.map((activity) => (
                            <Link key={activity._id} href={`/thread/${activity.parentId}`}>
                                <article className="activity-card">
                                    <Image 
                                        src={activity.author.image}
                                        alt="profile pic"
                                        width={40}
                                        height={40}
                                        className="rounded-full object-cover"
                                    />
                                    <p className="!text-small-regular text-light-1">
                                        <span className="mr-1 text-primary-500">
                                            {activity.author.name}
                                        </span>
                                        replied to your thread
                                    </p>
                                </article>
                            </Link>
                        ))}
                    </>
                    ): <p className="!text-base-regular text-light-3">No Activity yet</p>}
            </section>
        </section>
    )
}

export default Page;