
import React, {
  useCallback,
  useRef,
  useState,
  useEffect,
} from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Position,
  Handle,
  MarkerType,
  Background,
  BackgroundVariant,
  Controls,
  addEdge,
  NodeResizer,
  useReactFlow,
  ReactFlowProvider,
  type Connection,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "../stylesheet/index.css";
import { message, verifyRoom } from "../services/api";
import PopUp from "../components/Popup";
import { io, Socket } from "socket.io-client";
import { useParams } from "react-router-dom";

import { useUser } from "../context/userContext"

type XYPosition = { x: number; y: number };

type AppNode = {
  id: string;
  type: string;
  position: XYPosition;
  selectable: boolean;
  deletable: boolean;
  data: Record<string, string | undefined>;
};

type AppEdge = {
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
  style: { strokeWidth: number; stroke: string };
};

type ResponseItem = {
  title: string;
  explanation: string;
  branches: string[];
};

type ResponseEntry = {
  id: string;
  response: ResponseItem;
};

// ─── Constants ────────────────────────────────────────────────────────────────

export const socket = io("http://localhost:5000");
const INITIAL_NODES: AppNode[] = [
  {
    id: "n1",
    type: "inputNode",
    position: { x: -100, y: 100 },
    selectable: true,
    deletable: true,
    data: { label: "node1" },
  },
];

const EDGE_STYLE = {
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 10,
    color: "#FF0072",
  },
  style: { strokeWidth: 2, stroke: "#FF0072" },
};

// ─── InputNode ────────────────────────────────────────────────────────────────

type InputNodeProps = {
  addNode: (
    type: string,
    source: string,
    nodeData: string | undefined,
    position?: XYPosition
  ) => string;
  nodesRef: React.MutableRefObject<AppNode[]>;
  source: string;
  addResponse: (nodeId: string, value: ResponseItem) => void;
  selected: boolean;
};

const InputNode: React.FC<InputNodeProps> = ({
  addNode,
  nodesRef,
  source,
  addResponse,
  selected,
}) => {
  const [prompt, setPrompt] = useState("");
  const [emptyError, setEmptyError] = useState(false);
  const [loading, setLoading] = useState(false);

  const showError = () => {
    setEmptyError(true);
    setTimeout(() => setEmptyError(false), 2000);
  };

  const run = useCallback(async () => {
    if (!prompt.trim()) return showError();
    setLoading(true);
    try {
      const res = await message(prompt);
      if (res.success) {
        const parsed =
          typeof res.data === "string" ? JSON.parse(res.data) : res.data;
        const newId = `n${nodesRef.current.length + 1}`;
        addResponse(newId, {
          title: parsed.title,
          explanation: parsed.explanation,
          branches: parsed.branches,
        });
        addNode("outputNode", source, prompt);
      }
    } catch (err) {
      console.error("InputNode run error:", err);
    } finally {
      setLoading(false);
    }
  }, [prompt, source, addNode, addResponse, nodesRef]);

  return (
    <>
      <NodeResizer
        color="#ff0071"
        isVisible={selected}
        minWidth={30}
        minHeight={30}
      />
      {emptyError && (
        <div style={{ color: "red", fontSize: "10px" }}>
          Input cannot be empty
        </div>
      )}
      <div className="inputNode">
        <input
          className="inputText"
          name="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && run()}
          disabled={loading}
        />
        <Handle type="source" position={Position.Top} id="a" />
        <button onClick={run} className="inputBtn" disabled={loading}>
          {loading ? "..." : "Run"}
        </button>
      </div>
    </>
  );
};

// ─── OutputNode ───────────────────────────────────────────────────────────────

type OutputNodeProps = {
  addNode: (
    type: string,
    source: string,
    nodeData: string | undefined,
    position?: XYPosition
  ) => string;
  nodesRef: React.MutableRefObject<AppNode[]>;
  source: string;
  response?: ResponseEntry;
  addResponse: (nodeId: string, value: ResponseItem) => void;
  selected: boolean;
};

const OutputNode: React.FC<OutputNodeProps> = ({
  addNode,
  nodesRef,
  source,
  response,
  addResponse,
  selected,
}) => {
  const [prompt, setPrompt] = useState("");
  const [emptyError, setEmptyError] = useState(false);
  const [loading, setLoading] = useState(false);

  const showError = () => {
    setEmptyError(true);
    setTimeout(() => setEmptyError(false), 2000);
  };

  const run = useCallback(async () => {
    if (!prompt.trim()) return showError();
    setLoading(true);
    try {
      const res = await message(prompt);
      if (res.success) {
        const parsed =
          typeof res.data === "string" ? JSON.parse(res.data) : res.data;
        const newId = `n${nodesRef.current.length + 1}`;
        addResponse(newId, {
          title: parsed.title,
          explanation: parsed.explanation,
          branches: parsed.branches,
        });
        addNode("outputNode", source, prompt);
      }
    } catch (err) {
      console.error("OutputNode run error:", err);
    } finally {
      setLoading(false);
    }
  }, [prompt, source, addNode, addResponse, nodesRef]);

  return (
    <div className="nodeWrapper">
      <div className="nodeContent">
        <NodeResizer
          color="#ff0071"
          isVisible={selected}
          minWidth={200}
          minHeight={120}
        />
        <Handle type="source" position={Position.Top} id="a" />
        {emptyError && (
          <div style={{ color: "red", fontSize: "10px" }}>
            Input cannot be empty
          </div>
        )}
        <div className="outPutNode">
          <h1>{response?.response?.title}</h1>
          <div>{response?.response?.explanation}</div>
        </div>
        <Handle type="target" position={Position.Bottom} id="b" />
      </div>
      <div className="inputWrapper">
        <input
          className="inputText"
          name="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && run()}
          disabled={loading}
        />
        <button onClick={run} className="inputBtn" disabled={loading}>
          {loading ? "..." : "Run"}
        </button>
      </div>
    </div>
  );
};

type AddNodeFn = (
  type: string,
  source: string | null,
  nodeData: string | undefined,
  position?: XYPosition
) => string;

const FlowTools: React.FC<{ addNode: AddNodeFn }> = ({ addNode }) => {
  const { screenToFlowPosition } = useReactFlow();

  const insertCenterNode = useCallback(() => {
    const position = screenToFlowPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });
    addNode("inputNode", null, undefined, position);
  }, [addNode, screenToFlowPosition]);

  return (
    <button
      onClick={insertCenterNode}
      className="center-node"
    >
      Input
    </button>
  );
};



const CardInner: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>(INITIAL_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState<AppEdge>([]);
  const [responses, setResponses] = useState<ResponseEntry[]>([]);
  const [share, setShare] = useState(false);
  const [roomId, setRoomId] = useState("");


  const nodesRef = useRef<AppNode[]>(nodes);
  const responsesRef = useRef<ResponseEntry[]>(responses);
  const socketRef = useRef<Socket | null>(null);


  useEffect(() => { nodesRef.current = nodes; }, [nodes]);
  useEffect(() => { responsesRef.current = responses; }, [responses]);

    const {
        // roomIdData,
        // setRoomId,
        user,
        // setUser
    } = useUser();

  // ── Socket setup ──────────────────────────────────────────────────────────
  // const socket = io(SOCKET_URL);
  useEffect(() => {
    socketRef.current = socket;
    console.log("-------------")
    socket.on("connect", () => console.log("Socket connected:", socket.id));



    const invitationId = new URL(window.location.href).search.substring(3);
    console.log("invitaion Id", invitationId)
    console.log("invitaion Id", user)
    //verify the url then join
    async function verifyRoomURL(roomURL: string) {
      const res = await verifyRoom(roomURL);
      console.log("checking", res);
      if (res.success) {

        setRoomId(res.data)
        console.log("room is valid", res.data);

        socket.emit("join_room", res.data);

        return true;

      }
      else {
        return false;
      }
    }


    async function init() {
      if (invitationId) {
        const valid = await verifyRoomURL(invitationId);

        if (valid) {
          console.log("room is valid", roomId);
          // setRoomId(invitationId);
          // socket.emit("join_room", roomId);
        } else {
          console.log("Invalid room URL");
        }
      }
    }

    init();


    // return () => {
    //   socket.disconnect();
    // };
  }, []);

  useEffect(() => {
    console.log("userrr -->",user)
    setRoomId(user)
    socket.on("roomData", (data) => {
      console.log("socket data --->", data)
      setNodes(data.nodes);
      setResponses(data.response);
      setEdges(data.edges);
    });
  }, [])

  // ── Restore from localStorage ─────────────────────────────────────────────
  useEffect(() => {
    const savedNodes = localStorage.getItem("node");
    const savedEdges = localStorage.getItem("edges");
    const savedResponse = localStorage.getItem("response");

    const parsedNodes = savedNodes ? JSON.parse(savedNodes) : [];
    const parsedEdges = savedEdges ? JSON.parse(savedEdges) : [];
    const parsedResponse = savedResponse ? JSON.parse(savedResponse) : [];

    setNodes(parsedNodes.length ? parsedNodes : INITIAL_NODES);
    setEdges(parsedEdges.length ? parsedEdges : []);
    setResponses(parsedResponse.length ? parsedResponse : []);
  }, []);

  useEffect(()=>{
    const roomId = localStorage.getItem("roomId");
    console.log("localroom",roomId);
    if(roomId){
      socket.emit("join_room",roomId)
    }
  },[])

  const OUTPUT_OFFSET_Y = 220; // vertical gap between input and output node
  const OUTPUT_OFFSET_X = 0;   // horizontal offset (0 = directly below)

  const addNode = useCallback(
    (
      type: string,
      source: string | null,
      nodeData: string | undefined,
      position?: XYPosition
    ): string => {
      let newId = "";

      setNodes((prev) => {
        newId = `n${prev.length + 1}`;


        let resolvedPosition: XYPosition;
        if (type === "outputNode" && source) {
          const sourceNode = prev.find((n) => n.id === source);
          resolvedPosition = sourceNode
            ? {
              x: sourceNode.position.x + OUTPUT_OFFSET_X,
              y: sourceNode.position.y + OUTPUT_OFFSET_Y,
            }
            : { x: 0, y: 0 };
        } else {
          resolvedPosition = position ?? { x: 0, y: 0 };
        }

        const newNode: AppNode = {
          id: newId,
          type,
          position: resolvedPosition,
          selectable: true,
          deletable: true,
          data: { label: nodeData },
        };
        return [...prev, newNode];
      });

      if (type === "outputNode" && source) {
        setEdges((prev) => {
          const edgeId = `e${prev.length + 1}`;
          const newEdge: AppEdge = {
            id: edgeId,
            source,
            sourceHandle: "a",
            target: newId,
            label: nodeData,
            ...EDGE_STYLE,
          };
          return [...prev, newEdge];
        });
      }

      return newId;
    },
    []
  );

  const addResponse = useCallback((nodeId: string, value: ResponseItem) => {
    setResponses((prev) => [...prev, { id: nodeId, response: value }]);
  }, []);


  const nodeTypesRef = useRef<NodeTypes>({
    inputNode: (props: any) => (
      <InputNode
        addNode={addNode}
        nodesRef={nodesRef}
        source={props.id}
        addResponse={addResponse}
        selected={props.selected}
      />
    ),
    outputNode: (props: any) => {
      const data = responsesRef.current.find((r) => r.id === props.id);
      return (
        <OutputNode
          addNode={addNode}
          nodesRef={nodesRef}
          source={props.id}
          response={data}
          addResponse={addResponse}
          selected={props.selected}
        />
      );
    },
  });

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((prev) => addEdge(params, prev) as AppEdge[]),
    []
  );

  // ── Toolbar actions ───────────────────────────────────────────────────────
  const addInputNode = useCallback(
    () => addNode("inputNode", null, undefined),
    [addNode]
  );

  const save = useCallback(() => {
    localStorage.setItem("node", JSON.stringify(nodesRef.current));
    localStorage.setItem("edges", JSON.stringify(edges));
    localStorage.setItem("response", JSON.stringify(responsesRef.current));
    console.log("room id", roomId)
    console.log("nodes", nodesRef.current)
    socket.emit("send_new_message", {
      nodes: nodesRef.current,
      response: responsesRef.current,
      edges,
      roomId,
    });
  }, [edges, roomId]);

  const joinRoom = useCallback(() => {
    socketRef.current?.emit("join_room", "room123");
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      {share && (
        <PopUp
          message="Share your screen with others in real time"
          joinRoom={joinRoom}
          share={setShare}
          room={setRoomId}
        />
      )}

      <div className="navbar">
        <button className="nav-btn" onClick={() => setShare((s) => !s)}>
          Share
        </button>
        {/* <button className="nav-btn" onClick={addInputNode}>
          Input
        </button> */}
        <button className="nav-btn" onClick={save}>
          Save
        </button>
      </div>

      <div style={{ width: "100vw", height: "100vh", background: "#091413" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypesRef.current}
          fitView
          deleteKeyCode={['Backspace', 'Delete']}
        >
          <Background color="#ccacac" variant={BackgroundVariant.Dots} />
          <Controls />
        </ReactFlow>
      </div>

      {/* FlowTools must be inside ReactFlowProvider to use useReactFlow() */}
      <FlowTools addNode={addNode} />
    </>
  );
};

// ─── Card: provides ReactFlowProvider context ─────────────────────────────────

const Card: React.FC = () => (
  <ReactFlowProvider>
    <CardInner />
  </ReactFlowProvider>
);

export default Card;