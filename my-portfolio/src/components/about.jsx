
import { Briefcase, Code, User } from "lucide-react"

export const AboutSection = () =>{
    return<section id="about" className="py-24 px-4 relative">
        {""}
        <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
                About <span className="text-primary">Me</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <h3 className="text-2xl font-semibold">Passionate Web Developer</h3>
                    <p className="text-muted-foreground">
                        I specialize in creating fast and responsive web applications designing secure web apps from frontend to the backend using modern technologies.
                    </p>
                    <p className="text-muted-foreground">
                        <span>PROFILE</span>
                        I'm a problem solver the type of guy that loves a challenge be it fixing bug's or learning new techniques and technologies 
                        I am passionate about continuous improvement and strive for excellence in everything I do. I am always looking for ways to learn and grow, both personally and professionally.

                        Fullname:
                        Bakre Eniola Dahud
                        Job: Freelancer, Junior Full Stack Web Developer
                        Email: thrill.codex@gmail.com
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
                    <a href="#contact" className="starry-button">
                    {""}
                    Get In Touch
                    </a>

                    <a href="" className="px-6 py-2 rounded-full border border-primary text-primary hover:bg-primary/10 transition-colors duration-300">
                    {""}
                    Download CV
                    </a>
                    </div>
                </div>


                <div className="grid grid-cols-1 gap-6">
                   
                   <div className="gradient-border p-6 card-hover">
                   <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-primary/10">
                    <Code className="h-6 w-6 text-primary"/>
                    </div>
                    <div className="text-left">
                        <h4 className="font-semibold text-lg">Web Development</h4>

                        <p className="text-muted-foreground">
                            I have a demonstrated track record of resolving designing and developing user interfaces for high-traffic web applications.
                        </p>
                    
                    </div>
                    </div>
                    </div>

                     <div className="gradient-border p-6 card-hover">
                       <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-primary/10">
                    <User className="h-6 w-6 text-primary"/>
                    </div> 
                    <div className="text-left">
                        <h4 className="font-semibold text-lg">UI/UX Design</h4>
                        
                        <p className="text-muted-foreground">
                            Designing intuitive user interfaces and seamless user experiences.
                        </p>
                    </div>
                    </div>
                    </div>

                     <div className="gradient-border p-6 card-hover">
                        <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-primary/10">
                    
                    <Briefcase className="h-6 w-6 text-primary"/>
                    </div>
                    
                    <div className="text-left">
                        <h4 className="font-semibold text-lg">Project Management</h4>
                        
                        <p className="text-muted-foreground">
                            Leading projects from conception with agile methodologies
                        </p>
                    </div>
                    </div>
                    </div>
                    

                </div>
                </div>
        </div>
    </section>
}
