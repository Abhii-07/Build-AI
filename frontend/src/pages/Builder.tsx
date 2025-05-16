import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { StepsList } from '../components/StepsList';
import { FileExplorer } from '../components/FileExplorer';
import { TabView } from '../components/TabView';
import { CodeEditor } from '../components/CodeEditor';
import { PreviewFrame } from '../components/PreviewFrame';
import { Step, FileItem, StepType } from '../types';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { parseXml } from '../steps';
import { useWebContainer } from '../hooks/useWebContainer';
import { FileNode } from '@webcontainer/api';
import { Loader } from '../components/Loader';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, ExternalLink } from 'lucide-react';

const MOCK_FILE_CONTENT = `// This is a sample file content
import React from 'react';

function Component() {
  return <div>Hello World</div>;
}

export default Component;`;

export function Builder() {
  const location = useLocation();
  const { prompt } = location.state as { prompt: string };
  const [userPrompt, setPrompt] = useState("");
  const [llmMessages, setLlmMessages] = useState<{role: "user" | "assistant", content: string;}[]>([]);
  const [loading, setLoading] = useState(false);
  const [templateSet, setTemplateSet] = useState(false);
  const webcontainer = useWebContainer();

  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  
  const [steps, setSteps] = useState<Step[]>([]);

  const [files, setFiles] = useState<FileItem[]>([]);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [previewFullscreen, setPreviewFullscreen] = useState(false);
  const mainCardRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    let originalFiles = [...files];
    let updateHappened = false;
    steps.filter(({status}) => status === "pending").map(step => {
      updateHappened = true;
      if (step?.type === StepType.CreateFile) {
        let parsedPath = step.path?.split("/") ?? []; // ["src", "components", "App.tsx"]
        let currentFileStructure = [...originalFiles]; // {}
        const finalAnswerRef = currentFileStructure;
  
        let currentFolder = ""
        while(parsedPath.length) {
          currentFolder =  `${currentFolder}/${parsedPath[0]}`;
          const currentFolderName = parsedPath[0];
          parsedPath = parsedPath.slice(1);
  
          if (!parsedPath.length) {
            // final file
            const file = currentFileStructure.find(x => x.path === currentFolder)
            if (!file) {
              currentFileStructure.push({
                name: currentFolderName,
                type: 'file',
                path: currentFolder,
                content: step.code
              })
            } else {
              file.content = step.code;
            }
          } else {
            /// in a folder
            const folder = currentFileStructure.find(x => x.path === currentFolder)
            if (!folder) {
              // create the folder
              currentFileStructure.push({
                name: currentFolderName,
                type: 'folder',
                path: currentFolder,
                children: []
              })
            }
  
            currentFileStructure = currentFileStructure.find(x => x.path === currentFolder)!.children!;
          }
        }
        originalFiles = finalAnswerRef;
      }

    })

    if (updateHappened) {

      setFiles(originalFiles)
      setSteps(steps => steps.map((s: Step) => {
        return {
          ...s,
          status: "completed"
        }
        
      }))
    }
    console.log(files);
  }, [steps, files]);

  useEffect(() => {
    const createMountStructure = (files: FileItem[]): Record<string, any> => {
      const mountStructure: Record<string, any> = {};
  
      const processFile = (file: FileItem, isRootFolder: boolean) => {  
        if (file.type === 'folder') {
          // For folders, create a directory entry
          mountStructure[file.name] = {
            directory: file.children ? 
              Object.fromEntries(
                file.children.map(child => [child.name, processFile(child, false)])
              ) 
              : {}
          };
        } else if (file.type === 'file') {
          if (isRootFolder) {
            mountStructure[file.name] = {
              file: {
                contents: file.content || ''
              }
            };
          } else {
            // For files, create a file entry with contents
            return {
              file: {
                contents: file.content || ''
              }
            };
          }
        }
  
        return mountStructure[file.name];
      };
  
      // Process each top-level file/folder
      files.forEach(file => processFile(file, true));
  
      return mountStructure;
    };
  
    const mountStructure = createMountStructure(files);
  
    // Mount the structure if WebContainer is available
    console.log(mountStructure);
    webcontainer?.mount(mountStructure);
  }, [files, webcontainer]);

  async function init() {
    const response = await axios.post(`${BACKEND_URL}/template`, {
      prompt: prompt.trim()
    });
    setTemplateSet(true);
    
    const {prompts, uiPrompts} = response.data;

    setSteps(parseXml(uiPrompts[0]).map((x: Step) => ({
      ...x,
      status: "pending"
    })));

    setLoading(true);
    const stepsResponse = await axios.post(`${BACKEND_URL}/chat`, {
      messages: [...prompts, prompt].map(content => ({
        role: "user",
        content
      }))
    })

    setLoading(false);

    setSteps(s => [...s, ...parseXml(stepsResponse.data.response).map(x => ({
      ...x,
      status: "pending" as const
    }))]);

    setLlmMessages([...prompts, prompt].map(content => ({
      role: "user",
      content
    })));

    setLlmMessages(x => [...x, {role: "assistant", content: stepsResponse.data.response}])
  }

  useEffect(() => {
    init();
  }, [])

  // Helper to open preview in new tab
  const handleOpenPreviewNewTab = () => {
    // This assumes PreviewFrame renders an iframe or can be rendered in a new window
    // For now, just open the preview route in a new tab (customize as needed)
    // You may want to pass state or use a dedicated preview URL
    window.open(window.location.href + '#preview', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-gray-900 to-black flex flex-col">
      {/* Gradient Header with Logo/Title */}
      <header className="bg-gradient-to-r from-blue-800 to-gray-900 px-8 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-4">
          <span className="text-2xl font-bold text-white tracking-wide">Build AI</span>
          <span className="text-lg text-gray-300 font-light pl-4 border-l border-gray-700">Website Builder</span>
        </div>
        <div className="text-sm text-gray-400 font-mono">Prompt: {prompt}</div>
      </header>
      {/* Main Content Layout */}
      <div className="flex-1 flex justify-center items-start py-10 px-4">
        {/* Sidebar */}
        <aside
          className={`transition-all duration-300 h-full ${sidebarCollapsed ? 'w-16 min-w-[4rem] p-0 flex flex-col items-center justify-center' : 'w-80 max-w-xs p-6'} bg-gray-900/80 rounded-2xl shadow-xl mr-8 mt-2 min-h-[70vh] flex-shrink-0`}
          style={{ height: 'auto' }}
        >
          <div className={`flex flex-col ${sidebarCollapsed ? 'h-full justify-center' : ''}`} style={{ height: '100%' }}>
            <button
              className={`transition mb-4 ${sidebarCollapsed ? 'mt-0 self-center' : 'self-end'} text-gray-400 hover:text-white`}
              onClick={() => setSidebarCollapsed((c) => !c)}
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              style={sidebarCollapsed ? { marginTop: 'auto', marginBottom: 'auto' } : {}}
            >
              {sidebarCollapsed ? <ChevronRight size={28} /> : <ChevronLeft size={28} />}
            </button>
            {!sidebarCollapsed && (
              <>
                <h2 className="text-xl font-semibold text-white mb-4">Steps</h2>
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                  <StepsList
                    steps={steps}
                    currentStep={currentStep}
                    onStepClick={setCurrentStep}
                  />
                </div>
                <div className="mt-6">
                  {(loading || !templateSet) && <Loader />}
                  {!(loading || !templateSet) && (
                    <div className="flex flex-col space-y-2">
                      <textarea value={userPrompt} onChange={(e) => {
                        setPrompt(e.target.value)
                      }} className="p-2 w-full rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" rows={2} placeholder="Send a prompt..." />
                      <button onClick={async () => {
                        const newMessage: { role: "user"; content: string } = {
                          role: "user",
                          content: userPrompt
                        };

                        setLoading(true);
                        const stepsResponse = await axios.post(`${BACKEND_URL}/chat`, {
                          messages: [...llmMessages, newMessage]
                        });
                        setLoading(false);

                        setLlmMessages(x => [...x, newMessage]);
                        setLlmMessages(x => [...x, {
                          role: "assistant",
                          content: stepsResponse.data.response
                        }]);
                        
                        setSteps(s => [...s, ...parseXml(stepsResponse.data.response).map(x => ({
                          ...x,
                          status: "pending" as const
                        }))]);
                      }} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded px-4 py-1 transition-colors">Send</button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </aside>
        {/* Main Card */}
        <main
          ref={mainCardRef}
          className={`flex-1 max-w-5xl bg-gray-900/90 rounded-2xl shadow-2xl flex flex-col min-h-[70vh] transition-all duration-300 ${previewFullscreen ? 'items-center justify-center p-0' : 'p-8'}`}
          style={{ height: 'auto' }}
        >
          <div className={`flex flex-row h-full gap-6 ${previewFullscreen ? 'w-full' : ''}`} style={{ minHeight: '70vh', height: '100%' }}>
            {/* File Explorer */}
            {!previewFullscreen && (
              <section className="w-64 bg-gray-800/80 rounded-xl shadow-md p-4 flex flex-col">
                <h3 className="text-lg font-semibold text-gray-200 mb-2">Files</h3>
                <FileExplorer 
                  files={files} 
                  onFileSelect={setSelectedFile}
                />
              </section>
            )}
            {/* Code/Preview Tabs */}
            <section className={`flex-1 flex flex-col bg-gray-900 rounded-xl shadow-md ${previewFullscreen ? 'w-full h-full p-0' : 'p-4'}`} style={previewFullscreen ? { minHeight: '70vh', height: '100%' } : {}}>
              <div className="flex items-center mb-2">
                {!previewFullscreen && (
                  <TabView activeTab={activeTab} onTabChange={setActiveTab} />
                )}
                <div className="ml-auto flex items-center gap-2">
                  {activeTab === 'preview' && (
                    <>
                      <button
                        className="text-gray-400 hover:text-white transition p-1"
                        onClick={() => setPreviewFullscreen(f => !f)}
                        aria-label={previewFullscreen ? 'Exit full screen' : 'Full screen preview'}
                      >
                        {previewFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                      </button>
                      <button
                        className="text-gray-400 hover:text-white transition p-1"
                        onClick={handleOpenPreviewNewTab}
                        aria-label="Open preview in new tab"
                      >
                        <ExternalLink size={20} />
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className={`h-[calc(100%-3rem)] mt-2 ${previewFullscreen ? 'flex items-center justify-center' : ''}`} style={previewFullscreen ? { height: '100%' } : {}}>
                {activeTab === 'code' && !previewFullscreen ? (
                  <CodeEditor file={selectedFile} />
                ) : (activeTab === 'preview' || previewFullscreen) && webcontainer ? (
                  <PreviewFrame webContainer={webcontainer} files={files} />
                ) : null}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}