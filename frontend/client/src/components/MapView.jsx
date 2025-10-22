import {MapContainer, TileLayer, Polygon, Popup} from "react-leaflet";

import{useEffect, useState} from "react";

// map of nairobi/langata is displayed with clickable polygons
// user clicks on polygon
// backend sends insights based on polygon

export default function() {
    const [polygon, setPolygon] = useState([]);
    const [selectedInsight, setselectedInsight] = useState(null);

    useEffect(() => {
        fetch("http://127.0.0.1:5000/polygons")
        .then((res) => res.json())
        .then((data) => setPolygon(data))
        .catch((err) => console.error("Error loading polygons:", err));
    }, []);

    const handlePolygonClick = async (polygon) => {
        try {
            const res = await fetch (
                `http://127.0.0.1:5000/polygons/${polygon.id}/grading`
            );
            const data = await res.json();
            setselectedInsight(data);
            catch(error) {
                console.error("Error fetching grade", error);
                
            }
        };
    }
    

    
}