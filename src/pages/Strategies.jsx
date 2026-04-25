import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Upload,
  Code2,
  Play,
  X,
  Shield,
  FileCode,
  Loader2,
  Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/DashboardLayout';
import api from '../services/api';

export default function Strategies() {
  const navigate = useNavigate();
  const [scripts, setScripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [viewCode, setViewCode] = useState(null);
  const [viewCodeLoading, setViewCodeLoading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    name: '',
    source: '',
    description: '',
  });
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchScripts();
  }, []);

  async function fetchScripts() {
    try {
      const { data } = await api.get('/scripts');
      setScripts(data);
    } catch {
      setScripts([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(e) {
    e.preventDefault();
    setUploading(true);
    try {
      await api.post('/scripts', uploadForm);
      setShowUpload(false);
      setUploadForm({ name: '', source: '', description: '' });
      await fetchScripts();
    } catch {
      // error handled silently
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id) {
    setDeletingId(id);
    try {
      await api.delete(`/scripts/${id}`);
      toast.success('Strategy deleted');
      setScripts((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to delete strategy');
    } finally {
      setDeletingId(null);
    }
  }

  const filtered = scripts.filter(
    (s) =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-white">Strategies</h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search strategies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-lg border border-gray-700 bg-gray-800 py-2 pl-10 pr-4 text-sm text-gray-200 placeholder-gray-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <button
              onClick={() => setShowUpload(true)}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500"
            >
              <Upload className="h-4 w-4" />
              Upload Strategy
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-gray-800 bg-gray-900 py-20">
            <FileCode className="mb-4 h-12 w-12 text-gray-600" />
            <p className="text-gray-400">
              {search ? 'No strategies match your search.' : 'No strategies yet. Upload your first one!'}
            </p>
          </div>
        )}

        {/* Strategy grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((script) => (
              <div
                key={script.id}
                className="flex flex-col rounded-xl border border-gray-800 bg-gray-900 p-5 transition hover:border-gray-700"
              >
                <div className="mb-3 flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-white">
                    {script.name}
                  </h3>
                  {script.is_system ? (
                    <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-400">
                      <Shield className="h-3 w-3" />
                      System
                    </span>
                  ) : (
                    <button
                      onClick={() => handleDelete(script.id)}
                      disabled={deletingId === script.id}
                      title="Delete strategy"
                      className="rounded-lg p-1.5 text-gray-500 transition hover:bg-red-950/40 hover:text-red-400 disabled:opacity-50"
                    >
                      {deletingId === script.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  )}
                </div>
                <p className="mb-4 line-clamp-2 flex-1 text-sm text-gray-400">
                  {script.description || 'No description provided.'}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={async () => {
                      setViewCode({ name: script.name, source: null });
                      setViewCodeLoading(true);
                      try {
                        const { data } = await api.get(`/scripts/${script.id}`);
                        setViewCode(data);
                      } catch {
                        setViewCode({ name: script.name, source: '// Failed to load source code' });
                      } finally {
                        setViewCodeLoading(false);
                      }
                    }}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm font-medium text-gray-300 transition hover:border-gray-600 hover:text-white"
                  >
                    <Code2 className="h-4 w-4" />
                    View Code
                  </button>
                  <button
                    onClick={() => navigate(`/backtest?script=${script.id}`)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-500"
                  >
                    <Play className="h-4 w-4" />
                    Backtest
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View Code Modal */}
      {viewCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-3xl rounded-xl border border-gray-800 bg-gray-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
              <h2 className="text-lg font-semibold text-white">
                {viewCode.name}
              </h2>
              <button
                onClick={() => setViewCode(null)}
                className="text-gray-400 transition hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-auto p-6">
              {viewCodeLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
                </div>
              ) : (
                <pre className="whitespace-pre-wrap rounded-lg bg-gray-950 p-4 font-mono text-sm leading-relaxed text-gray-300">
                  {viewCode.source}
                </pre>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-xl border border-gray-800 bg-gray-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
              <h2 className="text-lg font-semibold text-white">
                Upload Strategy
              </h2>
              <button
                onClick={() => setShowUpload(false)}
                className="text-gray-400 transition hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleUpload} className="space-y-4 p-6">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-300">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={uploadForm.name}
                  onChange={(e) =>
                    setUploadForm({ ...uploadForm, name: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  placeholder="My Strategy"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-300">
                  Description
                </label>
                <input
                  type="text"
                  value={uploadForm.description}
                  onChange={(e) =>
                    setUploadForm({
                      ...uploadForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  placeholder="Brief description of the strategy"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-300">
                  Source Code
                </label>
                <textarea
                  required
                  rows={12}
                  value={uploadForm.source}
                  onChange={(e) =>
                    setUploadForm({ ...uploadForm, source: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 font-mono text-sm text-gray-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  placeholder="// Paste your PineScript or strategy source here..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUpload(false)}
                  className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 transition hover:border-gray-600 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:opacity-50"
                >
                  {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
