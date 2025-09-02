'use client';
import { useState, useRef } from 'react';
import CopyButton from '@/app/_components/CopyButton';
import Usage from '@/app/_components/Usage';
import Examples from '@/app/_components/Examples';
import { ToolDonation } from '@/app/_components/Monetize';

interface FileTypeInfo {
  extension: string;
  mimeType: string;
  description: string;
  category: string;
}

const fileSignatures: { [key: string]: FileTypeInfo } = {
  // 图片格式
  '89504E47': { extension: 'png', mimeType: 'image/png', description: 'PNG图片', category: '图片' },
  '47494638': { extension: 'gif', mimeType: 'image/gif', description: 'GIF动画', category: '图片' },
  'FFD8FF': { extension: 'jpg', mimeType: 'image/jpeg', description: 'JPEG图片', category: '图片' },
  '52494646': { extension: 'webp', mimeType: 'image/webp', description: 'WebP图片', category: '图片' },
  '49492A00': { extension: 'tiff', mimeType: 'image/tiff', description: 'TIFF图片', category: '图片' },
  '4D4D002A': { extension: 'tiff', mimeType: 'image/tiff', description: 'TIFF图片', category: '图片' },
  
  // 文档格式
  '504B0304': { extension: 'docx', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', description: 'Word文档', category: '文档' },
  '504B0506': { extension: 'docx', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', description: 'Word文档', category: '文档' },
  '504B0708': { extension: 'docx', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', description: 'Word文档', category: '文档' },
  'D0CF11E0': { extension: 'doc', mimeType: 'application/msword', description: 'Word文档(旧版)', category: '文档' },
  '25504446': { extension: 'pdf', mimeType: 'application/pdf', description: 'PDF文档', category: '文档' },
  
  // 压缩格式
  '504B0304': { extension: 'zip', mimeType: 'application/zip', description: 'ZIP压缩包', category: '压缩' },
  '1F8B08': { extension: 'gz', mimeType: 'application/gzip', description: 'GZIP压缩包', category: '压缩' },
  '377ABCAF': { extension: '7z', mimeType: 'application/x-7z-compressed', description: '7-Zip压缩包', category: '压缩' },
  '52617221': { extension: 'rar', mimeType: 'application/vnd.rar', description: 'RAR压缩包', category: '压缩' },
  
  // 音频格式
  '494433': { extension: 'mp3', mimeType: 'audio/mpeg', description: 'MP3音频', category: '音频' },
  '52494646': { extension: 'wav', mimeType: 'audio/wav', description: 'WAV音频', category: '音频' },
  '4F676753': { extension: 'ogg', mimeType: 'audio/ogg', description: 'OGG音频', category: '音频' },
  '66747970': { extension: 'm4a', mimeType: 'audio/mp4', description: 'M4A音频', category: '音频' },
  
  // 视频格式
  '000001B3': { extension: 'mpg', mimeType: 'video/mpeg', description: 'MPEG视频', category: '视频' },
  '000001BA': { extension: 'mpg', mimeType: 'video/mpeg', description: 'MPEG视频', category: '视频' },
  '66747970': { extension: 'mp4', mimeType: 'video/mp4', description: 'MP4视频', category: '视频' },
  '52494646': { extension: 'avi', mimeType: 'video/x-msvideo', description: 'AVI视频', category: '视频' },
  '1A45DFA3': { extension: 'mkv', mimeType: 'video/x-matroska', description: 'MKV视频', category: '视频' },
  
  // 可执行文件
  '4D5A9000': { extension: 'exe', mimeType: 'application/x-msdownload', description: 'Windows可执行文件', category: '可执行文件' },
  '7F454C46': { extension: 'elf', mimeType: 'application/x-executable', description: 'Linux可执行文件', category: '可执行文件' },
  'FEEDFACE': { extension: 'dylib', mimeType: 'application/x-mach-binary', description: 'macOS动态库', category: '可执行文件' },
  'FEEDFACF': { extension: 'dylib', mimeType: 'application/x-mach-binary', description: 'macOS动态库', category: '可执行文件' },
  
  // 文本格式
  'EFBBBF': { extension: 'txt', mimeType: 'text/plain', description: 'UTF-8文本文件', category: '文本' },
  'FFFE': { extension: 'txt', mimeType: 'text/plain', description: 'UTF-16文本文件', category: '文本' },
  'FEFF': { extension: 'txt', mimeType: 'text/plain', description: 'UTF-16文本文件', category: '文本' },
  
  // 其他格式
  '7B227': { extension: 'json', mimeType: 'application/json', description: 'JSON数据文件', category: '数据' },
  '3C3F786D6C': { extension: 'xml', mimeType: 'application/xml', description: 'XML文档', category: '数据' },
  '3C21444F': { extension: 'html', mimeType: 'text/html', description: 'HTML文档', category: '网页' },
  '2F2A20': { extension: 'js', mimeType: 'application/javascript', description: 'JavaScript文件', category: '代码' },
  '2E2F2A20': { extension: 'css', mimeType: 'text/css', description: 'CSS样式文件', category: '代码' }
};

export default function FileTypePage() {
  const [file, setFile] = useState<File | null>(null);
  const [fileInfo, setFileInfo] = useState<{
    detectedType: FileTypeInfo | null;
    fileName: string;
    fileSize: string;
    hexSignature: string;
    possibleTypes: FileTypeInfo[];
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const detectFileType = async (file: File) => {
    setIsAnalyzing(true);
    
    try {
      const buffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(buffer);
      
      // 获取文件头的前16个字节
      const headerBytes = Array.from(uint8Array.slice(0, 16))
        .map(byte => byte.toString(16).padStart(2, '0').toUpperCase())
        .join('');
      
      // 检测文件类型
      let detectedType: FileTypeInfo | null = null;
      const possibleTypes: FileTypeInfo[] = [];
      
      for (const [signature, typeInfo] of Object.entries(fileSignatures)) {
        if (headerBytes.startsWith(signature)) {
          if (!detectedType) {
            detectedType = typeInfo;
          }
          possibleTypes.push(typeInfo);
        }
      }
      
      // 如果没有检测到类型，尝试基于文件扩展名
      if (!detectedType) {
        const extension = file.name.split('.').pop()?.toLowerCase();
        if (extension) {
          // 基于扩展名的简单检测
          const extensionMap: { [key: string]: FileTypeInfo } = {
            'txt': { extension: 'txt', mimeType: 'text/plain', description: '文本文件', category: '文本' },
            'json': { extension: 'json', mimeType: 'application/json', description: 'JSON数据文件', category: '数据' },
            'xml': { extension: 'xml', mimeType: 'application/xml', description: 'XML文档', category: '数据' },
            'html': { extension: 'html', mimeType: 'text/html', description: 'HTML文档', category: '网页' },
            'htm': { extension: 'htm', mimeType: 'text/html', description: 'HTML文档', category: '网页' },
            'js': { extension: 'js', mimeType: 'application/javascript', description: 'JavaScript文件', category: '代码' },
            'css': { extension: 'css', mimeType: 'text/css', description: 'CSS样式文件', category: '代码' },
            'py': { extension: 'py', mimeType: 'text/x-python', description: 'Python脚本', category: '代码' },
            'java': { extension: 'java', mimeType: 'text/x-java-source', description: 'Java源代码', category: '代码' },
            'cpp': { extension: 'cpp', mimeType: 'text/x-c++src', description: 'C++源代码', category: '代码' },
            'c': { extension: 'c', mimeType: 'text/x-csrc', description: 'C源代码', category: '代码' },
            'md': { extension: 'md', mimeType: 'text/markdown', description: 'Markdown文档', category: '文档' },
            'csv': { extension: 'csv', mimeType: 'text/csv', description: 'CSV数据文件', category: '数据' }
          };
          
          if (extensionMap[extension]) {
            detectedType = extensionMap[extension];
            possibleTypes.push(detectedType);
          }
        }
      }
      
      setFileInfo({
        detectedType,
        fileName: file.name,
        fileSize: formatFileSize(file.size),
        hexSignature: headerBytes,
        possibleTypes
      });
    } catch (error) {
      console.error('文件分析失败:', error);
      setFileInfo(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      detectFileType(selectedFile);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      detectFileType(droppedFile);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleClear = () => {
    setFile(null);
    setFileInfo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <section className="stack prose">
      <h2>文件类型检测工具</h2>
      
      <Usage
        title="如何使用"
        steps={[
          '拖拽文件到检测区域或点击选择文件',
          '系统自动分析文件头信息',
          '查看检测到的文件类型和详细信息',
          '查看可能的文件类型列表'
        ]}
        tips={[
          '基于文件头魔数进行检测',
          '支持图片、文档、音频、视频等格式',
          '显示文件大小和十六进制签名',
          '提供多种可能的文件类型'
        ]}
      />

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <div className="card">
          <div className="stack">
            <h3>文件上传</h3>
            
            <div
              style={{
                border: '2px dashed #d1d5db',
                borderRadius: '8px',
                padding: '40px 20px',
                textAlign: 'center',
                background: '#f9fafb',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                📁
              </div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
                拖拽文件到这里或点击选择
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                支持所有文件类型
              </div>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                accept="*/*"
              />
            </div>
            
            {file && (
              <div style={{ 
                padding: '12px', 
                background: '#f0f9ff', 
                border: '1px solid #0ea5e9', 
                borderRadius: '8px',
                fontSize: '14px'
              }}>
                <div style={{ fontWeight: 'bold' }}>已选择文件:</div>
                <div>{file.name}</div>
                <div style={{ color: '#6b7280' }}>{formatFileSize(file.size)}</div>
              </div>
            )}
            
            <div className="row" style={{ gap: '8px' }}>
              <button className="btn" onClick={handleClear}>
                清空
              </button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="stack">
            <h3>检测结果</h3>
            
            {isAnalyzing ? (
              <div style={{ 
                padding: '40px', 
                textAlign: 'center', 
                color: '#6b7280',
                fontSize: '14px'
              }}>
                🔍 正在分析文件...
              </div>
            ) : fileInfo ? (
              <div className="stack" style={{ gap: '16px' }}>
                {/* 文件信息 */}
                <div>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>文件信息</h4>
                  <div style={{ 
                    padding: '12px', 
                    background: '#f3f4f6', 
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}>
                    <div><strong>文件名:</strong> {fileInfo.fileName}</div>
                    <div><strong>文件大小:</strong> {fileInfo.fileSize}</div>
                    <div><strong>十六进制签名:</strong> {fileInfo.hexSignature}</div>
                  </div>
                </div>

                {/* 检测结果 */}
                <div>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>检测结果</h4>
                  {fileInfo.detectedType ? (
                    <div style={{ 
                      padding: '12px', 
                      background: '#ecfdf5', 
                      border: '1px solid #10b981', 
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}>
                      <div><strong>文件类型:</strong> {fileInfo.detectedType.description}</div>
                      <div><strong>扩展名:</strong> .{fileInfo.detectedType.extension}</div>
                      <div><strong>MIME类型:</strong> {fileInfo.detectedType.mimeType}</div>
                      <div><strong>分类:</strong> {fileInfo.detectedType.category}</div>
                    </div>
                  ) : (
                    <div style={{ 
                      padding: '12px', 
                      background: '#fef3c7', 
                      border: '1px solid #f59e0b', 
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}>
                      ⚠️ 无法确定文件类型
                    </div>
                  )}
                </div>

                {/* 可能的类型 */}
                {fileInfo.possibleTypes.length > 1 && (
                  <div>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>可能的文件类型</h4>
                    <div style={{ 
                      padding: '12px', 
                      background: '#f3f4f6', 
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}>
                      {fileInfo.possibleTypes.map((type, index) => (
                        <div key={index} style={{ marginBottom: '4px' }}>
                          • {type.description} (.{type.extension}) - {type.category}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ 
                padding: '40px', 
                textAlign: 'center', 
                color: '#6b7280',
                fontSize: '14px'
              }}>
                请选择文件进行检测
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <h3>支持的文件类型</h3>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>图片格式</h4>
            <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
              PNG, JPEG, GIF, WebP, TIFF
            </p>
          </div>
          <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>文档格式</h4>
            <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
              PDF, DOC, DOCX, TXT, MD
            </p>
          </div>
          <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>压缩格式</h4>
            <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
              ZIP, RAR, 7Z, GZ
            </p>
          </div>
          <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>媒体格式</h4>
            <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
              MP3, WAV, MP4, AVI, MKV
            </p>
          </div>
        </div>
        <p style={{ marginTop: '16px', fontSize: '14px' }}>
          文件类型检测工具通过分析文件头的魔数（Magic Number）来识别文件类型，
          这种方法比依赖文件扩展名更准确可靠。
        </p>
      </div>

      <ToolDonation />
    </section>
  );
} 