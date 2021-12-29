
let listOfTables=[];
let countOfDishesOrdered;
let totalBillOfDishesOrdered;
let totalForTable={};
let itemQuantity={};
let priceList={};


let createTables=(numberOfTables)=>{
    let tables=document.getElementById("tableList");
    for(let i=0;i<numberOfTables;i++){
        let table = document.createElement("li");

    
        listOfTables.push(table);
        table.id="table"+(i+1);
        table.classList.add("tables");
        tables.appendChild(table);
        let tableNameDiv=document.createElement('div');
        let tableTotalDiv=document.createElement('div');
        table.appendChild(tableNameDiv);
        tableNameDiv.id="tablename"+(i+1);
        tableNameDiv.textContent="Table"+(i+1);
        table.appendChild(tableTotalDiv); 
        tableTotalDiv.id="tableTotal"+(i+1);
        itemQuantity[table.id]={};
    }
    
}

createTables(3);

let filterTables=()=>{
    let input=document.getElementById("tableSearch");
    let filter=input.value.toLowerCase();
    let ul=document.getElementById("tableList");
    let li=ul.getElementsByTagName("li");
    let textValue;

    for(let i=0;i<li.length;i++){
        textValue=li[i].textContent;
        if(textValue.toLowerCase().indexOf(filter)>-1){
            li[i].style.display="";
        }
        else{
            li[i].style.display="none";
        }
    }

} 
document.getElementById("tableSearch").addEventListener('keyup',()=>{
    filterTables();
});





let url="menu.json";
let data;
let req= new XMLHttpRequest();
req.open('GET',url);
req.responseType='json';
req.send();
req.onload=function(){
    data=req.response;
    console.log(data);
    let menuList=()=>{
        let menu=document.getElementById("menuList");
        for(let i=0;i<data.length;i++){
            let menuName=document.createElement("li");
            menuName.id="menu"+(i+1);
            menuName.classList.add("menuListClass");
            menuName.setAttribute('draggable',true);

            let dishNameDiv=document.createElement('div');
            dishNameDiv.textContent=data[i].nameOfDish;
            menuName.appendChild(dishNameDiv);

            let dishType=document.createElement('span');
            dishType.textContent=data[i].type;
            menuName.appendChild(dishType);
            dishType.style.display="none";
            

            let dishPriceDiv=document.createElement('div');
            dishPriceDiv.textContent="Price: "+data[i].price;
            menuName.appendChild(dishPriceDiv);
            
            menu.appendChild(menuName);
            priceList[data[i].nameOfDish]=data[i].price;
        }
    }
    menuList();
    

    let filterMenu=()=>{
        let input=document.getElementById("menuSearch");
        let filter=input.value.toLowerCase();
        let ul=document.getElementById("menuList");
        let li=ul.getElementsByTagName("li");
        let textValue;
        for(let i=0;i<li.length;i++){
            textValue=li[i].textContent;
            if(textValue.toLowerCase().indexOf(filter)>-1){
                li[i].style.display="";
            }
            else{
                li[i].style.display="none";
            }
        }
    }

    document.getElementById("menuSearch").addEventListener('keyup',()=>{
        filterMenu();
    });


    var dragged;

    /* events fired on the draggable target */
    document.addEventListener("drag", function( event ) {
  
    }, false);
  
    document.addEventListener("dragstart", function( event ) {
        // store a ref. on the dragged elem
        dragged = event.target;
        // make it half transparent
        event.target.style.opacity = .5;
    }, false);
  
    document.addEventListener("dragend", function( event ) {
        // reset the transparency
        event.target.style.opacity = "";
    }, false);
  
    /* events fired on the drop targets */
    document.addEventListener("dragover", function( event ) {
        // prevent default to allow drop
        event.preventDefault();
    }, false);

    document.addEventListener("dragenter", function( event ) {
        // highlight potential drop target when the draggable element enters it
        if ( event.target.className == "tables" ) {
            event.target.style.background = "purple";
        }
  
    }, false);
  
    document.addEventListener("dragleave", function( event ) {
        // reset background of potential drop target when the draggable element leaves it
        if ( event.target.className == "tables" ) {
            event.target.style.background = "";
        }
  
    }, false);
  
    document.addEventListener("drop", function( e ) {
        // prevent default action (open as link for some elements)
        e.preventDefault();
        // move dragged elem to the selected drop target

        for(i=0;i<listOfTables.length;i++){
            if ( e.target.id == "table"+(i+1)) {
                
                e.target.style.background = "";
                detailedOrderPerTable(e);
                updateTotal(e.target.id);
            }
        }
      
    }, false);

    tableEventonClick();
    
    //to update the order counts of dishes as we drop more items
    function detailedOrderPerTable(e){
        if(itemQuantity[e.target.id].hasOwnProperty(data[dragged.id.slice(4,)-1].nameOfDish)){
            itemQuantity[e.target.id][data[dragged.id.slice(4,)-1].nameOfDish]=
            itemQuantity[e.target.id][data[dragged.id.slice(4,)-1].nameOfDish]+1;
        }
        else{
            itemQuantity[e.target.id][data[dragged.id.slice(4,)-1].nameOfDish]=1;
            console.log(itemQuantity[e.target.id].hasOwnProperty(data[dragged.id.slice(4,)-1].nameOfDish));
        }
        console.log(itemQuantity);

    }

    

}

let updateTotal=(targetedTable)=>{
     countOfDishesOrdered=0;
     totalBillOfDishesOrdered=0;
    for(dish in itemQuantity[targetedTable]){
        countOfDishesOrdered=parseInt(countOfDishesOrdered)+parseInt(itemQuantity[targetedTable][dish]);
        totalBillOfDishesOrdered=totalBillOfDishesOrdered+priceList[dish]*itemQuantity[targetedTable][dish];
    }
    document.getElementById("tableTotal"+targetedTable.slice(5,)).textContent=`Items : ${countOfDishesOrdered} Total:
     ${totalBillOfDishesOrdered}`;
     totalForTable[targetedTable]=totalBillOfDishesOrdered;
   
}

let modalFunctionality=(id)=>{
    let modal = document.getElementById("myModal");
    modal.style.display="block";
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            cleanUpForBill();
        }
      }
}

let tableEventonClick=()=>{
    let modalContent=document.getElementById("modal-content");
    for(let i=0;i<listOfTables.length;i++){
        listOfTables[i].addEventListener('click',()=>{
            modalFunctionality(listOfTables[i].id);
            document.getElementById("nameOfTableToBill").textContent=listOfTables[i].id.charAt(0).toUpperCase()+
            listOfTables[i].id.slice(1,)+ "  |  Order Details:";
            creatingTableForBill(listOfTables[i].id);
            
        });
    }
}

let creatingTableForBill=(id)=>{
    let tableInContext=itemQuantity[id];
    let finalListOfItems=document.getElementById("billContent");
    let finalListTable=document.getElementById("billList");
  
    let countOfDish=0;
    for(let dish in tableInContext){
        let row=finalListOfItems.insertRow(countOfDish);
        let srNo=row.insertCell(0);
        let item=row.insertCell(1);
        let price=row.insertCell(2);
        let quantity=row.insertCell(3);
        let deleteItem=row.insertCell(4);
        srNo.textContent=countOfDish+1;
        item.textContent=dish;
        price.textContent=priceList[dish]*parseInt(itemQuantity[id][dish]);
       
        let qunatityOfDish=document.createElement('INPUT');
        qunatityOfDish.setAttribute('type','number');
        qunatityOfDish.setAttribute('min',0);
        qunatityOfDish.setAttribute('value',`${parseInt(itemQuantity[id][dish])}`);
        quantity.appendChild(qunatityOfDish);
        qunatityOfDish.onchange=()=>{

            price.textContent=priceList[dish]*qunatityOfDish.value;
            itemQuantity[id][dish]=qunatityOfDish.value;
            updateTotal(id); 
            document.getElementById("totalForModal").textContent=`${totalForTable[id]}`;
        }

        let deleteIFrame=document.createElement("img");
        deleteIFrame.setAttribute('src','trash-solid.svg');
        deleteIFrame.style.height="15px";
        deleteIFrame.style.width="15px";
        deleteItem.appendChild(deleteIFrame);

        deleteIFrame.addEventListener('click',()=>{
            finalListOfItems.removeChild(row);
            delete itemQuantity[id][dish];
            cleanUpForBill();
            creatingTableForBill(id);
            updateTotal(id);   
        });
        
        countOfDish++;
    }

    updateTotal(id);
    let totalRow=finalListOfItems.insertRow(countOfDish);
    totalRow.insertCell(0);
    totalRow.insertCell(1).textContent="Total";
    let displayTotal=totalRow.insertCell(2);
    displayTotal.setAttribute("id","totalForModal");
    displayTotal.textContent=`${totalForTable[id]}`;

    let totalCleanup=(idOfTable)=>{
        cleanUpForBill();
        itemQuantity[idOfTable]={};
        totalForTable[idOfTable]=0;
        updateTotal(id);
    }
    
    let generateBillButton=document.getElementById("generateBill");
    generateBillButton.addEventListener('click',()=>{
        totalCleanup(id);
        let modal = document.getElementById("myModal");
        modal.style.display='none';
    });

    let closeButton=document.getElementById('closeButton');
        closeButton.addEventListener('click',()=>{
        cleanUpForBill(id)
        let modal = document.getElementById("myModal");
        modal.style.display='none';
});

}

let cleanUpForBill=()=>{
    let tableToClean=document.getElementById('billContent');
        while(tableToClean.firstChild){
            tableToClean.removeChild(tableToClean.lastChild);
        }
}

