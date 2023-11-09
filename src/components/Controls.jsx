import PropTypes from "prop-types";

const Controls = ({setData}) => {

    const isNumeric = str => {
        if (typeof str != "string") {
            return false
        }
        return !isNaN(str) && !isNaN(parseFloat(str))
    }

    const processInput = ev => {
        setData(
            ev.target.value
                .split(/,|;|\s+/)
                .filter(it => isNumeric(it))
                .map(it => Number(it))
        )
    }

    return (
        <div>
            <h2>Ввод данных</h2>
            <input id="sample-input" type="text" onChange={processInput}/>
        </div>
    )
}

Controls.propTypes = {
    setData: PropTypes.func
}

export default Controls