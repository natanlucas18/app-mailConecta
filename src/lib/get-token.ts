'use server';

import { getServerSession } from "next-auth";
import { authOptions } from "../app/api/auth/[...nextauth]/route";

export async function getToken() {
    const session = await getServerSession(authOptions);

    if(session?.user.accessToken) {
        return session.user.accessToken
    }

    return null;
};