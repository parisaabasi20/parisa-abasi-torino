import { redirect } from "next/navigation";

function dashboard() {
    redirect("/dashboard/profile");
}

export default dashboard;
