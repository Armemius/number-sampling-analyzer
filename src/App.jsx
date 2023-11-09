import './App.css'
import {useEffect, useState} from "react";
import Controls from "./components/Controls.jsx";
import Display from "./components/Display.jsx";

const App = () => {
    const [data, setData] = useState([])

    useEffect(() => {
        console.log(data)
    }, [data]);

    return (
        <>
            <Controls setData={setData} />
            <Display data={data} />
        </>
    )
}

export default App
