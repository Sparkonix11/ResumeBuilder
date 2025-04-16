import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { 
  getAllTemplates, 
  createTemplate, 
  updateTemplate, 
  deleteTemplate,
  ResumeTemplate
} from '../services/resumeTemplates';

const TemplatesPage = () => {
  const [templates, setTemplates] = useState<ResumeTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ResumeTemplate | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<ResumeTemplate>({
    name: '',
    description: '',
    layout: 'standard',
    fontFamily: 'Arial',
    primaryColor: '#3b82f6',
    secondaryColor: '#1e40af'
  });

  // Available options for templates
  const fontOptions = [
    'Arial', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 
    'Merriweather', 'Poppins', 'Georgia', 'Times New Roman'
  ];
  
  const layoutOptions = [
    { value: 'standard', label: 'Standard' },
    { value: 'modern', label: 'Modern' },
    { value: 'creative', label: 'Creative' },
    { value: 'minimal', label: 'Minimal' },
    { value: 'professional', label: 'Professional' }
  ];

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      const data = await getAllTemplates();
      setTemplates(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch templates');
      console.error('Error fetching templates:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      
      if (editingTemplate && editingTemplate.id) {
        await updateTemplate(editingTemplate.id, formData);
      } else {
        await createTemplate(formData);
      }
      
      fetchTemplates();
      resetForm();
    } catch (err) {
      setError('Failed to save template');
      console.error('Error saving template:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (template: ResumeTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      description: template.description || '',
      layout: template.layout,
      fontFamily: template.fontFamily || 'Arial',
      primaryColor: template.primaryColor || '#3b82f6',
      secondaryColor: template.secondaryColor || '#1e40af',
    });
    setShowForm(true);
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    
    if (!confirm('Are you sure you want to delete this template?')) return;
    
    try {
      setIsLoading(true);
      await deleteTemplate(id);
      fetchTemplates();
    } catch (err) {
      setError('Failed to delete template');
      console.error('Error deleting template:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      layout: 'standard',
      fontFamily: 'Arial',
      primaryColor: '#3b82f6',
      secondaryColor: '#1e40af'
    });
    setEditingTemplate(null);
    setShowForm(false);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Resume Templates</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage your resume templates and create new ones
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : 'Create New Template'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {showForm && (
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {editingTemplate ? 'Edit Template' : 'Create New Template'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Template Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="layout" className="block text-sm font-medium text-gray-700">
                    Layout Style
                  </label>
                  <select
                    id="layout"
                    name="layout"
                    value={formData.layout}
                    onChange={handleInputChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    {layoutOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="fontFamily" className="block text-sm font-medium text-gray-700">
                    Font Family
                  </label>
                  <select
                    id="fontFamily"
                    name="fontFamily"
                    value={formData.fontFamily}
                    onChange={handleInputChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    {fontOptions.map(font => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-3 grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700">
                      Primary Color
                    </label>
                    <div className="mt-1 flex items-center">
                      <input
                        type="color"
                        id="primaryColor"
                        name="primaryColor"
                        value={formData.primaryColor}
                        onChange={handleInputChange}
                        className="h-8 w-8 rounded-full overflow-hidden"
                      />
                      <input
                        type="text"
                        value={formData.primaryColor}
                        onChange={handleInputChange}
                        name="primaryColor"
                        className="ml-2 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="secondaryColor" className="block text-sm font-medium text-gray-700">
                      Secondary Color
                    </label>
                    <div className="mt-1 flex items-center">
                      <input
                        type="color"
                        id="secondaryColor"
                        name="secondaryColor"
                        value={formData.secondaryColor}
                        onChange={handleInputChange}
                        className="h-8 w-8 rounded-full overflow-hidden"
                      />
                      <input
                        type="text"
                        value={formData.secondaryColor}
                        onChange={handleInputChange}
                        name="secondaryColor"
                        className="ml-2 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300"
                >
                  {isLoading ? 'Saving...' : 'Save Template'}
                </button>
              </div>
            </form>
          </div>
        )}

        {isLoading && !showForm ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <div key={template.id} className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex justify-between">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">{template.name}</h3>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEdit(template)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleDelete(template.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">{template.description || 'No description available'}</p>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                      {template.layout}
                    </span>
                    {template.fontFamily && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                        {template.fontFamily}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex space-x-2">
                    {template.primaryColor && (
                      <div 
                        className="h-6 w-6 rounded-full" 
                        style={{ backgroundColor: template.primaryColor }}
                        title="Primary color"
                      ></div>
                    )}
                    {template.secondaryColor && (
                      <div 
                        className="h-6 w-6 rounded-full" 
                        style={{ backgroundColor: template.secondaryColor }}
                        title="Secondary color"
                      ></div>
                    )}
                  </div>
                </div>
                
                <div className="px-4 py-4 sm:px-6">
                  <div className="text-xs text-gray-500">
                    Created: {template.createdAt ? new Date(template.createdAt).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              </div>
            ))}

            {templates.length === 0 && !isLoading && (
              <div className="col-span-full text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No templates yet</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new resume template.</p>
                <div className="mt-6">
                  <button
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Create New Template
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TemplatesPage;