import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import {
    Background,
    ReactFlow,
    useNodesState,
    useEdgesState,
    addEdge,
    useReactFlow,
    ReactFlowProvider,
    type Node,
    type Edge,
    Position,
    Handle,
    applyNodeChanges,
    MarkerType
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import "../stylesheet/index.css"
import { message } from '../services/api';
const initialNodes = [
    {
        id: 'node-1',
        type: 'textUpdaters',
        position: { x: 0, y: 0 },
        data: { value: 123 },
    },
    {
        id: 'node-2',
        type: 'textDisplay',
        position: { x: 300, y: 0 },
        data: { value: 23 },
    },
];



type props = {
    addPrompt: (nodeID: string, value: string) => void;
    prompts: string;
    addNode: () => void;
    nodeID: string;
    addResponse: (nodeID: string, value: string) => void;
};

const TextUpdaterNode = ({ addPrompt, prompts, addNode, nodeID, addResponse }: props) => {
    const inputRef = useRef(null);
    const [focus, setFocus] = useState(false);

    let value;
    const submit = useCallback(async () => {
        value = inputRef.current?.value?.trim();
        if (!value) return;
        const res = await message(value);
        if (res.success) {
            console.log("response ->", res)
            addResponse(nodeID, res.data)
        }
        addPrompt(nodeID, value);
        console.log("submitted:", value);
    }, [addPrompt]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
            }
            else {
                // submit();
                // console.log("prmopt", prompts)
            }
        },
        [submit]
    );


    return (
        <div
            className="text-updater-node"
            tabIndex={0}
            onFocus={() => setFocus(true)}
            onBlur={(e) => {
                if (e.currentTarget.contains(e.relatedTarget)) return;
                setFocus(false);
            }}
        >
            {/* {
                focus && 
            } */}

            <div>
                <label htmlFor="text">Text:</label>
                <textarea id="text" name="text" className="nodrag"
                    ref={inputRef}
                    onKeyDown={handleKeyDown}
                    defaultValue={prompts}
                    placeholder='Enter your prompt'
                />
            </div>
            <button onClick={submit}>Run</button>
            <Handle type="target" position={Position.Left} />
            <Handle type="source" position={Position.Right} id="a" />
            <Handle type="source" position={Position.Top} id="b" />

        </div>
    );
};

type Props = {
    prompts: string;
};

const TextDisplayNode = ({ response }: { response: string }) => {
    const saveResponse = useCallback(() => {
        console.log("saves!")
    }, []);
    return (
        <div>

            <div className='text-display-node'>
                <p id="response-para">

                    {
                        response
                    }
                </p>
                <Handle type="target" position={Position.Left} />
                <Handle type="source" position={Position.Right} id="a" />
                <Handle type="source" position={Position.Top} id="b" />
            </div>
            <button onClick={saveResponse}>Save</button>
        </div>
    )
}

const rfStyle = {
    backgroundColor: '#B8CEFF',
};


const initialEdges = [

    {
        id: 'e1',
        source: 'node-1',
        target: 'node-2',
        markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: '#FF0072',
        },
        // label: 'marker size and color',
        style: {
            strokeWidth: 2,
            stroke: '#FF0072',
        },
    },
];



const Card = () => {

    const [nodes, setNodes] = useNodesState(initialNodes);
    const [edges, setEdges] = useEdgesState(initialEdges);
    const [prompt, setPrompt] = useState<Record<string, string>>({});
    const [response, setResponse] = useState<Record<string, string>>({});


    const addNode = useCallback(() => {


        setNodes(prev => {
            const newId = `node-${prev.length + 1}`

            setEdges(eds => [...eds, {
                id: `e${eds.length + 1}`,
                source: newId,
                target: newId + 1,
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    width: 20,
                    height: 10,
                    color: '#FF0072',
                },
                // label: 'marker size and color',
                style: {
                    strokeWidth: 2,
                    stroke: '#FF0072',
                },
            },])

            console.log("nodes", prev)
            return [...prev, {
                id: newId,
                type: 'textUpdaters',
                position: { x: prev[prev.length - 1]['position']['x'] + 200, y: prev[prev.length - 1]['position']['y'] + 0 },
                data: { value: 0 },
            },
            {
                id: newId + 1,
                type: 'textDisplay',
                position: { x: prev[prev.length - 1]['position']['x'] + 500, y: prev[prev.length - 1]['position']['y'] + 50 },
                data: { value: 0 },
            }]
        })

    }, [setNodes, setEdges])


    const addPrompt = useCallback((nodeId: string, value: string) => {
        setPrompt(prev => ({
            ...prev,
            [nodeId]: value,
        }))
    }, [])

    const addResponse = useCallback((nodeId: string, value: string) => {
        setResponse(prev => ({
            ...prev,
            [nodeId]: value,
        }))
    }, [])


    const nodeTypes = useMemo(() => ({
        textUpdaters: (props: any) => {
            // console.log("propsss---> ", props)
            return (
                <>

                    <TextUpdaterNode {...props}
                        addPrompt={addPrompt}
                        addResponse={addResponse}
                        prompts={prompt[props.id]}
                        addNode={addNode}
                        nodeID={props.id}

                    />
                </>
            )
        },
        textDisplay: (props: any) => {
            const sourceEdge = edges.find(e => e.target === props.id);
            const sourceNodeId = sourceEdge?.source;
            return <TextDisplayNode response={response[sourceNodeId ?? ""] ?? ""}
            />
        }
    }), [prompt, addNode, addPrompt, edges]);

    const onNodesChange = useCallback(
        (changes: any) => {
            setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot))
        },
        [],
    );


    return (
        <>
            <button className="add-node-btn" onClick={addNode}>
                <span className="plus-icon">+</span>
                Add node
            </button>

            <div style={{ width: '100vw', height: '100vh' }}>
                <ReactFlow
                    onNodesChange={onNodesChange}
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    fitView
                    style={rfStyle}
                />
            </div>
        </>
    )
}

export default Card;