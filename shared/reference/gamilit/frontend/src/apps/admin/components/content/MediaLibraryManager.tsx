import React, { useState } from 'react';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import { useMediaLibrary } from '../../hooks/useContentManagement';
import { Upload, Image, Video, Music, Trash2, Search, Tag, HardDrive } from 'lucide-react';

export const MediaLibraryManager: React.FC = () => {
  const { media, loading, storageUsed, storageLimit, uploadFile, deleteFile, bulkDelete } = useMediaLibrary();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video' | 'audio'>('all');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          alert(`File ${file.name} exceeds 10MB limit`);
          continue;
        }
        await uploadFile(file);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed');
    } finally {
      setUploading(false);
      event.target.value = ''; // Reset input
    }
  };

  const handleBulkDelete = async () => {
    if (selectedFiles.length === 0) return;
    if (!confirm(`Delete ${selectedFiles.length} file(s)?`)) return;

    try {
      await bulkDelete(selectedFiles);
      setSelectedFiles([]);
    } catch (error) {
      console.error('Bulk delete failed:', error);
      alert('Bulk delete failed');
    }
  };

  const toggleSelectFile = (id: string) => {
    setSelectedFiles((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  };

  const filteredMedia = media
    .filter((file) => filterType === 'all' || file.type === filterType)
    .filter(
      (file) =>
        file.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  const storagePercentage = storageLimit > 0 ? (storageUsed / storageLimit) * 100 : 0;

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="w-6 h-6" />;
      case 'video':
        return <Video className="w-6 h-6" />;
      case 'audio':
        return <Music className="w-6 h-6" />;
      default:
        return <Image className="w-6 h-6" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  if (loading) {
    return (
      <DetectiveCard>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-detective-orange border-t-transparent"></div>
        </div>
      </DetectiveCard>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-detective-subtitle">Media Library Manager</h2>
        <div className="flex items-center gap-3">
          {selectedFiles.length > 0 && (
            <DetectiveButton
              variant="primary"

              icon={<Trash2 className="w-4 h-4" />}
              onClick={handleBulkDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete {selectedFiles.length} file(s)
            </DetectiveButton>
          )}
          <label className="cursor-pointer">
            <DetectiveButton
              variant="primary"
              icon={<Upload className="w-4 h-4" />}
              disabled={uploading}
              loading={uploading}
              as="span"
            >
              Upload Files
            </DetectiveButton>
            <input
              type="file"
              multiple
              accept="image/*,video/*,audio/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Storage Usage */}
      <DetectiveCard className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/30">
        <div className="flex items-center gap-4">
          <HardDrive className="w-8 h-8 text-blue-500" />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-detective-base">Storage Usage</span>
              <span className="text-detective-base font-bold">
                {formatFileSize(storageUsed)} / {formatFileSize(storageLimit)}
              </span>
            </div>
            <div className="h-3 bg-detective-bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  storagePercentage > 90
                    ? 'bg-gradient-to-r from-red-500 to-red-400'
                    : storagePercentage > 70
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-400'
                    : 'bg-gradient-to-r from-blue-500 to-blue-400'
                }`}
                style={{ width: `${storagePercentage}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between mt-1 text-detective-small text-gray-400">
              <span>{storagePercentage.toFixed(1)}% used</span>
              <span>{media.length} files</span>
            </div>
          </div>
        </div>
      </DetectiveCard>

      {/* Filters */}
      <DetectiveCard>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search files or tags..."
              className="input-detective pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'image', 'video', 'audio'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                  filterType === type
                    ? 'bg-detective-orange text-white'
                    : 'bg-detective-bg-secondary text-gray-400 hover:bg-detective-bg-secondary/70'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </DetectiveCard>

      {/* Media Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredMedia.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-400">
            <Upload className="w-12 h-12 mx-auto mb-2" />
            <p>No media files found</p>
          </div>
        ) : (
          filteredMedia.map((file) => {
            const isSelected = selectedFiles.includes(file.id);

            return (
              <DetectiveCard
                key={file.id}
                className={`relative group ${isSelected ? 'ring-2 ring-detective-orange' : ''}`}
                padding="none"
              >
                {/* Checkbox */}
                <div className="absolute top-2 left-2 z-10">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelectFile(file.id)}
                    className="w-5 h-5 rounded border-2 border-detective-orange"
                  />
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => deleteFile(file.id)}
                  className="absolute top-2 right-2 z-10 p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Thumbnail */}
                <div className="aspect-square bg-detective-bg-secondary flex items-center justify-center overflow-hidden">
                  {file.type === 'image' ? (
                    <img src={file.url} alt={file.filename} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-gray-400">{getFileIcon(file.type)}</div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="text-detective-small font-semibold truncate" title={file.filename}>
                    {file.filename}
                  </p>
                  <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>

                  {/* Tags */}
                  {file.tags && file.tags.length > 0 && (
                    <div className="flex items-center gap-1 mt-2 flex-wrap">
                      <Tag className="w-3 h-3 text-gray-500" />
                      {file.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="px-2 py-0.5 bg-detective-orange/20 text-detective-orange rounded text-xs">
                          {tag}
                        </span>
                      ))}
                      {file.tags.length > 2 && (
                        <span className="text-xs text-gray-500">+{file.tags.length - 2}</span>
                      )}
                    </div>
                  )}

                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(file.uploadedAt).toLocaleDateString('es-ES')}
                  </p>
                </div>
              </DetectiveCard>
            );
          })
        )}
      </div>

      {/* Upload Instructions */}
      <DetectiveCard className="bg-blue-500/10 border border-blue-500/30">
        <div className="flex items-start gap-3">
          <Upload className="w-5 h-5 text-blue-500 mt-1" />
          <div>
            <p className="text-detective-base text-blue-500 font-semibold mb-1">Upload Guidelines</p>
            <ul className="text-detective-small text-gray-400 space-y-1">
              <li>Max file size: 10 MB</li>
              <li>Supported formats: Images (JPG, PNG, GIF), Videos (MP4, WebM), Audio (MP3, WAV)</li>
              <li>Files are automatically optimized for web delivery</li>
            </ul>
          </div>
        </div>
      </DetectiveCard>
    </div>
  );
};
