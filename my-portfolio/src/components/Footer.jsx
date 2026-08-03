import { useEffect, useState } from "react"
import { ArrowUp } from "lucide-react"

export const Footer = () => {
    const [showScrollTop, setShowScrollTop] = useState(false)

    useEffect(() => {
        const handleScroll = () => setShowScrollTop(window.scrollY > 10)
        window.addEventListener("scroll", handleScroll)
        handleScroll()
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <>
            <footer className="py-12 border-t-3 px-4 md:px-8 bg-card border-t border-border flex flex-col items-center justify-center gap-4 text-center">
                <p className="text-sm text-muted-foreground max-w-2xl">
                    &copy; {new Date().getFullYear()} bakreeniola.dev, All rights reserved
                </p>
            </footer>
            {showScrollTop && (
                <a
                    href="#hero"
                    aria-label="Back to top"
                    className="fixed bottom-6 right-6 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 transition-opacity duration-200 hover:bg-primary"
                >
                    <ArrowUp aria-hidden="true" />
                </a>
            )}
        </>
    )
}
