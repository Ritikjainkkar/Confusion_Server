var react = { 
    perimeter: (l,b) => 2*(l+b),
    area: (l,b) => l*b
}

function solveReact(l,b){
    console.log("solve the area for"+ l + " " + b);
    if(l < 1 || b < 1 ){
        console.log("area is very less");
    }else{
        console.log("perimeter of given length is:" + react.perimeter(l,b));
        console.log("area of given length is:" + react.area(l,b));
    }
}
solveReact(2,3);
solveReact(6,9);
solveReact(-1,0);