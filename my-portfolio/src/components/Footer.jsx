import { ArrowUp } from "lucide-react"


export const Footer = () => {
    return(<footer className="py-12 px-4 bg-card relative border-t border-border mt-12 pr-8 flex flex-wrap justify-between">
        {" "}
        <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()}
             thrill.io, All rights reserved
        </p>
        <a href="#hero" aria-label="Back to top" className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors">
            <ArrowUp aria-hidden="true"/>
        </a>
    </footer>)
}
