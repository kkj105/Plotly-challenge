// read in JSON file and build the plot
function buildPlot(sample) {
    d3.json("samples.json").then(function(data) {
       //console.log(data)
        // filter data by "names"
        var sampleNames = data.samples.filter(name => name.id === sample)[0];
        //console.log(sampleNames)
        var sampleValues = sampleNames.sample_values
        var otuIDs = sampleNames.otu_ids
        var otuLabels = sampleNames.otu_labels
        
        // slice the top 10 OTUs
        slicedSampleValues = sampleValues.slice(0,10);
        slicedOtuIds = otuIDs.slice(0,10);
        slicedLabels = otuLabels.slice(0,10);

        // reverese the array
        reversedSample = slicedSampleValues.reverse();
        reversedOtuIds = slicedOtuIds.reverse();

    // build horizontal bar chart
    var trace1 = {
        x: reversedSample,
        y: reversedOtuIds.map(object => `OTU: ${object}`),
        type: "bar",
        orientation: "h"
    };

    // build bubble chart
    var trace2 = {
        x: otuIDs,
        y: sampleValues,
        text: otuLabels,
        mode: "markers",
        marker: {
            size: sampleValues,
            color: otuIDs
        }
    };
    
    // data
    var otuChart = [trace1, trace2];

    // apply the bar chart to the layout
    var layout1 = {
        margin: {
            l: 100,
            r: 100,
            t: 100,
            b: 100
        }
    };

    var layout2 = {
        title: "OTU IDs",
        height: 600,
        width: 1000
    };

    Plotly.newPlot("bar", [trace1], layout1)
    Plotly.newPlot("bubble", [trace2], layout2)
    
    // build demographics data
    var demoList = d3.select("#sample-metadata")
    // console.log(data)
    var demoSelect = data.metadata.filter(name => name.id == sample)[0];
    // console.log(demoSelect)
    
    //clear the demoList selection
    demoList.html("")
    
    Object.entries(demoSelect).forEach(function([key, value]) {
        console.log(key, value);
        
        //append the key and value pairs to the demographics div
        demoList.append("p").text(`${key}: ${value}`)
    })
    })
}

function optionChanged(newID) {
    buildPlot(newID)
}
// function called when a dropdown menu item is selected
function getData() {
    // select the dropdown menu
    var dropDown = d3.select("#selDataset");

    d3.json("samples.json").then(function(data) {
        var samples = data.names
        //console.log(samples)

        samples.forEach((sample) => {
            dropDown.append("option").text(sample) 
        }) 
        buildPlot(samples[0])
    })
}
getData()
