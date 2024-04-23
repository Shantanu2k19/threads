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

    if(!userInfo?.onboarded) redirect('/onboarding')

    return (
        <section>
            <h1 className="head-text mb-10">communities</h1>
        </section>
    )
}

export default Page;