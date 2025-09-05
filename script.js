
const checkBoxList = document.querySelectorAll(".custom-checkbox");
const inputFields = document.querySelectorAll('.goal-input');
const progress = document.querySelector(".progress-bar");
const progressLabel = document.querySelector('.progress-label')
const progressValue = document.querySelector(".progress-value");
const container = document.querySelector(".goal-container");
const allQuotes = ['Raise the bar by completing your goals!', 'Well begun is half done!','Just a step away, keep going!','Woha! You just completed all the goals, time for chill :D'];
const goalContainer = document.querySelector(".all-goals")
const addBtn = document.querySelector(".add");

// this is used for static fields 
// const allGoals = JSON.parse(localStorage.getItem('allGoals')) || {
//     firstInput: {
//         name : "",
//         completed : false, 
//     },
//     secondInput: {
//         name : "",
//         completed : false, 
//     },
//     thirdInput: {
//         name : "",
//         completed : false, 
//     }
// }
const allGoals = JSON.parse(localStorage.getItem('allGoals')) || {}
let completedGoalsCount = Object.values(allGoals).filter((goal)=> goal.completed).length
progressValue.style.width = `${completedGoalsCount/goalContainer.children.length * 100}%`;
progressValue.firstElementChild.innerText = `${completedGoalsCount}/${goalContainer.children.length} Completed`
progressLabel.innerText = allQuotes[completedGoalsCount];


// checkbox chekcked
checkBoxList.forEach((check) => {
    check.addEventListener('click',(e)=>{
        // here first i am making array using spread operator and then every method returns false if any of the value is falsy that's why we are using every 
      const inputResult =  [...inputFields].every((input)=> {
            return input.value;
            })
            // check if all 3 are field then only allow checkmark
      if(inputResult){
            check.parentElement.classList.toggle("completed");
            const inputId = check.nextElementSibling.id;
            allGoals[inputId].completed = !allGoals[inputId].completed;
            completedGoalsCount = Object.values(allGoals).filter((goal)=> goal.completed).length
            progressValue.style.width = `${completedGoalsCount/goalContainer.children.length * 100}%`
            progressValue.firstElementChild.innerText = `${completedGoalsCount}/${goalContainer.children.length} Completed`;
            progressLabel.innerText = allQuotes[completedGoalsCount];
            localStorage.setItem('allGoals', JSON.stringify(allGoals))
        }
        // this shows error msg 
        else{
            progress.classList.add("show-error")
        }
    })
})

// if we are eritring in input field hide the error msg
inputFields.forEach((input)=>{
    if(allGoals[input.id]){
        input.value = allGoals[input.id].name;
        if(allGoals[input.id].completed){
            input.parentElement.classList.add("completed")
        }
    }
    input.addEventListener("focus", () => {
        progress.classList.remove('show-error')
    })

    input.addEventListener("input",(e) =>{

        if(allGoals[input.id] && allGoals[input.id].completed){
            input.value = allGoals[input.id].name;
            return
        }
        if(allGoals[input.id]) {
            allGoals[input.id].name = input.value;
        }
        else{
            allGoals[input.id] = {
                name : input.value,
                completed : false,
            }
        }
        localStorage.setItem('allGoals', JSON.stringify(allGoals))
    })
})

// add btn functionality
let i = 1;
addBtn.addEventListener('click',() => {    
    if(goalContainer.children.length < 5){
        const newGoal = container.cloneNode(true);
        newGoal.childNodes[3].id = `input-${i}`;
        newGoal.childNodes[3].value = "";
        i++
        newGoal.classList.remove("completed")
        goalContainer.append(newGoal)
        allGoals[newGoal.childNodes[3].id] = {
            name : '',
            completed : false,
        }
        console.log( newGoal)

        localStorage.setItem('allGoals', JSON.stringify(allGoals))
        let newInput  =  newGoal.childNodes[3];
        let newCheckbox = newGoal.childNodes[1]
        // input update
        newInput.addEventListener('input' ,(e) => {
            allGoals[newInput.id].name = newInput.value;
            localStorage.setItem('allGoals', JSON.stringify(allGoals))
        })
        // checkbox value update
        newCheckbox.addEventListener('click',(e) => {
            if(newInput.value === ""){
                progress.classList.add("show-error")
            }
            else{
                newCheckbox.parentElement.classList.toggle("completed"); 
                progress.classList.remove('show-error')
            }
            allGoals[newInput.id].completed = !allGoals[newInput.id].completed;
            completedGoalsCount = Object.values(allGoals).filter((goal)=> goal.completed).length;
            progressValue.style.width = `${completedGoalsCount/goalContainer.children.length * 100}%`
            progressValue.firstElementChild.innerText = `${completedGoalsCount}/${goalContainer.children.length} Completed`;
        })

    }
    console.log(goalContainer.children.length)
})