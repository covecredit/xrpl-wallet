import React, { useCallback, useRef, useEffect } from 'react';
import { Activity, Search, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import Widget from '../Widget/Widget';
import ForceGraph2D from 'react-force-graph-2d';
import { mockGraphData } from '../../utils/mockData';

const GraphPanel: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const fgRef = useRef();

  const handleZoomIn = useCallback(() => {
    if (fgRef.current) {
      const fg = fgRef.current;
      fg.zoom(fg.zoom() * 1.5);
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (fgRef.current) {
      const fg = fgRef.current;
      fg.zoom(fg.zoom() / 1.5);
    }
  }, []);

  const handleRefresh = useCallback(() => {
    if (fgRef.current) {
      const fg = fgRef.current;
      
      // Randomize node positions
      const nodes = mockGraphData.nodes.map(node => ({
        ...node,
        x: (Math.random() - 0.5) * 1000,
        y: (Math.random() - 0.5) * 1000
      }));

      // Update graph data
      fg.graphData({
        nodes,
        links: mockGraphData.links
      });

      // Reheat simulation
      fg.d3ReheatSimulation();
    }
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
                <div className="w-3 h-3 rounded-full bg-[#FFD700]" />
                <span className="text-sm text-text">Wallet</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-[#4A90E2]" />
                <span className="text-sm text-text">Transaction</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-[#32CD32]" />
                <span className="text-sm text-text">Ledger</span>
              </div>
            </div>
          </div>

          <div className="h-[450px] border border-primary/20 rounded-lg overflow-hidden">
            <ForceGraph2D
              ref={fgRef}
              graphData={mockGraphData}
              nodeLabel="label"
              nodeColor={(node) => {
                switch (node.type) {
                  case 'wallet': return '#FFD700';
                  case 'transaction': return '#4A90E2';
                  case 'ledger': return '#32CD32';
                  default: return '#E6E8E6';
                }
              }}
              nodeRelSize={8}
              linkColor={() => 'rgba(255, 215, 0, 0.2)'}
              backgroundColor="transparent"
              linkDirectionalParticles={2}
              linkDirectionalParticleSpeed={0.005}
              d3AlphaDecay={0.02}
              d3VelocityDecay={0.3}
              cooldownTime={2000}
              onNodeClick={(node) => {
                console.log('Clicked node:', node);
              }}
              nodeCanvasObject={(node, ctx, globalScale) => {
                const label = node.label;
                const fontSize = 12/globalScale;
                ctx.font = `${fontSize}px Sans-Serif`;
                const textWidth = ctx.measureText(label).width;
                const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);

                ctx.fillStyle = node.color;
                ctx.beginPath();
                ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI);
                ctx.fill();

                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = '#E6E8E6';
                ctx.fillText(label.slice(0, 20) + '...', node.x, node.y + 10);
              }}
            />
          </div>
        </div>
      </div>
    </Widget>
  );
};

export default GraphPanel;