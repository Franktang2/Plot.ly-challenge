// function that gets the data and plot it 
function doplot(id) {
    
    // get data from the json 
    d3.json("samples.json").then((data)=> {
        console.log(data)

        // get id 
        var samples_id = data.samples.filter(s => s.id.toString() === id)[0];

        console.log(samples_id)

        // get only top 10 sample values
        var sampleValues = samples_id.sample_values.slice(0, 10).reverse();

        console.log(sampleValues);
    

        // get only top 10 otu ids
        var idValues = (samples_id.otu_ids.slice(0, 10)).reverse();

        console.log(idValues);
        
        // get the otu id's 
        var idOtu = idValues.map(d => "OTU " + d)
   
        console.log(`OTU IDS: ${idOtu}`)

        // get the top 10 labels 
        var labels = samples_id.otu_labels.slice(0, 10);

        console.log(`Sample Values: ${sampleValues}`)
        console.log(`Id Values: ${idValues}`)

// BAR GRAPH

        // create trace variable for the plot
        var trace = {
            x: sampleValues,
            y: idOtu,
            text: labels,
            type:"bar",
            orientation: "h",
        };

    

        // create layout variable to set plots layout
        var layout = {
            title: "Top 10 OTU",
            yaxis:{
                tickmode:"linear",
            },
            margin: {
                l: 100,
                r: 100,
                t: 50,
                b: 50}
        }

        // create data variable
        var data = [trace];

        Plotly.newPlot("bar", data, layout);

// BUBBLE GRAPH

         // create trace variable for the plot
        var trace1 = {
            x: samples_id.otu_ids,
            y: samples_id.sample_values,
            mode: "markers",
            marker: {
                size: samples_id.sample_values,
                color: samples_id.otu_ids
            },
            text: samples_id.otu_labels

        };

        // set the layout for the bubble plot
        var layout = {
            xaxis:{title: "OTU ID"},
            height: 600,
            width: 1200
        };

        // create data variable 
        var data1 = [trace1];

        // create the bubble plot
        Plotly.newPlot("bubble", data1, layout); 

})}


//Function to fill panel

function getInfo(id) {
    // read the json file
    d3.json("samples.json").then((data)=> {
        
        // get info for panel
        var metadata = data.metadata;

        console.log(metadata)

        // filter data
        var result = metadata.filter(meta => meta.id.toString() === id)[0];;

        // select demographic 
        var demographicInfo = d3.select("#sample-metadata");
        
        demographicInfo.html("");

        // append the info to the panel
        Object.entries(result).forEach((key) => {   
                demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
        });
    });
}

//Function for the change event

function optionChanged(id) {
    doplot(id);
    getInfo(id);
}

//Funtion to initiate webpage
function initial() {
    // select dropdown menu 
    var dropdown = d3.select("#selDataset");

    // read the data 
    d3.json("samples.json").then((data)=> {
        console.log(data)

        // get the id data to the dropdwown menu
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        })
        

        // call the functions to display the data and the plots to the page
        doplot(data.names[0]);
        getInfo(data.names[0]);
    });
}

initial();