import { ThemeToggle } from "../components/ThemeToggle"
import { StarBackground } from "../components/StarBackground"
import { Navbar } from "../components/Navbar"
import { HeroSection } from "../components/HeroSection"
import { AboutSection } from "../components/about"
import { SkillsSection } from "../components/SkillsSection"
import { ProjectSection } from "../components/ProjectsSection "
import { ContactSection } from "../components/ContactSection"
import { Footer } from "../components/Footer"
import { ProjectStudio } from "../components/ProjectStudio"
export const Home = () => {
    return <><div className="min-h-dvh bg-background text-foreground overflow-x-hidden">
        {/* Theme Toggle*/}
        <ThemeToggle/>


        {/*Background effects*/}
        <StarBackground/>

        {/*Nav bar*/}
        <Navbar/>
        <main id="main-content">
          <HeroSection/>
          <AboutSection/>
          <SkillsSection/>
          <ProjectSection/>
          <ContactSection/>
          <Footer/>
        </main>
        </div></>
}

export const Studio = () => {
    return <div className="min-h-dvh bg-background text-foreground overflow-x-hidden">
        <ProjectStudio />
    </div>
}
