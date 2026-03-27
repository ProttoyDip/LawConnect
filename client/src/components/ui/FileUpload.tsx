import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  X, 
  CheckCircle, 
  FileText 
} from 'lucide-react';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';

interface FilePreview {
  file: File;
  url: string;
  id: string;
}

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // MB
  accept?: string;
  className?: string;
}

export default function FileUpload({ 
  onFilesChange, 
  maxFiles = 5, 
  maxSize = 10, 
  accept = 'image/*,.pdf,.doc,.docx',
  className 
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<FilePreview[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFiles = (newFiles: File[]) => {
    const validFiles: File[] = [];
    
    newFiles.forEach((file) => {
      // Check size
      if (file.size > maxSize * 1024 * 1024) {
        toast.error(`${file.name} is too large (${(file.size / 1024 / 1024).toFixed(1)}MB > ${maxSize}MB)`);
        return;
      }
      
      // Check type
      if (!accept.split(',').some((type) => file.type.includes(type.replace('*', '')))) {
        toast.error(`${file.name} type not allowed`);
        return;
      }
      
      validFiles.push(file);
    });

    if (validFiles.length > maxFiles) {
      toast.error(`Max ${maxFiles} files allowed`);
      return;
    }

    if (validFiles.length > 0) {
      const previews = validFiles.map(file => ({
        file,
        url: URL.createObjectURL(file),
        id: Math.random().toString(36).substr(2, 9)
      }));
      
      setFiles(prev => [...prev, ...previews]);
      onFilesChange([...files.map(f => f.file), ...validFiles]);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const targetFiles = e.target.files ? Array.from(e.target.files) : [];
    processFiles(targetFiles);
    e.target.value = '';
  };

  const removeFile = (id: string) => {
    const newFiles = files.filter(f => f.id !== id);
    setFiles(newFiles);
    onFilesChange(newFiles.map(f => f.file));
  };

  const clearAll = () => {
    setFiles([]);
    onFilesChange([]);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload Area */}
      <motion.div
        className={cn(
          'group relative border-4 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer hover:shadow-2xl hover:-translate-y-2',
          'hover:border-indigo-400 hover:bg-indigo-500/5',
          dragActive 
            ? 'border-indigo-400 bg-indigo-500/10 scale-105 shadow-2xl ring-4 ring-indigo-500/20' 
            : 'border-white/30 bg-white/5 backdrop-blur-sm shadow-xl'
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 group-hover:opacity-30 transition-opacity">
          <Upload className="w-24 h-24 text-indigo-400" />
        </div>
        
        <div className="relative z-10 space-y-4">
          <motion.div
            animate={dragActive ? { scale: 1.1 } : { scale: 1 }}
            className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl"
          >
            <Upload className="w-8 h-8 text-white" />
          </motion.div>
          
          <div>
            <h3 className="text-xl font-bold text-white mb-2">
              {dragActive ? 'Drop files here' : 'Drag & drop or click to upload'}
            </h3>
            <p className="text-white/70 text-sm">
              Up to {maxFiles} files • Max {maxSize}MB each • {accept.includes('image') ? 'Images, ' : ''}PDFs, Docs accepted
            </p>
          </div>
        </div>
        
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={accept}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </motion.div>

      {/* File Previews */}
      {files.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-white">
              {files.length} {files.length === 1 ? 'file' : 'files'} selected
            </h4>
            <motion.button
              whileHover={{ scale: 0.95 }}
              onClick={clearAll}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 border border-white/30 rounded-xl text-white/90 font-medium transition-all duration-200"
            >
              Clear All
            </motion.button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-64 overflow-y-auto -mx-4 px-4">
            {files.map(({ file, url, id }) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 overflow-hidden"
              >
                {/* Preview Image */}
                {file.type.startsWith('image/') ? (
                  <img src={url} alt={file.name} className="w-full h-32 object-cover rounded-lg mb-3" />
                ) : (
                  <div className="w-full h-32 bg-gradient-to-br from-gray-500 to-gray-700 rounded-lg flex items-center justify-center mb-3">
                    <FileText className="w-12 h-12 text-white/70" />
                  </div>
                )}
                
                {/* File Info */}
                <div className="space-y-1 mb-4">
                  <p className="font-semibold text-white text-sm truncate">{file.name}</p>
                  <p className="text-white/60 text-xs">
                    {(file.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
                
                {/* Remove Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeFile(id)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500/90 hover:bg-red-600 rounded-full shadow-lg border-2 border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-200"
                >
                  <X className="w-4 h-4 text-white" />
                </motion.button>
                
                {/* Success Tick */}
                <CheckCircle className="w-5 h-5 text-emerald-400 absolute bottom-2 right-2 opacity-0 group-hover:opacity-100" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

