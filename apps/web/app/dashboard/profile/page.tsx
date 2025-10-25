import { getSession } from "@/app/(auth)/actions/session";
import { Role } from "@/app/(auth)/types/types";
import { redirect } from "next/navigation";

export default async function ProfilePage() {


    const session = await getSession();

    if(!session || !session.user) redirect("/login");
    if(session.user.role !== Role.ADMIN) redirect("/");

    return (
        <div>
           ProfilePage

            <pre>
                {JSON.stringify(session)}
            </pre>
        </div>
    )
}