'use client'

import { signOut, useSession } from "next-auth/react"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PathLinks } from "../types/path-links"

export function NavBar() {
    const { data: session, status } = useSession()

    return (
        <nav className="w-full h-[9dvh] flex items-center justify-between bg-white/95 px-6 backdrop-blur shadow-[0_4px_20px_rgba(126,34,206,0.25)]">
            <h1 className="font-bold text-lg text-purple-700">
                MailConecta
            </h1>

            {status === "authenticated" && (
                <div className="flex items-center gap-4">
                    <h2 className="text-sm text-gray-600">
                        Olá,{" "}
                        <span className="font-medium text-gray-800">
                            {session?.user?.name?.split(" ")[0]}
                        </span>
                    </h2>

                    <Button
                        variant="ghost"
                        onClick={() => signOut({
                            callbackUrl: PathLinks.LOGIN
                        }
                        )}
                        className="flex items-center gap-2 h-9 px-4 text-gray-700 hover:text-purple-700"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Sair</span>
                    </Button>

                </div>
              )}
        </nav>
    )
}
