import React, { useEffect, useState } from 'react';
import * as api from '../services/api';

const ResourceLibraryPage = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResources() {
      try {
        const res = await api.getResources();
        setResources(res.resources || res); // handle both { resources: [...] } and array
      } catch {
        setResources([]);
      }
      setLoading(false);
    }
    fetchResources();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!resources.length) return <div>No resources found.</div>;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-4">Resource Library</h2>
      <ul className="space-y-4">
        {resources.map(resource => (
          <li key={resource.id} className="border rounded p-4 bg-white shadow">
            <div className="font-semibold text-lg">{resource.title}</div>
            <div className="text-sm text-gray-600">Type: {resource.type} | Subject: {resource.subject} | Semester: {resource.semester}</div>
            {resource.url && (
              <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline mt-2 inline-block">Open Resource</a>
            )}
            {resource.description && (
              <div className="text-gray-700 mt-2">{resource.description}</div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResourceLibraryPage; 