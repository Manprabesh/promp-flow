import React, { useCallback, useRef, useState, useMemo, useEffect } from 'react';
import {
    ReactFlow,
    useNodesState,
    useEdgesState,
    Position,
    Handle,
    applyNodeChanges,
    MarkerType,
    useNodesData,
    Background,
    BackgroundVariant,
    Controls,
    MiniMap,
    addEdge,
    NodeResizer,
    NodeResizeControl,


} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import "../stylesheet/index.css"
import Loader from "../components/Loader"
import { message, saveMessage } from '../services/api';

type nodeTypee = {
    id: string,
    type: string,
    position: { x: number, y: number },
    selectable: boolean,
    deletable: boolean,
    data: Record<string, string | undefined>
}

type EdgeType = {
    id: string;
    source: string;
    sourceHandle: string;
    target: string;
    markerEnd: {
        type: MarkerType;
        width: number;
        height: number;
        color: string;
    };
    label: string | undefined;
    style: {
        strokeWidth: number;
        stroke: string;
    };
};
type ResponseItem = {
    title: string,
    explanation: string,
    branches: string[],
}

type Response = {
    id: string,
    response: ResponseItem
}[]

type typeRes = {
    id: string,
    response: ResponseItem
}
const initialNodes: nodeTypee[] = [
    { id: 'n1', type: 'inputNode', position: { x: -100, y: 100 }, selectable: true, deletable: true, data: { label: 'node1' } },
];

const InputNode = ({ addNode, getNodes, source, addResponse, selected }:
    {
        addNode: (id: string, type: string, source: string, nodeData: string | undefined) => void,
        getNodes: React.MutableRefObject<nodeTypee[]>,
        source: string,
        addResponse: (nodeId: string, value: ResponseItem) => void,
        selected: boolean
    }) => {

    const [prompt, setPrompt] = useState("");
    const [inputTracker, setInputTracker] = useState(false)

    // const [selected, setSelect] = useState<boolean>(false);
    console.log("something is changing")

    const onChange = useCallback((evt: any) => {
        console.log(evt.target.value);
        setPrompt(evt.target.value);
    }, []);

    function newNode() {
        console.log("get node detailes", getNodes.current.length);
        addNode(`n${getNodes.current.length + 1}`, "inputNode", source, undefined);
        // if
    }
    function ResizeIcon() {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="#ff0071"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ position: 'absolute', right: 5, bottom: 5 }}
            >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <polyline points="16 20 20 20 20 16" />
                <line x1="14" y1="14" x2="20" y2="20" />
                <polyline points="8 4 4 4 4 8" />
                <line x1="4" y1="4" x2="10" y2="10" />
            </svg>
        );
    }

    async function run() {
        if (prompt.length < 1) {
            setInputTracker(true);
            setTimeout(() => {
                setInputTracker(false);

            }, 2000)
            return;
        }



        try {
            const res = await message(prompt);

            if (res.success) {
                console.log("response ->", res.data);
                console.log("typeof res.data ->", typeof res.data);

                let parsedData;

                if (typeof res.data === "string") {
                    parsedData = JSON.parse(res.data);
                } else {
                    parsedData = res.data;
                }

                console.log("parsed data", parsedData)
                // addResponse(nodeID, parsedData);
                addResponse(`n${getNodes.current.length + 1}`, { title: parsedData.title, explanation: parsedData.explanation, branches: parsedData.branches });
                addNode(`n${getNodes.current.length + 1}`, "outputNode", source, prompt);
            }
        } catch (err) {
            console.error("Submit error:", err);
        } finally {
            // addLoader(false);
        }
        // console.log("submi








        console.log("promptt", prompt)
        /**
         * Send the response to outputNode
         */

    }

    function divSelect() {
        // setSelect(!selected)
    }

    function keyPress(e: React.KeyboardEvent) {
        console.log(e.key)
        if (e.key === "Enter") run();
    }

    const controlStyle = {
        background: 'transparent',
        border: 'none',
    };

    return (
        <>

            {/* style={{border:selected ? "2px solid green" : "1px solid gray"}} */}

            <NodeResizer
                color="#ff0071"
                isVisible={selected}
                minWidth={30}
                minHeight={30}
            />
            {
                // loader && <Loader />
            }
            {inputTracker && <div style={{ color: "red", fontSize: "10px" }}> Input cannot be empty </div>}
            <div onClick={divSelect} className='inputNode'>
                {/* <NodeResizer minWidth={100} minHeight={30} /> */}
                {/* <label htmlFor="text">Text:</label> */}
                <input className="inputText" name="text" onChange={onChange} onDoubleClick={onChange} onKeyDown={(e) => { keyPress(e) }} />

                {/* <Handle type="source" position={Position.Right} id="a" /> */}
                <Handle type="source" position={Position.Top} id="a" />
                {/* <Handle type="source" position={Position.Bottom} id="c" /> */}
                <button onClick={run} className='inputBtn'>Run</button>
            </div>
            {/* </NodeResizer> */}

            {/* <button onClick={newNode} >Add Node</button> */}
        </>
    )
}



const OutPutNode = ({ addNode, getNodes, source, response, addResponse, selected }:
    {
        addNode: (id: string, type: string, source: string, nodeData: string | undefined) => void,
        getNodes: React.MutableRefObject<nodeTypee[]>,
        source: string,
        response?: typeRes,
        addResponse: (nodeId: string, value: ResponseItem) => void,
        selected: boolean


    }) => {
    const [prompt, setPrompt] = useState("");
    const [inputTracker, setInputTracker] = useState(false)

    const onChange = useCallback((evt: any) => {
        console.log(evt.target.value);
        setPrompt(evt.target.value);

    }, []);
    console.log("responses", response)
   async  function run() {
        if (prompt.length < 1) {
            setInputTracker(true);
            setTimeout(() => {
                setInputTracker(false);

            }, 2000)
            return;
        }

        /**
         * the target will always be array.length + 1
         * therefore id == target 
         * Since id = array.length+1
         */


        try {
            const res = await message(prompt);

            if (res.success) {
                console.log("response ->", res.data);
                console.log("typeof res.data ->", typeof res.data);

                let parsedData;

                if (typeof res.data === "string") {
                    parsedData = JSON.parse(res.data);
                } else {
                    parsedData = res.data;
                }

                console.log("parsed data", parsedData)
                // addResponse(nodeID, parsedData);
                addResponse(`n${getNodes.current.length + 1}`, { title: parsedData.title, explanation: parsedData.explanation, branches: parsedData.branches });
                addNode(`n${getNodes.current.length + 1}`, "outputNode", source, prompt);
                // addNode(`n${getNodes.current.length + 1}`, "outputNode", source, "this is a nodeData");
                // addResponse(`n${getNodes.current.length + 1}`, { title: "Yo titile", explanation: "fuck fuck", branches: ["boob1", "boob2"] })
            }
        } catch (err) {
            console.error("Submit error:", err);
        } finally {
            // addLoader(false);
        }



    }
    function keyPress(e: React.KeyboardEvent) {
        console.log(e.key)
        if (e.key === "Enter") run();
    }

    return (
        <>
            <div className="nodeWrapper">
                <div className="nodeContent">
                    <NodeResizer
                        color="#ff0071"
                        isVisible={selected}
                        minWidth={200}
                        minHeight={120}
                    />

                    <Handle type="source" position={Position.Top} id="a" />

                    {inputTracker && (
                        <div style={{ color: "red", fontSize: "10px" }}>
                            Input cannot be empty
                        </div>
                    )}

                    <div className="outPutNode">
                        <h1>{response?.response?.title}</h1>
                        <div>{response?.response?.explanation}</div>
                        {/* <div>{response?.response?.branches}</div> */}
                    </div>

                    <Handle type="target" position={Position.Bottom} id="b" />
                </div>

                <div className="inputWrapper">
                    <input
                        className="inputText"
                        name="text"
                        onChange={onChange}
                        onKeyDown={(e) => keyPress(e)}
                    />
                    <button onClick={run} className="inputBtn">Run</button>
                </div>
            </div>
        </>

    );
}

const Card = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState<nodeTypee>(initialNodes);
    const nodesRef = useRef(nodes);
    const [edges, setEdges, onEdgeChange] = useEdgesState<EdgeType>([]);
    const [response, setResponse] = useState<Response>([]);
    const responseRef = useRef(response);

    const addResponse = useCallback((nodeId: string, value: ResponseItem) => {
        // console.log("nodeid", `n${nodeId + 1}`)
        console.log("value -->--------------", value)
        setResponse(prev => [
            ...prev, { id: nodeId, response: value }

        ])
    }, [])

    useEffect(() => {
        nodesRef.current = nodes;
        console.log("new node", nodes)
        // console.log("new node current",nodes.)
    }, [nodes]);

    useEffect(() => {
        responseRef.current = response
    }, [response])

    useEffect(() => {

        let storedData = localStorage.getItem("node");
        let data = storedData ? JSON.parse(storedData) : [];
        console.log("-----------", data.length)
        setNodes(data?.length > 0 ? data : initialNodes);

        storedData = localStorage.getItem("edges");
        data = storedData ? JSON.parse(storedData) : [];
        setEdges(data?.length ? data : []);

        storedData = localStorage.getItem("response");
        data = storedData ? JSON.parse(storedData) : [];
        setResponse(data?.length ? data : []);
    }, [])

    const addInputNode = useCallback((id: string, type: string, source: string | null, nodeData: string | undefined) => {
        function getRandomInt(max: number) {
            return Math.floor(Math.random() * max);
        }
        console.log("reading random number", getRandomInt(100))
        console.log("nodedata", nodeData)

        console.log("nodeId", id)

        setNodes((prev) => [...prev,
        {
            id: id,
            type: `${type}`,
            position: { x: getRandomInt(-200), y: getRandomInt(200) },
            selectable: true,
            deletable: true,
            data: { label: nodeData },
        },
        ]);


        if (type == "outputNode") {

            setEdges((prev) => [...prev,
            {
                id: `n${(prev.length + 1)}`, source: `${source}`, sourceHandle: 'a', target: id, markerEnd: {
                    type: MarkerType.ArrowClosed,
                    width: 20,
                    height: 10,
                    color: '#FF0072',
                },
                label: nodeData,
                style: {
                    strokeWidth: 2,
                    stroke: '#FF0072',
                },
            }]);
        }
    }, [])


    const nodeType = useMemo(() => ({

        inputNode: (props: any) => {
            console.log("props---->", props)
            return (
                <InputNode
                    addNode={addInputNode}
                    getNodes={nodesRef}
                    source={props.id}
                    addResponse={addResponse}
                    selected={props.selected}
                />
            )
        },
        outputNode: (props: any) => {

            const data = responseRef?.current.find((item) => item.id == props.id);
            return (
                <OutPutNode addNode={addInputNode}
                    getNodes={nodesRef}
                    source={props.id}
                    response={data}
                    addResponse={addResponse}
                    selected={props.selected}

                />
            )
        }
    }), []);


    const onConnect = useCallback(
        (params: any) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
        [],
    );
    function newNode() {
        addInputNode(`n${nodes.length + 1}`, "inputNode", null, "")

    }

    function save() {
        localStorage.setItem("node", JSON.stringify(nodes));
        localStorage.setItem("edges", JSON.stringify(edges));
        localStorage.setItem("response", JSON.stringify(response));
    }
    const [selected, setSelect] = useState<boolean>(false);
    function divSelect() {
        console.log("clciked")
        setSelect(!selected)
    }


    return (
        <div>
            <div style={{
                position: "absolute",
                top: "3%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                display: "flex",
                gap: "8px",
                zIndex: "10"
            }}>
                <button onClick={newNode} >InputNode</button>
                <button onClick={save} >Save</button>
            </div>
            <div style={{ width: '100vw', height: '100vh', background: "#091413" }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgeChange}
                    onConnect={onConnect}
                    fitView
                    nodeTypes={nodeType}
                    deleteKeyCode="Delete"
                    onClick={divSelect}
                    minZoom={0.2}
                    maxZoom={2}
                >
                    <Background color="#ccacac" variant={BackgroundVariant.Dots} />
                    <Controls />
                </ReactFlow>
                {/* <MiniMap  /> */}
            </div>
        </div>
    )
}

export default Card;