import { useState } from "react"
import { useNavigate } from "react-router-dom";
import "../stylesheet/newProject.css"


const NewProject = () => {
    const [project, setProject] = useState<string>("");
    const [desc, setDesc] = useState<string>("");
    const navigate = useNavigate();

    function projectName(e: any) {
        console.log(e.target.value)
        setProject(e.target.value.trim());
    }

    function projectDesc(e: any) {
        setDesc(e.target.value)
    }

    function save() {
        //submit project name to backend

        if (project.length <= 0) {
            alert("prpject name required")
        } else {

            console.log(project)
            console.log(desc)
            localStorage.setItem("pName",project);
            localStorage.setItem("pDesc",desc);
            navigate("/app/project/123")
        }
    }

    return (
        <div className="container">
            <input type="text" className="input-box" placeholder="Enter project name" onChange={(e) => projectName(e)} />
            <input type="text" className="project-description" placeholder="Enter project description" onChange={(e) => projectDesc(e)} />
            <button onClick={save}>Create Project</button>
        </div>
    )
}

export default NewProject