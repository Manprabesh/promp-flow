import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../stylesheet/project.css";

type ProjectType = {
    id: string;
    pName: string;
    pDesc: string;
    createdAt: string;
    updatedAt: string;
};

type DisplayProjectProps = {
    project: ProjectType;
    navigate: ReturnType<typeof useNavigate>;
    index: number;
};

const PROJECT_COLORS = [
    "#E8D5B7", "#B7D4E8", "#D4B7E8", "#B7E8D5",
    "#E8B7C8", "#C8E8B7", "#E8C8B7", "#B7C8E8",
];

function getInitials(name: string) {
    return name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? "")
        .join("");
}

function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(mins / 60);
    const days = Math.floor(hrs / 24);
    if (days > 0) return `${days}d ago`;
    if (hrs > 0) return `${hrs}h ago`;
    if (mins > 0) return `${mins}m ago`;
    return "Just now";
}

const DisplayProject = ({ project, navigate, index }: DisplayProjectProps) => {
    const [showLink, setShowLink] = useState(false);
    const [copied, setCopied] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const inviteLink = `${window.location.origin}/invite/${project.id}`;
    const color = PROJECT_COLORS[index % PROJECT_COLORS.length];

    function copyLink() {
        navigator.clipboard.writeText(inviteLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <div className="project-item" style={{ animationDelay: `${index * 60}ms` }}>
            <div
                className="project-card"
                onClick={() => navigate(`/app/project/${project.pName}`)}
            >
                {/* Avatar */}
                <div
                    className="project-avatar"
                    style={{ background: color }}
                >
                    <span className="project-avatar-text">
                        {getInitials(project.pName)}
                    </span>
                </div>

                {/* Content */}
                <div className="project-content">
                    <div className="project-header">
                        <h3 className="project-name">{project.pName}</h3>
                        <span className="project-time">{timeAgo(project.updatedAt)}</span>
                    </div>
                    <p className="project-desc">{project.pDesc}</p>
                    <div className="project-footer">
                        <span className="project-tag">Active</span>
                        <span className="project-meta">
                            Created {new Date(project.createdAt).toLocaleDateString("en-US", {
                                month: "short", day: "numeric", year: "numeric"
                            })}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div
                    className="project-actions"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        className="action-btn"
                        title="Invite members"
                        onClick={() => setShowLink(!showLink)}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                            <circle cx="9" cy="7" r="4"/>
                            <line x1="19" y1="8" x2="19" y2="14"/>
                            <line x1="22" y1="11" x2="16" y2="11"/>
                        </svg>
                    </button>
                    <button
                        className="action-btn"
                        title="More options"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="5" r="1" fill="currentColor"/>
                            <circle cx="12" cy="12" r="1" fill="currentColor"/>
                            <circle cx="12" cy="19" r="1" fill="currentColor"/>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Invite link panel */}
            {showLink && (
                <div className="invite-panel">
                    <div className="invite-panel-header">
                        <span className="invite-label">Invite link</span>
                        <button className="invite-close" onClick={() => setShowLink(false)}>×</button>
                    </div>
                    <div className="invite-link-row">
                        <input
                            className="invite-input"
                            readOnly
                            value={inviteLink}
                        />
                        <button
                            className={`copy-btn ${copied ? "copy-btn--success" : ""}`}
                            onClick={copyLink}
                        >
                            {copied ? (
                                <>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20,6 9,17 4,12"/>
                                    </svg>
                                    Copied
                                </>
                            ) : (
                                <>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                                    </svg>
                                    Copy
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const Project = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<ProjectType[]>([]);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("Date created");

    useEffect(() => {
        const storedProjects = localStorage.getItem("projects");
        if (storedProjects) {
            setProjects(JSON.parse(storedProjects));
        } else {
            const p = localStorage.getItem("pName");
            const d = localStorage.getItem("pDesc");
            if (p && d) {
                const single: ProjectType = {
                    id: crypto.randomUUID(),
                    pName: p,
                    pDesc: d,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
                setProjects([single]);
                localStorage.setItem("projects", JSON.stringify([single]));
            }
        }
    }, []);

    const filteredAndSortedProjects = useMemo(() => {
        let filtered = projects.filter((proj) =>
            proj.pName.toLowerCase().includes(search.toLowerCase())
        );
        switch (sortBy) {
            case "Recent activity":
            case "Last edited":
                return [...filtered].sort(
                    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
                );
            default:
                return [...filtered].sort(
                    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
        }
    }, [projects, search, sortBy]);

    return (
        <div className="page">
            {/* Page header */}
            <div className="page-header">
                <div className="page-title-group">
                    <h1 className="page-title">Projects</h1>
                    <span className="page-count">{projects.length}</span>
                </div>
                <p className="page-subtitle">Manage and collaborate on your projects</p>
            </div>

            {/* Toolbar */}
            <div className="toolbar">
                <div className="search-wrapper">
                    <svg className="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="m21 21-4.35-4.35"/>
                    </svg>
                    <input
                        className="search-input"
                        placeholder="Search projects…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {search && (
                        <button className="search-clear" onClick={() => setSearch("")}>×</button>
                    )}
                </div>

                <div className="toolbar-right">
                    <div className="sort-wrapper">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="21" y1="10" x2="7" y2="10"/>
                            <line x1="21" y1="6" x2="3" y2="6"/>
                            <line x1="21" y1="14" x2="3" y2="14"/>
                            <line x1="21" y1="18" x2="7" y2="18"/>
                        </svg>
                        <select
                            className="sort-select"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="Date created">Date created</option>
                            <option value="Recent activity">Recent activity</option>
                            <option value="Last edited">Last edited</option>
                        </select>
                    </div>

                    <button className="new-btn" onClick={() => navigate("/app/project/new")}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"/>
                            <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        New Project
                    </button>
                </div>
            </div>

            {/* Results info */}
            {search && (
                <p className="results-info">
                    {filteredAndSortedProjects.length} result{filteredAndSortedProjects.length !== 1 ? "s" : ""} for <strong>"{search}"</strong>
                </p>
            )}

            {/* Project list */}
            <div className="project-list">
                {filteredAndSortedProjects.length > 0 ? (
                    filteredAndSortedProjects.map((proj, i) => (
                        <DisplayProject key={proj.id} project={proj} navigate={navigate} index={i} />
                    ))
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                                <line x1="12" y1="11" x2="12" y2="17"/>
                                <line x1="9" y1="14" x2="15" y2="14"/>
                            </svg>
                        </div>
                        <p className="empty-title">
                            {search ? "No projects match your search" : "No projects yet"}
                        </p>
                        <p className="empty-sub">
                            {search ? "Try a different search term" : "Create your first project to get started"}
                        </p>
                        {!search && (
                            <button className="new-btn" onClick={() => navigate("/app/project/new")}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19"/>
                                    <line x1="5" y1="12" x2="19" y2="12"/>
                                </svg>
                                New Project
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Project;