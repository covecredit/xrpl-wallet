import React from 'react';
import { Activity } from 'lucide-react';
import Widget from '../Widget/Widget';
import ForceGraph2D from 'react-force-graph-2d';
import { mockGraphData } from '../../utils/mockData';

const GraphPanel: React.FC = () => {
  return (
    <Widget
      id="graph"
      title="Transaction Graph"
      icon={Activity}
      defaultPosition={{ x: 360, y: 80 }}
      defaultSize={{ width: 800, height: 500 }}
    >
      <div className="h-full w-full">
        <ForceGraph2D
          graphData={mockGraphData}
          nodeColor={(node: any) => 
            node.type === 'wallet' ? '#FFD700' : 
            node.type === 'transaction' ? '#4A90E2' : '#E6E8E6'
          }
          nodeLabel={(node: any) => node.label}
          linkColor={() => 'rgba(255, 215, 0, 0.2)'}
          backgroundColor="transparent"
          width={800}
          height={400}
        />
      </div>
    </Widget>
  );
};

export default GraphPanel;