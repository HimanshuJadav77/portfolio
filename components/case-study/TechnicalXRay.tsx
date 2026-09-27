"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/helpers";
import { ChevronRight, X, Info, Code, Database, Server, Globe, Layers, HardDrive } from "lucide-react";

interface ArchitectureNode {
  id: string;
  label: string;
  description: string;
  technology: string;
  notes: string;
  type: "client" | "service" | "data" | "network" | "storage";
  position: { x: number; y: number };
  connections: string[];
}

interface TechnicalXRayProps {
  architecture: string;
}

const typeIcons = {
  client: Globe,
  service: Server,
  data: Database,
  network: Layers,
  storage: HardDrive,
};

const typeColors = {
  client: "text-primary border-primary/30 bg-primary/10",
  service: "text-secondary border-secondary/30 bg-secondary/10",
  data: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
  network: "text-amber-400 border-amber-400/30 bg-amber-400/10",
  storage: "text-violet-400 border-violet-400/30 bg-violet-400/10",
};

function parseArchitecture(architecture: string): ArchitectureNode[] {
  const lines = architecture.split("\n").filter(Boolean);
  const nodes: ArchitectureNode[] = [];
  
  lines.forEach((line, index) => {
    const cleanLine = line.replace(/^[-*•\s]+/, "").trim();
    if (!cleanLine) return;
    
    // Determine type based on keywords
    let type: ArchitectureNode["type"] = "service";
    const lower = cleanLine.toLowerCase();
    if (lower.includes("client") || lower.includes("app") || lower.includes("frontend") || lower.includes("mobile")) type = "client";
    else if (lower.includes("database") || lower.includes("db") || lower.includes("store") || lower.includes("cache")) type = "data";
    else if (lower.includes("network") || lower.includes("socket") || lower.includes("ws") || lower.includes("connection")) type = "network";
    else if (lower.includes("storage") || lower.includes("file") || lower.includes("blob")) type = "storage";
    
    // Simple grid layout
    const cols = 3;
    const col = index % cols;
    const row = Math.floor(index / cols);
    
    nodes.push({
      id: `node-${index}`,
      label: cleanLine.split("↓")[0].split("→")[0].trim(),
      description: cleanLine,
      technology: "",
      notes: "",
      type,
      position: { x: 15 + col * 30, y: 15 + row * 25 },
      connections: index > 0 ? [`node-${index - 1}`] : [],
    });
  });
  
  return nodes.length > 0 ? nodes : [
    {
      id: "node-0",
      label: "Client",
      description: "Frontend application",
      technology: "Flutter / React",
      notes: "User interface layer",
      type: "client",
      position: { x: 15, y: 15 },
      connections: ["node-1"],
    },
    {
      id: "node-1",
      label: "API Gateway",
      description: "Request routing & auth",
      technology: "Node.js / Express",
      notes: "Entry point for all requests",
      type: "service",
      position: { x: 45, y: 15 },
      connections: ["node-0", "node-2"],
    },
    {
      id: "node-2",
      label: "Database",
      description: "Data persistence",
      technology: "PostgreSQL / Firebase",
      notes: "Primary data store",
      type: "data",
      position: { x: 75, y: 15 },
      connections: ["node-1"],
    },
  ];
}

export function TechnicalXRay({ architecture }: TechnicalXRayProps) {
  const nodes = parseArchitecture(architecture);
  const [selectedNode, setSelectedNode] = useState<ArchitectureNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const Icon = typeIcons[selectedNode?.type || "service"];

  return (
    <div className="relative" role="region" aria-label="System architecture diagram">
      {/* Canvas */}
      <div className="relative aspect-[4/3] min-h-[400px] bg-card border border-border rounded-2xl overflow-hidden">
        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
            </marker>
          </defs>
          {nodes.flatMap((node) =>
            node.connections.map((targetId) => {
              const target = nodes.find((n) => n.id === targetId);
              if (!target) return null;
              const isActive = selectedNode && (selectedNode.id === node.id || selectedNode.id === targetId);
              const isHovered = hoveredNode && (hoveredNode === node.id || hoveredNode === targetId);
              
              return (
                <motion.line
                  key={`${node.id}-${targetId}`}
                  x1={`${node.position.x}%`}
                  y1={`${node.position.y}%`}
                  x2={`${target.position.x}%`}
                  y2={`${target.position.y}%`}
                  stroke="currentColor"
                  strokeWidth={isActive || isHovered ? 3 : 1.5}
                  strokeDasharray={isActive || isHovered ? "0" : "8 4"}
                  className={cn(
                    "transition-all duration-300",
                    isActive ? "text-primary" : isHovered ? "text-primary/70" : "text-border"
                  )}
                  markerEnd="url(#arrowhead)"
                  style={{ opacity: isActive || isHovered ? 1 : 0.4 }}
                />
              );
            })
          )}
        </svg>

        {/* Nodes */}
        {nodes.map((node) => {
          const Icon = typeIcons[node.type];
          const isSelected = selectedNode?.id === node.id;
          const isHovered = hoveredNode === node.id;
          const isConnected = selectedNode && (selectedNode.connections.includes(node.id) || node.connections.includes(selectedNode.id));
          
          return (
            <motion.button
              key={node.id}
              onClick={() => setSelectedNode(isSelected ? null : node)}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              className={cn(
                "absolute flex flex-col items-center gap-2 p-3 px-4 rounded-xl border-2 transition-all duration-300 z-10",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                typeColors[node.type],
                isSelected && "ring-2 ring-offset-2 scale-105 z-20",
                isHovered && !isSelected && "scale-105 z-20",
                isConnected && !isSelected && "opacity-60"
              )}
              style={{
                left: `${node.position.x}%`,
                top: `${node.position.y}%`,
                transform: "translate(-50%, -50%)",
              }}
              aria-label={`${node.label}. ${node.description}. Click for details.`}
              aria-pressed={isSelected}
              type="button"
            >
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300", isSelected ? "bg-current text-background" : "bg-current/20")}>
                <Icon className="w-6 h-6" aria-hidden="true" />
              </div>
              <span className="font-mono text-xs font-medium text-center whitespace-nowrap max-w-[120px]">{node.label}</span>
              {isSelected && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute -top-2 right-2 w-6 h-6 rounded-full bg-error/10 flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-error" onClick={(e) => { e.stopPropagation(); setSelectedNode(null); }} aria-label="Close details" />
                </motion.div>
              )}
            </motion.button>
          );
        })}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap justify-center gap-4 px-4">
          {Object.entries(typeIcons).map(([type, Icon]) => (
            <div key={type} className="flex items-center gap-2 px-3 py-1.5 bg-background/80 backdrop-blur rounded-full border border-border/50 text-xs">
              <Icon className={cn("w-3 h-3", typeColors[type as keyof typeof typeColors].split(" ")[0])} aria-hidden="true" />
              <span className="capitalize text-muted-foreground">{type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Panel */}
      <AnimatePresence mode="wait">
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="mt-6 card-elevated p-6 overflow-hidden"
            role="region"
            aria-labelledby="node-detail-title"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", typeColors[selectedNode.type])}>
                  <Icon className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <h3 id="node-detail-title" className="heading-5">{selectedNode.label}</h3>
                  <p className="caption text-muted-foreground capitalize">{selectedNode.type}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-1 rounded-lg hover:bg-accent transition-colors"
                aria-label="Close details"
              >
                <X className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="caption text-muted-foreground mb-1">RESPONSIBILITY</p>
                <p className="body text-foreground">{selectedNode.description}</p>
              </div>
              <div>
                <p className="caption text-muted-foreground mb-1">TECHNOLOGY</p>
                <p className="body text-foreground font-mono">{selectedNode.technology || "See implementation"}</p>
              </div>
            </div>

            {selectedNode.notes && (
              <div className="p-4 bg-muted/50 rounded-lg border border-border/50">
                <p className="caption text-muted-foreground mb-1 flex items-center gap-1">
                  <Info className="w-3 h-3" aria-hidden="true" />
                  TECHNICAL NOTES
                </p>
                <p className="body-sm text-foreground">{selectedNode.notes}</p>
              </div>
            )}

            {/* Connected Nodes */}
            {(selectedNode.connections.length > 0 || nodes.some((n) => n.connections.includes(selectedNode.id))) && (
              <div className="mt-4">
                <p className="caption text-muted-foreground mb-2">CONNECTIONS</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    ...selectedNode.connections.map((id) => nodes.find((n) => n.id === id)).filter(Boolean),
                    ...nodes.filter((n) => n.connections.includes(selectedNode.id)),
                  ].map((node) => (
                    node && (
                      <span key={node.id} className="badge-tech text-xs flex items-center gap-1">
                        <ChevronRight className="w-3 h-3" aria-hidden="true" />
                        {node.label}
                      </span>
                    )
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Accessible Fallback */}
      <details className="mt-6">
        <summary className="caption text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
          Show textual architecture description
        </summary>
        <div className="mt-4 p-4 bg-card border border-border rounded-xl font-mono text-sm whitespace-pre-wrap text-muted-foreground">
          {architecture}
        </div>
      </details>
    </div>
  );
}
