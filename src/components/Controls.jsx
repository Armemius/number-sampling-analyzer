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
        <section>
            <h1>Ввод данных</h1>
            <input type="text"
                   onChange={processInput}
                   placeholder={"1, 2, 3, 4, 5..."}
            />
        </section>
    )
}

Controls.propTypes = {
    setData: PropTypes.func
}

export default Controls