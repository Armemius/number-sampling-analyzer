import PropTypes from "prop-types";
import {useEffect, useState} from "react";

const Display = ({data}) => {
    // Test values
    // -0.26, -0.58, 1.49, -0.84, -1.54, 1.13, -1.33, -0.78, -1.68, -0.94, -1.55, 1.54, 0.34, 0.58, -0.84, -1.58, -1.72, -0.49, 0.34, -0.14

    const [sortedData, setSortedData] = useState([])
    const [expectationEstimation, setExpectationEstimation] = useState(0)
    const [standardDeviation, setStandardDeviation] = useState(0)
    const [functionValues, setFunctionValues] = useState([])
    const [histogramValues, setHistogramValues] = useState([])

    useEffect(() => {
        if (data.length <= 1) {
            return
        }

        const size = data.length
        const sortedData = [...data].sort((a, b) => a - b)
        const uniqueData = [...new Set(sortedData)].sort((a, b) => a - b)
        const expectationEstimation = sortedData.reduce((acc, it) => acc + it) / size
        const standardDeviation = Math.sqrt(
            sortedData
                .map(it => (it - expectationEstimation) * (it - expectationEstimation))
                .reduce((acc, it) => acc + it) / (size - 1)
        )

        const functionValues = []
        let sum = 0
        functionValues.push([["-∞", uniqueData[0]], sum])
        sum += data.count(uniqueData[0]) / size
        for (let it = 1; it < uniqueData.length; ++it) {
            functionValues.push([[uniqueData[it - 1], uniqueData[it]], sum])
            sum += data.count(uniqueData[it]) / size
        }
        functionValues.push([[uniqueData[uniqueData.length - 1], "∞"], 1])

        const histogramValues = []
        const histogramRange = Math.round(((sortedData[size - 1] - sortedData[0]) / (Math.log2(size) + 1)) * 10) / 10
        let leftRangeLimit = sortedData[0] - histogramRange / 2
        let rightRangeLimit = leftRangeLimit + histogramRange
        let itemsCounter = 0

        for (let it = 0; it < uniqueData.length; ++it) {
            if (uniqueData[it] < rightRangeLimit) {
                itemsCounter += data.count(uniqueData[it])
            } else {
                histogramValues.push([[leftRangeLimit, rightRangeLimit], itemsCounter, itemsCounter / size])
                itemsCounter = 0
                leftRangeLimit = rightRangeLimit
                rightRangeLimit += histogramRange
                itemsCounter = data.count(uniqueData[it])
            }
        }
        histogramValues.push([[leftRangeLimit, rightRangeLimit], itemsCounter, itemsCounter / size])

        setSortedData(sortedData)
        setExpectationEstimation(expectationEstimation)
        setStandardDeviation(standardDeviation)
        setFunctionValues(functionValues)
        setHistogramValues(histogramValues)
    }, [data]);

    if (data.length <= 1) {
        return (
            <>
                <div>
                    Недостаточно данных
                </div>
            </>
        )
    }

    return (
        <>
            <div>
                <h2>Исходные данные</h2>
                [{[...data].join("; ")}]
            </div>
            <div>
                <h2>Вариационный ряд</h2>
                [{[...sortedData].join("; ")}]
            </div>
            <div>
                <h2>Экстремальные значения</h2>
                <div>
                    1-ая порядковая статистика: {sortedData[0]}
                </div>
                <div>
                    {sortedData.length}-ая порядковая статистика: {sortedData[sortedData.length - 1]}
                </div>
                <div>
                    Разброс: {Math.abs(sortedData[sortedData.length - 1] - sortedData[0])}
                </div>
            </div>
            <div>
                <h2>Оценка математического ожидания</h2>
                {expectationEstimation}
            </div>
            <div>
                <h2>Среднеквадратичное отклонение</h2>
                {standardDeviation}
            </div>
            <div>
                <h2>Данные для эмпирической функции распределения</h2>
                {functionValues.map((it, index) =>
                    <div key={it[1]}>
                        x ∈ ({it[0][0]}; {it[0][1]}{index === functionValues.length - 1 ? ")" : "]"} : {it[1].toFixed(2)}
                    </div>
                )}
            </div>
            <div>
                <h2>Данные для гистограммы</h2>
                {histogramValues.map(it =>
                    <div key={`${it[0][0]}->${it[0][1]}`}>
                        [{it[0][0]}; {it[0][1]}) Частота: {it[1]} Частотность: {it[2]}
                    </div>
                )}
            </div>
        </>
    );
};

Display.propTypes = {
    data: PropTypes.arrayOf(PropTypes.number)
}

export default Display;