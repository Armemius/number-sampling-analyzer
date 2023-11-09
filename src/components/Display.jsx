import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import Graphics from "./Graphics.jsx";

const Display = ({data}) => {
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
        functionValues.push([["-inf", uniqueData[0]], sum])
        sum += data.count(uniqueData[0]) / size
        for (let it = 1; it < uniqueData.length; ++it) {
            functionValues.push([[uniqueData[it - 1], uniqueData[it]], sum])
            sum += data.count(uniqueData[it]) / size
        }
        functionValues.push([[uniqueData[uniqueData.length - 1], "inf"], 1])

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
            <section>
                <div>
                    Недостаточно данных
                </div>
            </section>
        )
    }

    return (
        <section className="results">
            <h1>Результаты анализа выборки</h1>
            <section>
                <article>
                    <h2>Исходные данные</h2>
                    [{[...data].join("; ")}]
                </article>
                <article>
                    <h2>Вариационный ряд</h2>
                    [{[...sortedData].join("; ")}]
                </article>
                <article>
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
                </article>
                <article>
                    <h2>Оценка математического ожидания</h2>
                    {expectationEstimation.toFixed(4)}
                </article>
                <article>
                    <h2>Среднеквадратичное отклонение</h2>
                    {standardDeviation.toFixed(4)}
                </article>
                <article>
                    <h2>Данные для функции</h2>
                    <div className="function-data-container">
                        {functionValues.map((it, index) =>
                            <>
                                <span>x ∈</span>
                                <span>({it[0][0]}; {it[0][1]}{index === functionValues.length - 1 ? ")" : "]"}</span>
                                <span>:</span>
                                <span>{it[1].toFixed(2)}</span>
                            </>
                        )}
                    </div>
                </article>
                <article>
                    <h2>Данные для гистограммы</h2>
                    <div className="histogram-data-container">
                        {histogramValues.map(it =>
                            <>
                                <span>[{it[0][0].toFixed(2)}; {it[0][1].toFixed(2)})</span>
                                <span>Кол-во элементов: {it[1]}</span>
                                <span>Частотность: {it[2].toFixed(2)}</span>
                            </>
                        )}
                    </div>
                </article>
            </section>
            <Graphics functionData={functionValues} histogramData={histogramValues} />
        </section>
    )
}

Display.propTypes = {
    data: PropTypes.arrayOf(PropTypes.number)
}

export default Display;