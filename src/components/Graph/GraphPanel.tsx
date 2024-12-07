import React, { useCallback, useRef, useEffect, useState } from 'react';
import { Activity, Search, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import Widget from '../Widget/Widget';
import ForceGraph2D from 'react-force-graph-2d';
import { mockGraphData } from '../../utils/mockData';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const NODE_COLORS = {
  wallet: '#FFD700',    // Gold
  transaction: '#4A90E2', // Blue
  ledger: '#32CD32'     // Green
};

const GraphPanel: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [graphData, setGraphData] = useState(mockGraphData);
  const fgRef = useRef<any>();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleZoomIn = useCallback(() => {
    if (fgRef.current) {
      fgRef.current.zoom(fgRef.current.zoom() * 1.5);
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (fgRef.current) {
      fgRef.current.zoom(fgRef.current.zoom() / 1.5);
    }
  }, []);

  const handleRefresh = useCallback(() => {
    // Create a deep copy of the data to trigger a complete re-render
    const newData = {
      nodes: mockGraphData.nodes.map(node => ({
        ...node,
        x: undefined,
        y: undefined,
        vx: undefined,
        vy: undefined
      })),
      links: mockGraphData.links.map(link => ({ ...link }))
    };

    setGraphData(newData);

    if (fgRef.current) {
      fgRef.current.d3ReheatSimulation();
    }
  }, []);

  useEffect(() => {
    // Initial setup
    handleRefresh();
  }, []);

  return (
    <Widget
      id="graph"
      title="Chain eXplorer"
      icon={Activity}
      defaultPosition={{ x: 360, y: 80 }}
      defaultSize={{ width: 1000, height: 600 }}
    >
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search transactions, addresses, or tokens..."
              className="w-full px-4 py-2 bg-background/50 border border-primary/30 rounded-lg 
                         text-text placeholder-text/50 focus:outline-none focus:border-primary"
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleZoomIn}
              className="p-2 bg-primary/20 rounded-lg hover:bg-primary/30 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-5 h-5 text-primary" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2 bg-primary/20 rounded-lg hover:bg-primary/30 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-5 h-5 text-primary" />
            </button>
            <button
              onClick={handleRefresh}
              className="p-2 bg-primary/20 rounded-lg hover:bg-primary/30 transition-colors"
              title="Refresh Layout"
            >
              <RotateCcw className="w-5 h-5 text-primary" />
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute top-4 right-4 bg-background/90 p-4 rounded-lg border border-primary/30 z-10">
            <div className="text-sm font-medium text-primary mb-2">Legend</div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: NODE_COLORS.wallet }} />
                <span className="text-sm text-text">Wallet</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: NODE_COLORS.transaction }} />
                <span className="text-sm text-text">Transaction</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: NODE_COLORS.ledger }} />
                <span className="text-sm text-text">Ledger</span>
              </div>
            </div>
          </div>

          <div className="h-[450px] border border-primary/20 rounded-lg overflow-hidden">
            <ForceGraph2D
              ref={fgRef}
              graphData={graphData}
              nodeLabel="label"
              nodeColor={(node: any) => NODE_COLORS[node.type as keyof typeof NODE_COLORS]}
              nodeRelSize={6}
              linkColor={() => 'rgba(255, 215, 0, 0.2)'}
              backgroundColor="transparent"
              width={isMobile ? window.innerWidth - 40 : undefined}
              height={450}
              linkDirectionalParticles={2}
              linkDirectionalParticleSpeed={0.005}
              d3AlphaDecay={0.02}
              d3VelocityDecay={0.3}
              cooldownTime={2000}
              onNodeClick={(node) => {
                console.log('Clicked node:', node);
              }}
              nodeCanvasObject={(node: any, ctx, globalScale) => {
                const label = node.label;
                const fontSize = 12/globalScale;
                ctx.font = `${fontSize}px Sans-Serif`;
                
                // Draw node
                ctx.fillStyle = NODE_COLORS[node.type as keyof typeof NODE_COLORS];
                ctx.beginPath();
                ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI);
                ctx.fill();

                // Draw label
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = '#E6E8E6';
                ctx.fillText(label.slice(0, 20) + (label.length > 20 ? '...' : ''), node.x, node.y + 10);
              }}
            />
          </div>
        </div>
      </div>
    </Widget>
  );
};

export default GraphPanel;