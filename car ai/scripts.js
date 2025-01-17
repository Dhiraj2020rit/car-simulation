const carCanvas = document.getElementById("carCanvas");

carCanvas.width = 200;

const networkCanvas = document.getElementById("networkCanvas");

networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width/2,carCanvas.width*0.9);
// const car = new Car(road.getLaneCenter(1),100,30,50,"AI");
const n=100;
const cars = generateCars(n);
let bestCar=cars[0];
// if(localStorage.getItem("bestBrain")){
//     for(let i=0;i<cars.length;i++){
//         cars[i].brain = JSON.parse(
//             localStorage.getItem("bestBrain")
//         );
//         if(i!=0){
//             NeuralNetwork.mutate(cars[i].brain,0.5);
//         }
//     }
//     bestCar.brain = JSON.parse(
//         localStorage.getItem("bestBrain")
//     );
// }
if(localStorage.getItem("bestBrain")){
    bestCar.brain = JSON.parse(localStorage.getItem("bestBrain"));
    for(let i=0; i<cars.length; i++){
        cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
        
        // Mutate all cars except the best car to introduce diversity
        if(i != 0){ 
            NeuralNetwork.mutate(cars[i].brain, 0.1); // Mutate with a rate of 0.1 (or adjust as needed)
        }
    }
}

const traffic = [
    new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",3,getRandomColor()),
    new Car(road.getLaneCenter(0),-300,30,50,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(2),-300,30,50,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(0),-500,30,50,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(1),-500,30,50,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(1),-700,30,50,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(2),-700,30,50,"DUMMY",2,getRandomColor())
];

animate();
function save(){
    console.log("Saving");
    
    localStorage.setItem("bestBrain",JSON.stringify(bestCar.brain));
}

function discard(){
    console.log("Discarding");
    
    localStorage.removeItem("bestBrain");
}

function generateCars(n){
    const cars=[];
    for(let i=1;i<=n;i++){
        cars.push(new Car(road.getLaneCenter(1),100,30,50,"AI",3) );
    }
    return cars;
}

function animate(time){
    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }
    for(let i=0;i<cars.length;i++){
        cars[i].update(road.borders,traffic);
    }
    bestCar=cars.find(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y)
        ));
    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;
    carCtx.save();
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.7);

    road.draw(carCtx);
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx,"red");
    }
    carCtx.globalAlpha=0.2;
    for(let i=0;i<cars.length;i++){
        cars[i].draw(carCtx,"blue");
    }
    carCtx.globalAlpha=1;
    bestCar.draw(carCtx,"blue",true);
    carCtx.restore();
    networkCtx.lineDashOffset=-time/50;
    Visualizer.drawNetwork(networkCtx,bestCar.brain);
    requestAnimationFrame(animate);
}