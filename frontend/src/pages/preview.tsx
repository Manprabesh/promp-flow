import { useEffect, useState } from "react";
import "../stylesheet/storePreview.css"
import { getMessage } from "../services/api";
type Message = [{
    prompt: string;
    response: string;
}];
const StorePreview = () => {
    const [data, setData] = useState<Message[]>([]);
    const [page, setPage] = useState<number>(1);
    const [limit, setlimit] = useState<number>(6);

    const fetchData = async () => {
        try {


            const result = await getMessage(page);
            if (result.success) {

                setData((prev) => [...prev, ...result.data.message]);
            }

            else {
                console.log("failes response")
            }
        } catch (err) {
            console.error("Fetch error:", err);
        }
    };

    function addMore() {
        setPage((prev) => prev + 1);
    }

    useEffect(() => {
        fetchData();
    }, [page, limit]);

    return (
        <div className="container">
            <h2>Online Store Preview</h2>

            <div className="card-container">
                {data.length > 0 ? (
                    data.map((item, index) => (
                        <div key={index} className="card-item">
                            <h3>{item.prompt}</h3>
                            <p className="card-text">{item.response}</p>
                        </div>
                    ))
                ) : (
                    <div className="no-item">
                        <div key="no card" className="no-item">
                            <h3 className="card-title">No Message</h3>
                            {/* <div className="card-divider" /> */}
                            <p className="card-text">Nothing here yet. Messages will appear once they arrive.</p>
                        </div>
                    </div>
                )}
                {/* <Loader message="no message"/> */}
            </div>

            {
                data.length > 0 && <button onClick={addMore} className="refresh-btn">
                    More
                </button>
            }
        </div>
    );
};


export default StorePreview;

