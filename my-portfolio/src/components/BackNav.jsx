import {cn} from "@/lib/util.js";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";



const backItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/#about" },
    { name: "Skills", href: "/#skills" },
    { name: "Projects", href: "/#projects" },
    { name: "Contact", href: "/#contact" },
];

export const Back = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    useEffect(() => {
    const handleScroll = () => {
        setIsScrolled(window.scrollY > 10);
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)}, [])

    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? "hidden" : "";

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isMenuOpen]);

    return(
        <nav className={cn("fixed inset-x-0 top-0 z-40 transition-all duration-300", isScrolled ? "py-3 bg-background/85 backdrop-blur-md shadow-xs border-b border-border/60": "py-4 md:py-5")}>
            <div className="container flex items-center justify-between">
                <a className="text-xl font-bold text-primary flex items-center" href="#hero">
                    <span className="relative z-10">
                    <span className="text-glow text-foreground">The</span>{""}
                    thrill
                    </span>
                </a>
                {/*desktop nav*/}
                <div className="hidden md:flex space-x-8">
                   {backItems.map((item) => (
                    <a key={item.name} href={item.href} className="text-foreground/80 hover:text-primary transition-colors duration-300">{item.name}</a>
                   ))} 
                </div>

                {/*mobile nav*/}
                <button type="button" onClick={() => setIsMenuOpen((prev) => !prev)}
                className="z-50 rounded-lg border border-border bg-background/80 p-2 text-foreground shadow-xs backdrop-blur transition-colors hover:bg-secondary md:hidden"
                aria-label={isMenuOpen ? "Close Menu": "Open Menu"}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
                >{isMenuOpen ? <X size={24}/>: <Menu size={24} />}{""}
                </button>


                <div 
                className={cn("fixed inset-0 z-30 bg-background/70 backdrop-blur-sm transition-opacity duration-300 md:hidden",
                    isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setIsMenuOpen(false)}
                />

                <div 
                id="mobile-menu"
                className={cn("fixed inset-x-4 top-20 z-40 rounded-lg border border-border bg-card/95 p-3 shadow-2xl backdrop-blur-xl",
                    "transition-all duration-300 md:hidden",
                    isMenuOpen ? "translate-y-0 opacity-100 pointer-events-auto" : "-translate-y-3 opacity-0 pointer-events-none"
                )}>
                 <div className="flex flex-col gap-1 text-base font-medium">
                   {backItems.map((item) => (
                    <a key={item.name} href={item.href} className="rounded-md px-4 py-3 text-foreground/80 transition-colors duration-300 hover:bg-secondary hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                    >{item.name}</a>
                   ))} 
                </div>
                </div>
            </div>
        </nav>
    )
}