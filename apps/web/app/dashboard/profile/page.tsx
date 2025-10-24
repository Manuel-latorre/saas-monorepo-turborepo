import { getProfile } from "@/lib/actions/profile"

export default async function ProfilePage() {


    const res = await getProfile();

    return (
        <div>
           ProfilePage

            <pre>
                {JSON.stringify(res)}
            </pre>
        </div>
    )
}