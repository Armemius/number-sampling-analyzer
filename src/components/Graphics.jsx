import {useLayoutEffect, useRef} from 'react';
import PropTypes from "prop-types";

const Graphics = ({functionData, histogramData}) => {
    const functionCanvasRef = useRef(null);
    const histogramCanvasRef = useRef(null);

    const MAIN_LINES_WIDTH = 3
    const LAYOUT_OFFSET = 20
    const CANVAS_BORDER_OFFSET = 40
    const FONT_SIZE = 12

    const drawLine = (ctx, x1, y1, x2, y2) => {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    useLayoutEffect(() => {
        if (!functionCanvasRef || functionData.length === 0) {
            return
        }
        const canvas = functionCanvasRef.current
        const ctx = canvas.getContext("2d")
        ctx.fillStyle = "white"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.lineWidth = MAIN_LINES_WIDTH;
        ctx.strokeStyle = "black"
        drawLine(
            ctx,
            CANVAS_BORDER_OFFSET,
            canvas.height - CANVAS_BORDER_OFFSET - MAIN_LINES_WIDTH / 2,
            canvas.width - CANVAS_BORDER_OFFSET,
            canvas.height - CANVAS_BORDER_OFFSET - MAIN_LINES_WIDTH / 2
        )
        drawLine(
            ctx,
            CANVAS_BORDER_OFFSET - MAIN_LINES_WIDTH / 2,
            CANVAS_BORDER_OFFSET,
            CANVAS_BORDER_OFFSET - MAIN_LINES_WIDTH / 2,
            canvas.height - CANVAS_BORDER_OFFSET
        )

        ctx.lineWidth = 1;
        ctx.fillStyle = "black"
        ctx.font = `${FONT_SIZE}px Arial`;

        const START_Y_VALUE = 0
        const END_Y_VALUE = 1
        const RANGE_Y = END_Y_VALUE - START_Y_VALUE

        const LINE_Y_START = canvas.height - CANVAS_BORDER_OFFSET - LAYOUT_OFFSET
        const LINE_Y_END = CANVAS_BORDER_OFFSET + LAYOUT_OFFSET
        const LINE_Y_RANGE = LINE_Y_START - LINE_Y_END
        const LINE_Y_INTERVAL = LINE_Y_RANGE / 4

        const START_X_VALUE = Math.floor(functionData[0][0][1])
        const END_X_VALUE = Math.ceil(functionData[functionData.length - 1][0][0])
        const RANGE_X = END_X_VALUE - START_X_VALUE

        const LINE_X_START = CANVAS_BORDER_OFFSET + LAYOUT_OFFSET
        const LINE_X_END = canvas.width - CANVAS_BORDER_OFFSET - LAYOUT_OFFSET
        const LINE_X_RANGE = LINE_X_END - LINE_X_START
        const LINE_X_INTERVAL = LINE_X_RANGE / 4

        const convertCoordX = x => {
            const RELATIVE_POS = (x - START_X_VALUE) / RANGE_X
            return LINE_X_START + LINE_X_RANGE * RELATIVE_POS
        }

        const convertCoordY = y => {
            const RELATIVE_POS = (y - START_Y_VALUE) / RANGE_Y
            return LINE_Y_START - LINE_Y_RANGE * RELATIVE_POS
        }

        // Y Axis
        for (let it = 0; it < 5; ++it) {
            drawLine(
                ctx,
                CANVAS_BORDER_OFFSET,
                LINE_Y_START - LINE_Y_INTERVAL * it,
                canvas.width - CANVAS_BORDER_OFFSET,
                LINE_Y_START - LINE_Y_INTERVAL * it
            )

            ctx.fillText(
                (START_Y_VALUE + (END_Y_VALUE - START_Y_VALUE) / 4 * it).toFixed(2),
                CANVAS_BORDER_OFFSET - 30,
                LINE_Y_START - LINE_Y_INTERVAL * it + FONT_SIZE / 2
            )
        }

        // X Axis
        for (let it = 0; it < 5; ++it) {
            drawLine(
                ctx,
                LINE_X_START + LINE_X_INTERVAL * it,
                CANVAS_BORDER_OFFSET,
                LINE_X_START + LINE_X_INTERVAL * it,
                canvas.height - CANVAS_BORDER_OFFSET
            )

            ctx.fillText(
                (START_X_VALUE + (END_X_VALUE - START_X_VALUE) / 4 * it).toFixed(2),
                LINE_X_START + LINE_X_INTERVAL * it - 10,
                canvas.height - CANVAS_BORDER_OFFSET + FONT_SIZE + 5
            )
        }

        ctx.strokeStyle = "red"
        drawLine(ctx,
            convertCoordX(START_X_VALUE),
            convertCoordY(START_Y_VALUE),
            convertCoordX(functionData[0][0][1]),
            convertCoordY(functionData[0][1])
        )
        drawLine(ctx,
            convertCoordX(functionData[0][0][1]),
            convertCoordY(functionData[0][1]),
            convertCoordX(functionData[1][0][0]),
            convertCoordY(functionData[1][1])
        )
        for (let it = 1; it < functionData.length - 1; ++it) {
            drawLine(ctx,
                convertCoordX(functionData[it][0][0]),
                convertCoordY(functionData[it][1]),
                convertCoordX(functionData[it][0][1]),
                convertCoordY(functionData[it][1])
            )
            drawLine(ctx,
                convertCoordX(functionData[it][0][1]),
                convertCoordY(functionData[it][1]),
                convertCoordX(functionData[it + 1][0][0]),
                convertCoordY(functionData[it + 1][1])
            )
        }
        drawLine(ctx,
            convertCoordX(functionData[functionData.length - 1][0][0]),
            convertCoordY(functionData[functionData.length - 1][1]),
            convertCoordX(END_X_VALUE),
            convertCoordY(END_Y_VALUE)
        )

    }, [functionData]);

    useLayoutEffect(() => {
        if (!histogramCanvasRef || histogramData.length === 0) {
            return
        }
        const canvas = histogramCanvasRef.current
        const ctx = canvas.getContext("2d")
        ctx.fillStyle = "white"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.lineWidth = MAIN_LINES_WIDTH;
        ctx.strokeStyle = "black"
        drawLine(
            ctx,
            CANVAS_BORDER_OFFSET,
            canvas.height - CANVAS_BORDER_OFFSET - MAIN_LINES_WIDTH / 2,
            canvas.width - CANVAS_BORDER_OFFSET,
            canvas.height - CANVAS_BORDER_OFFSET - MAIN_LINES_WIDTH / 2
        )
        drawLine(
            ctx,
            CANVAS_BORDER_OFFSET - MAIN_LINES_WIDTH / 2,
            CANVAS_BORDER_OFFSET,
            CANVAS_BORDER_OFFSET - MAIN_LINES_WIDTH / 2,
            canvas.height - CANVAS_BORDER_OFFSET
        )

        ctx.lineWidth = 1;
        ctx.fillStyle = "black"
        ctx.font = `${FONT_SIZE}px Arial`;

        const START_Y_VALUE = 0
        const END_Y_VALUE = histogramData.reduce((acc, it) => it[2] > acc ? it[2] : acc, 0)
        const RANGE_Y = END_Y_VALUE - START_Y_VALUE

        const LINE_Y_START = canvas.height - CANVAS_BORDER_OFFSET - MAIN_LINES_WIDTH
        const LINE_Y_END = CANVAS_BORDER_OFFSET + LAYOUT_OFFSET
        const LINE_Y_RANGE = LINE_Y_START - LINE_Y_END
        const LINE_Y_INTERVAL = LINE_Y_RANGE / 4

        const START_X_VALUE = (histogramData[0][0][0])
        const END_X_VALUE = (histogramData[histogramData.length - 1][0][1])
        const RANGE_X = END_X_VALUE - START_X_VALUE

        const LINE_X_START = CANVAS_BORDER_OFFSET + LAYOUT_OFFSET
        const LINE_X_END = canvas.width - CANVAS_BORDER_OFFSET - LAYOUT_OFFSET
        const LINE_X_RANGE = LINE_X_END - LINE_X_START
        const LINE_X_INTERVAL = LINE_X_RANGE / 4

        const convertCoordX = x => {
            const RELATIVE_POS = (x - START_X_VALUE) / RANGE_X
            return LINE_X_START + LINE_X_RANGE * RELATIVE_POS
        }

        const convertCoordY = y => {
            const RELATIVE_POS = (y - START_Y_VALUE) / RANGE_Y
            return LINE_Y_START - LINE_Y_RANGE * RELATIVE_POS
        }

        // Y Axis
        for (let it = 0; it < 5; ++it) {
            if (it > 0) {
                drawLine(
                    ctx,
                    CANVAS_BORDER_OFFSET,
                    LINE_Y_START - LINE_Y_INTERVAL * it,
                    canvas.width - CANVAS_BORDER_OFFSET,
                    LINE_Y_START - LINE_Y_INTERVAL * it
                )
            }

            ctx.fillText(
                (START_Y_VALUE + (END_Y_VALUE - START_Y_VALUE) / 4 * it).toFixed(2),
                CANVAS_BORDER_OFFSET - 30,
                LINE_Y_START - LINE_Y_INTERVAL * it + FONT_SIZE / 2
            )
        }

        // X Axis
        for (let it = 0; it < 5; ++it) {
            drawLine(
                ctx,
                LINE_X_START + LINE_X_INTERVAL * it,
                CANVAS_BORDER_OFFSET,
                LINE_X_START + LINE_X_INTERVAL * it,
                canvas.height - CANVAS_BORDER_OFFSET
            )

            ctx.fillText(
                (START_X_VALUE + (END_X_VALUE - START_X_VALUE) / 4 * it).toFixed(2),
                LINE_X_START + LINE_X_INTERVAL * it - 10,
                canvas.height - CANVAS_BORDER_OFFSET + FONT_SIZE + 5
            )
        }

        const HISTOGRAM_MARGIN = 5
        const HISTOGRAM_WIDTH = (LINE_X_END - LINE_X_START) / (histogramData.length) - HISTOGRAM_MARGIN * 2

        ctx.fillStyle = "rgba(255, 0, 0, 0.85)"
        for (let it = 0; it < histogramData.length; ++it) {
            ctx.fillRect(
                convertCoordX(histogramData[it][0][0]) + HISTOGRAM_MARGIN,
                convertCoordY(0),
                 HISTOGRAM_WIDTH,
                convertCoordY(histogramData[it][2]) - convertCoordY(0)
            )
        }

        const POLYGON_DOT_DIAMETER = 8

        ctx.lineWidth = 2
        ctx.fillStyle = "black"
        for (let it = 0; it < histogramData.length; ++it) {
            if (it > 0) {
                drawLine(ctx,
                    convertCoordX(histogramData[it - 1][0][0]) + HISTOGRAM_MARGIN + HISTOGRAM_WIDTH / 2,
                    convertCoordY(histogramData[it - 1][2]) - POLYGON_DOT_DIAMETER / 2 + POLYGON_DOT_DIAMETER / 2,
                    convertCoordX(histogramData[it][0][0]) + HISTOGRAM_MARGIN + HISTOGRAM_WIDTH / 2,
                    convertCoordY(histogramData[it][2]) - POLYGON_DOT_DIAMETER / 2 + POLYGON_DOT_DIAMETER / 2,
                )
            }
            ctx.fillRect(
                convertCoordX(histogramData[it][0][0]) + HISTOGRAM_MARGIN + (HISTOGRAM_WIDTH - POLYGON_DOT_DIAMETER) / 2,
                convertCoordY(histogramData[it][2]) - POLYGON_DOT_DIAMETER / 2,
                POLYGON_DOT_DIAMETER,
                POLYGON_DOT_DIAMETER
            )
        }
    }, [histogramData])

    return (
        <>
            <h2>График эмпирической функции</h2>
            <canvas width={400} height={400} ref={functionCanvasRef}/>
            <h2>Полигон и гистограмма</h2>
            <canvas width={400} height={400} ref={histogramCanvasRef}/>
        </>
    );
};

Graphics.propTypes = {
    functionData: PropTypes.array,
    histogramData: PropTypes.array
}

export default Graphics