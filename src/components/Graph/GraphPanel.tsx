import React, { useState, useCallback, useRef } from 'react';
import { Activity, Search } from 'lucide-react';
import Widget from '../Widget/Widget';
import ForceGraph2D from 'react-force-graph-2d';
import { useWalletStore } from '../../store/walletStore';
import { graphService } from '../../services/graph';
import { GraphData } from '../../services/graph/types';
import GraphControls from './GraphControls';

const GRAPH_COLORS = {
  wallet: '#4169E1', // Royal Blue for wallets
  transaction: '#FF8C00', // Dark Orange for transactions
  link: 'rgba(65, 105, 225, 0.2)', // Semi-transparent blue for links
  text: '#E6E8E6' // Light gray for text
};

const GraphPanel: React.FC = () => {
  const { address, isConnected } = useWalletStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<any>(null);
  const fgRef = useRef<any>();

  const fetchGraphData = useCallback(async (searchAddress: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await graphService.buildTransactionGraph(searchAddress, { limit: 50 });
      setGraphData(data);
    } catch (error: any) {
      console.error('Failed to fetch graph data:', error);
      setError(error.message || 'Failed to fetch transaction data');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) {
      setGraphData({ nodes: [], links: [] });
      return;
    }
    await fetchGraphData(searchQuery);
  };

  const handleNodeClick = useCallback((node: any) => {
    if (node.type === 'wallet') {
      setSearchQuery(node.id);
      fetchGraphData(node.id);
    }
  }, [fetchGraphData]);

  const handleZoomIn = () => {
    if (fgRef.current) {
      const currentZoom = fgRef.current.zoom();
      fgRef.current.zoom(currentZoom * 1.5, 400);
    }
  };

  const handleZoomOut = () => {
    if (fgRef.current) {
      const currentZoom = fgRef.current.zoom();
      fgRef.current.zoom(currentZoom / 1.5, 400);
    }
  };

  const handleCenter = () => {
    if (fgRef.current) {
      fgRef.current.centerAt(0, 0, 1000);
      fgRef.current.zoom(1, 1000);
    }
  };

  const handleReset = () => {
    if (fgRef.current) {
      // Reset zoom and center
      fgRef.current.centerAt(0, 0, 1000);
      fgRef.current.zoom(1, 1000);
      
      // Trigger force simulation reheat
      fgRef.current.d3ReheatSimulation();
    }
  };

  return (
    <Widget
      id="graph"
      title="Chain eXplorer"
      icon={Activity}
      defaultPosition={{ x: 360, y: 80 }}
      defaultSize={{ width: 1000, height: 600 }}
    >
      {isConnected ? (
        <div className="space-y-4 p-4">
          <form onSubmit={handleSearch} className="flex space-x-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter XRPL address to explore..."
              className="flex-1 px-4 py-2 bg-background/50 border border-primary/30 rounded-lg 
                       text-text placeholder-text/50 focus:outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg 
                       transition-colors flex items-center space-x-2"
            >
              <Search className="w-5 h-5" />
              <span>Search</span>
            </button>
          </form>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          <div className="relative h-[450px] border border-primary/30 rounded-lg overflow-hidden">
            <div className="absolute top-4 right-4 bg-background/95 p-4 rounded-lg border border-primary/30 z-10">
              <div className="text-sm font-medium text-primary mb-2">Legend</div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: GRAPH_COLORS.wallet }} />
                  <span className="text-sm text-text">Wallet</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: GRAPH_COLORS.transaction }} />
                  <span className="text-sm text-text">Transaction</span>
                </div>
              </div>
            </div>

            {hoveredNode && (
              <div className="absolute top-4 left-4 bg-background/95 p-4 rounded-lg border border-primary/30 z-10 max-w-md">
                <pre className="text-xs text-text whitespace-pre-wrap">
                  {hoveredNode.label}
                </pre>
              </div>
            )}

            <GraphControls
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onCenter={handleCenter}
              onReset={handleReset}
            />

            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
              </div>
            ) : graphData.nodes.length > 0 ? (
              <ForceGraph2D
                ref={fgRef}
                graphData={graphData}
                nodeLabel="label"
                nodeColor={(node: any) => node.type === 'wallet' ? GRAPH_COLORS.wallet : GRAPH_COLORS.transaction}
                nodeRelSize={6}
                linkColor={() => GRAPH_COLORS.link}
                linkWidth={1}
                linkDirectionalParticles={2}
                linkDirectionalParticleWidth={2}
                linkDirectionalParticleSpeed={0.005}
                backgroundColor="transparent"
                onNodeClick={handleNodeClick}
                onNodeHover={setHoveredNode}
                d3AlphaDecay={0.02}
                d3VelocityDecay={0.3}
                d3Force="charge"
                d3ForceStrength={-1000}
                cooldownTime={2000}
                nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
                  const label = node.label;
                  const fontSize = 12/globalScale;
                  ctx.font = `${fontSize}px Sans-Serif`;
                  
                  // Draw node
                  ctx.fillStyle = node.type === 'wallet' ? GRAPH_COLORS.wallet : GRAPH_COLORS.transaction;
                  ctx.beginPath();
                  ctx.arc(node.x, node.y, 5, 0, Math.PI * 2);
                  ctx.fill();

                  // Draw label
                  ctx.textAlign = 'center';
                  ctx.textBaseline = 'middle';
                  ctx.fillStyle = GRAPH_COLORS.text;
                  
                  // Only show first line of label in graph
                  const firstLine = label.split('\n')[0];
                  ctx.fillText(firstLine, node.x, node.y + 10);
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-text/50">
                Enter an XRPL address to explore transactions
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-text/50">
          Connect your wallet to explore the XRPL chain
        </div>
      )}
    </Widget>
  );
};

export default GraphPanel;