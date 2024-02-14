const recentSym = {
    type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
    color: "red",
    outline: { // autocasts as new SimpleLineSymbol()
        color: "black",
        width: 0.5,
    }
};

const rendererRecent = {
    type: "simple", // autocasts as new SimpleRenderer()
    symbol: recentSym,
    visualVariables: [{
        type: "size",
        field: "Mag",
        legendOptions: {
            title: "Magnitude"
        },
        stops: [{
            value: 2.9,
            size: 4,
            label: "<2.9"
        },
        {
            value: 3.4,
            size: 8,
            label: "2.9 - 3.4"
        },
        {
            value: 3.9,
            size: 12,
            label: "3.5 - 3.9"
        },
        {
            value: 4.9,
            size: 18,
            label: "4.0 - 4.9"
        },
        {
            value: 5.9,
            size: 26,
            label: "5.0 - 5.9"
        },
        {
            value: 6.9,
            size: 36,
            label: "6.0 - 6.9"
        }
        ]
    }]
};

const miningSym = {
    type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
    //color: "pink",
    outline: { // autocasts as new SimpleLineSymbol()
        color: "black",
        width: 0.5,
    }
};

const rendererMining = {
    type: "simple", // autocasts as new SimpleRenderer()
    symbol: miningSym,
    visualVariables: [{
        type: "size",
        field: "Mag",
        legendOptions: {
            title: "Magnitude"
        },
        stops: [{
            value: 2.9,
            size: 4,
            label: "<2.9"
        },
        {
            value: 3.4,
            size: 8,
            label: "2.9 - 3.4"
        },
        {
            value: 3.9,
            size: 12,
            label: "3.5 - 3.9"
        },
        {
            value: 4.9,
            size: 18,
            label: "4.0 - 4.9"
        },
        {
            value: 5.9,
            size: 26,
            label: "5.0 - 5.9"
        },
        {
            value: 6.9,
            size: 36,
            label: "6.0 - 6.9"
        }
        ]
    }]
};

const rendererLiquefaction = {
    type: "unique-value", // autocasts as new UniqueValueRenderer()
    field: "LQSHazardUnit",
    //defaultSymbol: { type: "simple-fill" },
    uniqueValueInfos: [{
        // All features with value of "Very High" will be green
        value: "VHlqs",
        label: "Very High Susceptibility",
        symbol: {
            type: "simple-fill", // autocasts as new SimpleFillSymbol()
            color: [230, 0, 0],
            outline: { // autocasts as new SimpleLineSymbol()
                color: [0, 0, 0],
                width: "0.4px"
            }
        }
    }, {
        // All features with value of "Very High" will be green
        value: "Hlqs",
        label: "High Susceptibility",
        symbol: {
            type: "simple-fill", // autocasts as new SimpleFillSymbol()
            color: [255, 85, 0],
            outline: { // autocasts as new SimpleLineSymbol()
                color: [0, 0, 0],
                width: "0.4px"
            }
        }
    }, {
        // All features with value of "Very High" will be green
        value: "Mlqs",
        label: "Moderate Susceptibility",
        symbol: {
            type: "simple-fill", // autocasts as new SimpleFillSymbol()
            color: [222, 197, 129],
            outline: { // autocasts as new SimpleLineSymbol()
                color: [0, 0, 0],
                width: "0.4px"
            }
        }
    }, {
        // All features with value of "Very High" will be green
        value: "Llqs",
        label: "Low Susceptibility",
        symbol: {
            type: "simple-fill", // autocasts as new SimpleFillSymbol()
            color: [56, 168, 0],
            outline: { // autocasts as new SimpleLineSymbol()
                color: [0, 0, 0],
                width: "0.4px"
            }
        }
    }, {
        // All features with value of "Very High" will be green
        value: "VLlqs",
        label: "Very Low Susceptibility",
        symbol: {
            type: "simple-fill", // autocasts as new SimpleFillSymbol()
            color: [115, 223, 255],
            outline: { // autocasts as new SimpleLineSymbol()
                color: [0, 0, 0],
                width: "0.4px"
            }
        }
    },
    ]
};

//symbolize shakingRaster
function colorize(pixelData: any) {
    let pixelBlock, factor, minValue, maxValue;

    if (
        pixelData === null ||
        pixelData.pixelBlock === null ||
        pixelData.pixelBlock.pixels === null
    ) {
        return;
    }

    // The pixelBlock stores the values of all pixels visible in the view
    pixelBlock = pixelData.pixelBlock;
    console.log(pixelBlock);

    // Get the min and max values of the data in the current view
    minValue = pixelBlock.statistics[0].minValue;
    maxValue = pixelBlock.statistics[0].maxValue;

    // The pixels visible in the view
    const pixels = pixelBlock.pixels;

    // The number of pixels in the pixelBlock
    const numPixels = pixelBlock.width * pixelBlock.height;

    // Calculate the factor by which to determine the red and blue
    // values in the colorized version of the layer
    factor = 255.0 / (maxValue - minValue);

    // Get the pixels containing temperature values in the only band of the data
    const tempBand = pixels[0];

    // Create empty arrays for each of the RGB bands to set on the pixelBlock
    const rBand = [];
    const gBand = [];
    const bBand = [];

    // Loop through all the pixels in the view
    for (let i = 0; i < numPixels; i++) {
        // Get the pixel value (the temperature) recorded at the pixel location
        const tempValue = tempBand[i];
        // Calculate the red value based on the factor
        const red = (tempValue - minValue) * factor;

        // Sets a color between blue (coldest) and red (warmest) in each band
        rBand[i] = red;
        gBand[i] = 0;
        bBand[i] = 255 - red;
    }

    // Set the new pixel values on the pixelBlock
    pixelData.pixelBlock.pixels = [rBand, gBand, bBand];
    pixelData.pixelBlock.pixelType = "U8"; // U8 is used for color
}

const surfaceFaultRuptureRenderer = {
    type: "simple",
    label: "Surface Fault Rupture Zone",
    symbol: {
        type: "simple-fill",  // autocasts as new SimpleFillSymbol()
        color: [252, 211, 126, 0.6],
        outline: {
            width: "0.4px",
            color: "black",
        }
    }
}

const rendererBedrockPot = {
    type: "unique-value",
    field: "SBPHazardUnit",
    fieldDelimiter: ", ",
    uniqueValueInfos: [{
        value: "Hsbp",
        label: "Hard",
        symbol: {
            type: "simple-fill", // autocasts as new SimpleFillSymbol()
            color: [168, 56, 0],
            outline: { // autocasts as new SimpleLineSymbol()
                color: [0, 0, 0],
                width: "0.4px"
            }
        }
    }, {
        value: "Ssbp",
        label: "Soft",
        symbol: {
            type: "simple-fill", // autocasts as new SimpleFillSymbol()
            color: [255, 170, 0],
            outline: { // autocasts as new SimpleLineSymbol()
                color: [0, 0, 0],
                width: "0.4px"
            }
        }
    }, {
        value: "Bsbp",
        label: "Buried",
        symbol: {
            type: "simple-fill", // autocasts as new SimpleFillSymbol()
            color: [230, 255, 190],
            outline: { // autocasts as new SimpleLineSymbol()
                color: [0, 0, 0],
                width: "0.4px"
            }
        }
    }, {
        value: "Dsbp",
        label: "Deep",
        symbol: {
            type: "simple-fill", // autocasts as new SimpleFillSymbol()
            color: [190, 255, 232],
            outline: { // autocasts as new SimpleLineSymbol()
                color: [0, 0, 0],
                width: "0.4px"
            }
        }
    },
    ]
}

//quad renderer
const quadRenderer = {
    type: "simple",
    symbol: {
        type: "simple-fill",
        color: [0, 0, 0, 0],
        outline: {
            width: "1px",
            color: "#db0202",
        }

    }
}

export { rendererRecent, rendererMining, rendererLiquefaction, colorize, surfaceFaultRuptureRenderer, rendererBedrockPot, quadRenderer };