import { useEffect, useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import { api } from "@/lib/axiosConfig";
import { Trash2 } from "lucide-react";
import { Back } from "../components/BackNav";

const emptyForm = {
  title: "",
  description: "",
  tags: "",
  demoUrl: "",
  githubUrl: "",
  otherlinks: "",
  images: [],
};

const readToken = () => localStorage.getItem("token") || "";

export const ProjectStudio = () => {
  const [authForm, setAuthForm] = useState({ email: "", password: "" });
  const [token, setToken] = useState(readToken);
  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const loadProjects = useCallback(async (nextToken = token) => {
    if (!nextToken) {
      setProjects([]);
      return;
    }

    setLoading(true);
    try {
      const response = await api.get("/projects", {
        headers: { Authorization: `Bearer ${nextToken}` },
      });
      setProjects(response.data?.data ?? []);
    } catch (error) {
      toast.error("Could not load your projects.");
      console.error("Load projects failed:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleAuthChange = (event) => {
    const { name, value } = event.target;
    setAuthForm((current) => ({ ...current, [name]: value }));
  };

  const handleSignIn = async (event) => {
    event.preventDefault();
    setSigningIn(true);

    try {
      const response = await api.post("/signIn", authForm);
      const nextToken = response.data?.token;

      if (!nextToken) {
        throw new Error("No token returned");
      }

      setToken(nextToken);
      toast.success("Signed in.");
      await loadProjects(nextToken);
    } catch (error) {
      toast.error("Sign in failed. Please check your credentials.");
      console.error("Studio sign-in failed:", error);
    } finally {
      setSigningIn(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleImagesChange = (event) => {
    setForm((current) => ({
      ...current,
      images: Array.from(event.target.files ?? []),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!token) {
      toast.error("Please sign in first.");
      return;
    }

    setSaving(true);
    try {
      const projectData = new FormData();
      projectData.append("title", form.title);
      projectData.append("description", form.description);
      projectData.append("demoUrl", form.demoUrl);
      projectData.append("githubUrl", form.githubUrl);

      const parsedTags = form.tags
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
      projectData.append("tags", JSON.stringify(parsedTags));

      const parsedOtherLinks = form.otherlinks
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
      projectData.append("otherlinks", JSON.stringify(parsedOtherLinks));

      form.images.forEach((image) => {
        projectData.append("images", image);
      });

      await api.post("/projects", projectData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Project saved.");
      setForm(emptyForm);
      event.currentTarget.reset();
      await loadProjects(token);
    } catch (error) {
      toast.error("Could not save project.");
      console.error("Create project failed:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!token) {
      toast.error("Please sign in first.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this project?")) {
      return;
    }

    setDeletingId(id);
    try {
      await api.delete(`/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Project deleted.");
      await loadProjects(token);
    } catch (error) {
      toast.error("Could not delete project.");
      console.error("Delete project failed:", error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="px-4 py-20 md:py-24">
      <Back/>
      <div className="container mx-auto max-w-6xl">
        <div className="mb-10">
          <h1 className="text-3xl font-bold md:text-4xl">
            Project <span className="text-primary">Studio</span>
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Sign in to manage your projects. Public project cards are loaded by
            user id, so the showcase can still render without login.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-6 rounded-lg border border-border bg-card p-6 shadow-xs">
            <form className="space-y-4" onSubmit={handleSignIn}>
              <h2 className="text-2xl font-semibold">Studio Sign In</h2>
              <input
                name="email"
                type="email"
                value={authForm.email}
                onChange={handleAuthChange}
                placeholder="Email"
                className="w-full rounded-md border border-input bg-background px-4 py-3 outline-hidden transition focus:ring-2 focus:ring-primary"
              />
              <input
                name="password"
                type="password"
                value={authForm.password}
                onChange={handleAuthChange}
                placeholder="Password"
                className="w-full rounded-md border border-input bg-background px-4 py-3 outline-hidden transition focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                disabled={signingIn}
                className="starry-button w-full disabled:cursor-not-allowed disabled:opacity-70"
              >
                {signingIn ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">New Project</h2>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  placeholder="Title"
                  className="w-full rounded-md border border-input bg-background px-4 py-3 outline-hidden transition focus:ring-2 focus:ring-primary"
                />
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Description"
                  className="w-full resize-none rounded-md border border-input bg-background px-4 py-3 outline-hidden transition focus:ring-2 focus:ring-primary"
                />
                <input
                  id="tags"
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  placeholder="Tags (comma separated, e.g. React, Node.js)"
                  className="w-full rounded-md border border-input bg-background px-4 py-3 outline-hidden transition focus:ring-2 focus:ring-primary"
                />
                <input
                  id="demoUrl"
                  name="demoUrl"
                  value={form.demoUrl}
                  onChange={handleChange}
                  placeholder="Live Demo URL"
                  className="w-full rounded-md border border-input bg-background px-4 py-3 outline-hidden transition focus:ring-2 focus:ring-primary"
                />
                <input
                  id="githubUrl"
                  name="githubUrl"
                  value={form.githubUrl}
                  onChange={handleChange}
                  placeholder="GitHub Repository URL"
                  className="w-full rounded-md border border-input bg-background px-4 py-3 outline-hidden transition focus:ring-2 focus:ring-primary"
                />
                <input
                  id="otherlinks"
                  name="otherlinks"
                  value={form.otherlinks}
                  onChange={handleChange}
                  placeholder="Other Links (comma separated)"
                  className="w-full rounded-md border border-input bg-background px-4 py-3 outline-hidden transition focus:ring-2 focus:ring-primary"
                />
                <input
                  id="images"
                  name="images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImagesChange}
                  className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm outline-hidden transition file:mr-4 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-2 file:text-sm file:font-medium file:text-secondary-foreground focus:ring-2 focus:ring-primary"
                />
                <button
                  type="submit"
                  disabled={saving || !token}
                  className="starry-button w-full disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {saving ? "Saving..." : "Save Project"}
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Your Projects</h2>
              <button
                type="button"
                onClick={() => loadProjects()}
                className="rounded-md border border-border px-4 py-2 text-sm transition hover:border-primary hover:text-primary"
              >
                Refresh
              </button>
            </div>

            {!token ? (
              <p className="text-muted-foreground">
                Sign in to view and manage your projects.
              </p>
            ) : loading ? (
              <p className="text-muted-foreground">Loading projects...</p>
            ) : projects.length === 0 ? (
              <p className="text-muted-foreground">
                No projects found for this user.
              </p>
            ) : (
              <div className="grid gap-4">
                {projects.map((project) => (
                  <article
                    key={project.id}
                    className="rounded-lg border border-border bg-card p-5 shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {project.title}
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {project.description}
                        </p>
                        {project.tags && project.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {project.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full border border-border bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                          #{project.id}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDelete(project.id)}
                          disabled={deletingId === project.id}
                          className="rounded-md border border-destructive/40 p-2 text-destructive transition hover:bg-destructive hover:text-destructive-foreground disabled:opacity-50"
                          title="Delete project"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};