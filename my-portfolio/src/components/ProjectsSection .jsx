import { ArrowRight, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/axiosConfig";

const fallbackProjects = [
  {
    id: 1,
    title: "fazdad",
    description: "full featured webpage",
    image: "/projects/fazdad.avif",
    tags: ["React", "Node.js"],
    demoUrl: "https://fazdad.vercel.app",
    githubUrl: "https://github.com/Jennygit125",
  },
  {
    id: 2,
    title: "resume-builder",
    description: "full-stack resume builder",
    image: "/projects/resume.png",
    tags: ["React", "tailwind css", "Supabase"],
    demoUrl: "https://first-react-ryjt.vercel.app",
    githubUrl: "https://github.com/Jennygit125",
  },
  {
    id: 3,
    title: "simple tic tac toe",
    description: "tic-tac-toe game",
    image: "/projects/ticTacToe.avif",
    tags: ["CSS", "Javascript", "HTML"],
    demoUrl: "https://jennygit125.github.io/tic-tac-toe/",
    githubUrl: "https://github.com/Jennygit125",
  },
];

const mapProject = (project) => ({
  id: project.id,
  title: project.title,
  description: project.description,
  image: project.imageUrl?.[0] || "/projects/fazdad.avif",
  tags: project.tags ?? [],
  demoUrl: project.demoUrl || "#",
  githubUrl: project.githubUrl || "#",
});

export const ProjectSection = () => {
  const [projects, setProjects] = useState(fallbackProjects);

  useEffect(() => {
    const loadUserProjects = async () => {
      try {
        const response = await api.get("/projects/user/1");
        const fetchedData = response.data?.data;

        if (Array.isArray(fetchedData) && fetchedData.length > 0) {
          const loadedProjects = fetchedData.map(mapProject);
          setProjects(loadedProjects);
        }
      } catch (error) {
        console.error("Failed to load projects for user 2, using fallbacks:", error);
      }
    };

    loadUserProjects();
  }, []);

  return (
    <section id="projects" className="relative px-4 py-24">
      <div className="container mx-auto max-w-5xl">
        <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
          Featured <span className="text-primary">Projects</span>
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
          Here are some of my recent projects
        </p>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group overflow-hidden rounded-lg bg-card shadow-xs card-hover"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <div className="mb-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="mb-1 text-xl font-semibold">{project.title}</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  {project.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex space-x-3">
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-foreground/80 transition-colors duration-300 hover:text-primary"
                    >
                      <ExternalLink size={20} />
                    </a>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-foreground/80 transition-colors duration-300 hover:text-primary"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            className="starry-button mx-auto flex w-fit items-center gap-2"
            target="_blank"
            rel="noreferrer"
            href="https://github.com/Jennygit125"
          >
            Check My Github
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
};