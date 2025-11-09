import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../utils/api';
import { toast } from 'sonner';
import { Plus, GripVertical } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'medium'
  });

  useEffect(() => {
    loadProjectData();
  }, [id]);

  const loadProjectData = async () => {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        api.getProject(id),
        api.getTasks(id)
      ]);
      setProject(projectRes.data);
      setTasks(tasksRes.data);
    } catch (error) {
      console.error('Error loading project:', error);
      toast.error('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.createTask({
        project_id: id,
        title: taskForm.title,
        description: taskForm.description,
        priority: taskForm.priority
      });
      toast.success('Task created!');
      setCreateTaskOpen(false);
      setTaskForm({ title: '', description: '', priority: 'medium' });
      loadProjectData();
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      await api.updateTask(taskId, { status: newStatus });
      loadProjectData();
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };

  if (loading) {
    return <div className="text-center text-cyan-400 text-xl">Loading project...</div>;
  }

  const todoTasks = tasks.filter(t => t.status === 'todo');
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
  const doneTasks = tasks.filter(t => t.status === 'done');

  return (
    <div className="space-y-6" data-testid="project-detail-page">
      <div className="glass-card p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">{project?.name}</h1>
            <p className="text-gray-400">{project?.description}</p>
          </div>
          <span className="px-4 py-2 bg-green-500/20 text-green-400 rounded-full">
            {project?.status}
          </span>
        </div>
        
        {project?.tech_stack && project.tech_stack.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {project.tech_stack.map((tech, idx) => (
              <span key={idx} className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded">
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Kanban Board</h2>
        <Dialog open={createTaskOpen} onOpenChange={setCreateTaskOpen}>
          <DialogTrigger asChild>
            <Button className="glow-button" data-testid="create-task-btn">
              <Plus className="mr-2" size={20} />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-white/20 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl gradient-text">Create New Task</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateTask} className="space-y-4" data-testid="create-task-form">
              <div className="space-y-2">
                <Label>Task Title</Label>
                <Input
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  placeholder="Implement feature..."
                  className="bg-white/5 border-white/10 text-white"
                  required
                  data-testid="task-title-input"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  placeholder="Task details..."
                  className="bg-white/5 border-white/10 text-white"
                  required
                  data-testid="task-description-input"
                />
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={taskForm.priority} onValueChange={(value) => setTaskForm({ ...taskForm, priority: value })}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-white/10">
                    <SelectItem value="low" className="text-white">Low</SelectItem>
                    <SelectItem value="medium" className="text-white">Medium</SelectItem>
                    <SelectItem value="high" className="text-white">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full glow-button" data-testid="submit-task-btn">
                Create Task
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* To Do Column */}
        <div className="glass-card p-4" data-testid="kanban-todo-column">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white">To Do</h3>
            <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded text-sm">{todoTasks.length}</span>
          </div>
          <div className="space-y-3">
            {todoTasks.map((task) => (
              <div key={task.id} className="glass-card p-4 cursor-move hover-lift" data-testid={`task-${task.id}`}>
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-white text-sm">{task.title}</h4>
                  <GripVertical size={16} className="text-gray-500" />
                </div>
                <p className="text-gray-400 text-xs mb-3">{task.description}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded ${
                    task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                    task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {task.priority}
                  </span>
                  <button
                    onClick={() => handleUpdateTaskStatus(task.id, 'in_progress')}
                    className="text-xs text-cyan-400 hover:text-cyan-300"
                  >
                    Start
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* In Progress Column */}
        <div className="glass-card p-4" data-testid="kanban-progress-column">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white">In Progress</h3>
            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-sm">{inProgressTasks.length}</span>
          </div>
          <div className="space-y-3">
            {inProgressTasks.map((task) => (
              <div key={task.id} className="glass-card p-4 cursor-move hover-lift border-l-2 border-yellow-400" data-testid={`task-${task.id}`}>
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-white text-sm">{task.title}</h4>
                  <GripVertical size={16} className="text-gray-500" />
                </div>
                <p className="text-gray-400 text-xs mb-3">{task.description}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded ${
                    task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                    task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {task.priority}
                  </span>
                  <button
                    onClick={() => handleUpdateTaskStatus(task.id, 'done')}
                    className="text-xs text-green-400 hover:text-green-300"
                  >
                    Complete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Done Column */}
        <div className="glass-card p-4" data-testid="kanban-done-column">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white">Done</h3>
            <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-sm">{doneTasks.length}</span>
          </div>
          <div className="space-y-3">
            {doneTasks.map((task) => (
              <div key={task.id} className="glass-card p-4 opacity-70 border-l-2 border-green-400" data-testid={`task-${task.id}`}>
                <h4 className="font-medium text-white text-sm mb-2 line-through">{task.title}</h4>
                <p className="text-gray-400 text-xs mb-3">{task.description}</p>
                <span className={`text-xs px-2 py-1 rounded ${
                  task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                  task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;