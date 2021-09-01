window.onload = () => {
    const dayPlank = document.querySelector("#days");
    const hoursPlank = document.querySelector("#hours");
    const minsPlank = document.querySelector("#mins");
    const secsPlank = document.querySelector("#secs");
    const containers = [dayPlank, hoursPlank, minsPlank, secsPlank];

    const day = 10;
    let [currVals, nextVals] = time_left(day);
    let nextIndChanges = diffValIndices(currVals, nextVals);
    
    setPlankValues(containers, currVals, nextVals);

    const setIntervalVar = setInterval(() => {
        if(currVals.every(val => val === 0))
            clearInterval(setIntervalVar);

        else {
            let indChanges = [...nextIndChanges];
            currVals = [...nextVals];
            nextIndChanges = modifyNextVals(nextVals);
            flipCard(containers, currVals, nextVals, indChanges);
        }
    }, 1000);
}



// Calculates time left in nth day to arrive
// Parameters :-
//  day: nth day
// Return Values :-
//  currVals: Array for time left (Days-Hours-Minutes-Seconds)
//  nextVals: Array for time left after one second

const time_left = day => {
    const today = new Date();
    let nth_day;
    const timerSetDate = localStorage.getItem("timerSetDate");

    if(timerSetDate === null) {
        nth_day = new Date();
        nth_day.setDate(today.getDate() + 10);
        nth_day.setHours(0, 0, 0);
        localStorage.setItem("timerSetdate", nth_day);
    }

    else
        nth_day = new Date(timerSetDate);

    const ms = nth_day - today;
    const currVals = ms_to_dhms(ms);
    const nextVals = ms_to_dhms(ms - 1000);

    return [currVals, nextVals];
}



// Converts time in milliseconds to (Days-Hours-Minutes-Seconds)
// Parameters :-
//  ms: milliseconds
// Return Values :-
//  Array containing no of days, hours, minutes, and seconds

const ms_to_dhms = ms => {
    if(ms < 0)
        return Array(4).fill(0);
    else {
        const secs = ~~(ms / 1000);
        const mins = ~~(secs / 60);
        const hours = ~~(mins / 60);
        const days = ~~(hours / 24);

        return [days, (hours % 24), (mins % 60), (secs % 60)];
    }
}


// Returns indices where two arrays have different values
// Parameters :-
//  arr1, arr2: Two arrays
// Return Values :-
//  Array containing indices where elements in both arrays are different

const diffValIndices = (arr1, arr2) => arr1.map((el, ind) => (el === arr2[ind]) ? false : ind).filter(el => el !== false);



// Sets time left in the respective container elements
// Parameters :-
//  containers: Array containing container elements
//  currVals: Array for time left (Days-Hours-Minutes-Seconds)
//  nextVals: Array for time left after one second

const setPlankValues = (containers, currVals, nextVals) => {
    for(i in containers) {
        const [container, currVal, nextVal] = [containers[i], currVals[i], nextVals[i]];
        const currSlides = [...container.querySelectorAll("[data-slide = current]")];
        const nextSlides = [...container.querySelectorAll("[data-slide = next]")];

        for(slide of currSlides)
            slide.innerText = (currVal === currVal % 10) ? "0" + currVal : currVal;

        for(slide of nextSlides)
            slide.innerText = (nextVal === nextVal % 10) ? "0" + nextVal : nextVal;
    }
}



// Updates the nextVals array for time after each second left
// Parameters :-
//  timeArr: Original nextVals array
// Return Values :-
//  indChanges: Array containing indices of containers with change in value

const modifyNextVals = timeArr => {
    let tempArr = [...timeArr];

    if(--timeArr[3] < 0) {
        timeArr[3] = 59;
        if(--timeArr[2] < 0) {
            timeArr[2] = 59;
            if(--timeArr[1] < 0) {
                timeArr[1] = 23;
                --timeArr[0];
            }
        }
    }

    const indChanges = tempArr.map((el, ind) => (el === timeArr[ind]) ? false : ind).filter(el => el !== false);
    return indChanges;
}



// Flips plank elements with change in values
// Parameters :-
//  containers: Array containing container elements
//  currVals: Array for time left (Days-Hours-Minutes-Seconds)
//  nextVals: Array for time left after one second
//  indChanges: Array containing indices of containers with change in value


const flipCard = (containers, currVals, nextVals, indChanges = []) => {
    for(i in containers) {
        if(indChanges.includes(+i)) {
            const flippingEl = containers[i].querySelector(".flip-card-inner");
            flippingEl.classList.add("flipping");
            setTimeout(() => {
                setPlankValues(containers, currVals, nextVals);
                flippingEl.classList.remove("flipping");
            }, 900);
        }
    }
}