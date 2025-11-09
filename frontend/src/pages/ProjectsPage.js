import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import { toast } from 'sonner';
import { Plus, Users, Github, ExternalLink } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tech_stack: '',
    github_url: ''
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await api.getProjects();
      setProjects(response.data);
    } catch (error) {
      console.error('Error loading projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    
    try {
      const tech_stack = formData.tech_stack.split(',').map(t => t.trim()).filter(t => t);
      await api.createProject({
        name: formData.name,
        description: formData.description,
        tech_stack,
        github_url: formData.github_url || null
      });
      
      toast.success('Project created successfully!');
      setCreateDialogOpen(false);
      setFormData({ name: '', description: '', tech_stack: '', github_url: '' });
      loadProjects();
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project');
    }
  };

  if (loading) {
    return <div className="text-center text-cyan-400 text-xl">Loading projects...</div>;
  }

  return (
    <div className="space-y-6" data-testid="projects-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Projects</h1>
          <p className="text-gray-400">Collaborate on awesome projects with the community</p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="glow-button" data-testid="create-project-btn">
              <Plus className="mr-2" size={20} />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-white/20 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl gradient-text">Create New Project</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateProject} className="space-y-4" data-testid="create-project-form">
              <div className="space-y-2">
                <Label>Project Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="My Awesome Project"
                  className="bg-white/5 border-white/10 text-white"
                  required
                  data-testid="project-name-input"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your project..."
                  className="bg-white/5 border-white/10 text-white min-h-[100px]"
                  required
                  data-testid="project-description-input"
                />
              </div>
              <div className="space-y-2">
                <Label>Tech Stack (comma-separated)</Label>
                <Input
                  value={formData.tech_stack}
                  onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })}
                  placeholder="React, Node.js, MongoDB"
                  className="bg-white/5 border-white/10 text-white"
                  data-testid="project-tech-input"
                />
              </div>
              <div className="space-y-2">
                <Label>GitHub URL (Optional)</Label>
                <Input
                  value={formData.github_url}
                  onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                  placeholder="https://github.com/..."
                  className="bg-white/5 border-white/10 text-white"
                  data-testid="project-github-input"
                />
              </div>
              <Button type="submit" className="w-full glow-button" data-testid="submit-project-btn">
                Create Project
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link key={project.id} to={`/projects/${project.id}`}>
            <div className="glass-card p-6 hover-lift scanline h-full" data-testid={`project-card-${project.id}`}>
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-white">{project.name}</h3>
                <span className={`text-xs px-3 py-1 rounded-full ${
                  project.status === 'active' ? 'bg-green-500/20 text-green-400' :
                  project.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {project.status}
                </span>
              </div>
              
              <p className="text-gray-400 text-sm mb-4 line-clamp-3">{project.description}</p>
              
              {project.tech_stack && project.tech_stack.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech_stack.map((tech, idx) => (
                    <span key={idx} className="text-xs px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center space-x-2 text-gray-400">
                  <Users size={16} />
                  <span className="text-sm">{project.members?.length || 0} members</span>
                </div>
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Github size={20} />
                  </a>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="glass-card p-12 text-center">
          <div className="w-20 h-20 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus size={40} className="text-cyan-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No projects yet</h3>
          <p className="text-gray-400 mb-6">Be the first to create a project!</p>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;