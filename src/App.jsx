import './App.css'
import {useState} from "react";
import Controls from "./components/Controls.jsx";
import Display from "./components/Display.jsx";

const App = () => {
    const [data, setData] = useState([])

    return (
        <>
            <Controls setData={setData} />
            <Display data={data} />
        </>
    )
}

export default App
