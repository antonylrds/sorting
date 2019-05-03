// window.addEventListener('resize', resizeCanvas, false);

let ordems = {
    "order": arrayOrdenado,
    "invert": arrayInvertido,
    "random": arrayRandomico
}

let algList = {
    "select": selectionSort,
    "insert": insertionSort,
    "bubble": bubbleSort,
    "quick": quickSort,
    "merge": mergeSort,
    "shell": shellSort

}

var myCanvas = document.getElementById("myCanvas");
myCanvas.width = myCanvas.parentElement.clientWidth;
myCanvas.height = 300;
  
var ctx = myCanvas.getContext("2d");

function drawLine(ctx, startX, startY, endX, endY,color){
    ctx.save();
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(startX,startY);
    ctx.lineTo(endX,endY);
    ctx.stroke();
    ctx.restore();
}

function drawBar(ctx, upperLeftCornerX, upperLeftCornerY, width, height,color){
    ctx.save();
    ctx.fillStyle=color;
    ctx.fillRect(upperLeftCornerX,upperLeftCornerY,width,height);
    ctx.restore();
}

var array = arrayRandomico(20);
/* var array = {
    "1": 10,
    "2": 14,
    "3": 2,
    "4": 9,
    "5": 11,
    "6": 12,
    "7": 16,
    "8": 7,
    "9": 2
}; */

var Barchart = function(options){
    this.options = options;
    this.canvas = options.canvas;
    this.ctx = this.canvas.getContext("2d");
    this.colors = options.colors;
  
    this.draw = function(){
        var maxValue = 0;
        for (var categ in this.options.data){
            //AAA 
            // maxValue = Math.max(maxValue,this.options.data[categ]);
            maxValue = Math.max(maxValue, this.options.data[categ]);
        }
        var canvasActualHeight = this.canvas.height - this.options.padding * 2;
        var canvasActualWidth = this.canvas.width - this.options.padding * 2;
 
        //drawing the grid lines
        var gridValue = 0;
        while (gridValue <= maxValue){
            var gridY = canvasActualHeight * (1 - gridValue/maxValue) + this.options.padding;
            drawLine(
                this.ctx,
                0,
                gridY,
                this.canvas.width,
                gridY,
                this.options.gridColor
            );
             
            //writing grid markers
            this.ctx.save();
            this.ctx.fillStyle = this.options.gridColor;
            this.ctx.font = "bold 10px Arial";
            this.ctx.fillText(gridValue, 10,gridY - 2);
            this.ctx.restore();
 
            gridValue+=this.options.gridScale;
        }
  
        //drawing the bars
        var barIndex = 0;
        var numberOfBars = Object.keys(this.options.data).length;
        var barSize = (canvasActualWidth)/numberOfBars;
        //console.log(canvasActualWidth, barSize);
 
        for (categ in this.options.data){
            // var val = this.options.data[categ];
            var val = this.options.data[categ];
            var barHeight = Math.round( canvasActualHeight * val/maxValue) ;
            drawBar(
                this.ctx,
                this.options.padding + barIndex * barSize,
                this.canvas.height - barHeight - this.options.padding,
                barSize,
                barHeight,
                this.colors[barIndex%this.colors.length]
            );
 
            barIndex++;
        }
  
    }
}

var myBarchart = new Barchart(
    {
        canvas:myCanvas,
        padding:10,
        gridScale:5,
        gridColor:"#ffffff",
        data:array,
        colors:["#a55ca5","#67b6c7", "#bccd7a","#eb9743"]
    }
);
myBarchart.draw();


function clearCanvas(ctx){
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
}

function novoArray(){
    //showModal();
    clearCanvas(ctx);
    let newArrayFn = ordems[document.getElementById('ordemSelect').value];
    array = newArrayFn(document.getElementById('tamArray').value);
    myBarchart.options.data = array;
    myBarchart.draw()
    //hideModal();
    
}

function ordenar(){
    let algFn = algList[document.getElementById('algSelect').value];
    start = Date.now();
    let result = algFn(myBarchart.options.data);
    updateCharArray(result);
    let tempo = Date.now()-start;
    let milisegundos = document.createTextNode("Tempo em milisegundos: "+ tempo.toString());
    document.getElementById('myH1').innerHTML = "";
    document.getElementById('myH1').appendChild(milisegundos);
}

function updateCharArray(data){
    myBarchart.options.data = data;
    clearCanvas(ctx);
    myBarchart.draw();
}

function arrayOrdenado(tam){
    let array = [];
    for(let i = 1; i <= tam ; i++){
        array.push(i);
    }
    return array;
}
function arrayInvertido(tam){
    let array = [];
    for(let i = tam; i > 0 ; i--){
        array.push(i);
    }
    return array;
}

function arrayRandomico(tam){
    let array = [];
    let newValue = 0;
    for(var i = 0; i < tam; i++){
        newValue = Math.floor(1+Math.random()*tam);
        if(array.indexOf(newValue) < 0){
            array.push(newValue);
        }else{
            i--;
        }
    }
    return array;
}

function showModal(){
    //$("#myModal").modal({backdrop: "static", keyboard: false});
    document.getElementById("spinner").style.visibility = "visible";
}

function hideModal(){
    //$("#myModal").modal('hide');
    document.getElementById("spinner").style.visibility = "hidden";
}

document.getElementById("mySubmit").addEventListener("submit", function(event){
    event.preventDefault();
    ordenar();
  });

document.getElementById("orderSubmit").addEventListener("submit", function(event){
    event.preventDefault();
    novoArray();
  });