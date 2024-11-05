import './App.css';
import { DiagramComponent, PrintAndExport,
  NodeModel, ConnectorModel, 
  Inject
} from '@syncfusion/ej2-react-diagrams';
import { UploaderComponent } from '@syncfusion/ej2-react-inputs';
import { useRef, useState } from 'react';
function App() {
  const diagramRef = useRef<DiagramComponent>(null);
  const [diagramData, setDiagramData] = useState<string | undefined>();
  const nodes : NodeModel[] = [
    {
      id: "startNode",
      offsetX: 440,
      offsetY: 60,
      shape: { type: "Flow", shape: "Terminator" },
      annotations: [{ content: 'Start', style: { color: 'white' } }]
    },
    {
      id: "inputNode",
      offsetX: 440,
      offsetY: 180,
      shape: { type: "Flow", shape: "Data" },
      annotations: [{ content: 'Enter a number', style: { color: 'white' } }]
    },
    {
      id: "decisionNode",
      offsetX: 440,
      offsetY: 300,
      shape: { type: "Flow", shape: "Decision" },
      annotations: [{ content: 'N divisible by 2 ?', style: { color: 'white' } }]
    },
    {
      id: "processEvenNode",
      offsetX: 700,
      offsetY: 300,
      shape: { type: "Flow", shape: "Process" },
      annotations: [{ content: 'N is Even', style: { color: 'white' } }]
    },
    {
      id: "processOddNode",
      offsetX: 440,
      offsetY: 420,
      shape: { type: "Flow", shape: "Process" },
      annotations: [{ content: 'N is Odd', style: { color: 'white' } }]
    },
    {
      id: "endNode",
      offsetX: 440,
      offsetY: 540,
      shape: { type: "Flow", shape: "Terminator" },
      annotations: [{ content: 'End', style: { color: 'white' } }]
    }
  ];
  
  const connectors : ConnectorModel[]= [
    {
      id: 'startToInputConnector',
      sourceID: 'startNode',
      targetID: 'inputNode'
    },
    {
      id: 'inputToDecisionConnector',
      sourceID: 'inputNode',
      targetID: 'decisionNode'
    },
    {
      id: 'decisionToProcessEvenConnector',
      sourceID: 'decisionNode',
      targetID: 'processEvenNode',
      annotations: [{ content: 'true', alignment: 'Before', displacement: { x: 5, y: 5 } }]
    },
    {
      id: 'decisionToProcessOddConnector',
      sourceID: 'decisionNode',
      targetID: 'processOddNode',
      annotations: [{ content: 'false', alignment: 'After', displacement: { x: 5, y: 5 } }]
    },
    {
      id: 'processOddToEndConnector',
      sourceID: 'processOddNode',
      targetID: 'endNode'
    },
    {
      id: 'processEvenToEndConnector',
      sourceID: 'processEvenNode',
      targetID: 'endNode',
      type: "Orthogonal",
      segments: [{ type: "Orthogonal", direction: "Bottom", length: 200 }]
    }
  ];
  const nodeDefaults =(node:NodeModel) =>{
    node.height = 60;
    node.width = 150;
    node.style = { fill: '#6495ED' };
    return node;
  }
  const asyncSettings = {
    saveUrl: "https://services.syncfusion.com/react/production/api/FileUploader/Save"
  }
  const onSave = ()=>{
    const saveData = diagramRef.current?.saveDiagram()
    // setDiagramData(saveData);
    // console.log(saveData);
    saveData && download(saveData);
  }
  const onLoad = ()=>{
    // if(diagramData){
    //   diagramRef.current?.loadDiagram(diagramData);
    // }
    document.querySelector('.e-file-select-wrap')?.querySelector('button')?.click();
  }
  const download = (JSONData : string) =>{
      const a = document.createElement('a');
      a.href = "data:text/json;charset=utf-8," + encodeURIComponent(JSONData);
      a.download = 'Diagram.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
  }
  const fileUploadSuccess = (args : any) =>{
    const reader = new FileReader();
    reader.onloadend = () =>{
      diagramRef.current?.loadDiagram(reader.result as string);
    }
    reader.readAsText(args.file.rawFile);
  }
  const onExport = ()=>{
      diagramRef.current?.exportDiagram({
        mode:'Download', format:'PNG',
        region: 'PageSettings',
        pageHeight:800, pageWidth: 800
      })
  }
  const onPrint = ()=>{
    diagramRef.current?.print({ region:'PageSettings',
      pageHeight:800, pageWidth: 800
    })
  }
  return (
    <div className="app">
      <div className='button-container'>
        <button className='button' onClick={onSave}>Save</button>
        <button className='button' onClick={onLoad}>Load</button>
        <button className='button' onClick={onExport}>Export</button>
        <button className='button' onClick={onPrint}>Print</button>
      </div>
      <div style={{display:"none"}}>
        <UploaderComponent
          asyncSettings={asyncSettings}
          success={fileUploadSuccess}
        ></UploaderComponent>
      </div>
      <div className='container'>
        <DiagramComponent
          ref={diagramRef}
          width={'902px'}
          height={'602px'}
          nodes={nodes}
          connectors={connectors}
          getNodeDefaults={nodeDefaults}
        >
          <Inject services={[PrintAndExport]} />
        </DiagramComponent>
      </div>
    </div>
  );
}
export default App;
