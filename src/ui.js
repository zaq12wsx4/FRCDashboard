// Define UI elements
let ui = {
    timer: document.getElementById('timer'),
    robotState: document.getElementById('robot-state').firstChild,
    gyro: {
        container: document.getElementById('gyro'),
        val: 0,
        offset: 0,
        visualVal: 0,
        arm: document.getElementById('gyro-arm'),
        number: document.getElementById('gyro-number')
    },
    wheel: {
        flwheel: document.getElementById('fl-wheel'),
        frwheel: document.getElementById('fr-wheel'),
        blwheel: document.getElementById('bl-wheel'),
        brwheel: document.getElementById('br-wheel')
    },
    pad: {
        blpad: document.getElementById('bottomleft_pad'),
        brpad: document.getElementById('bottomright_pad'),
        mlpad: document.getElementById('midleft_pad'),
        mrpad: document.getElementById('midright_pad'),
        tlpad: document.getElementById('topleft_pad'),
        trpad: document.getElementById('topright_pad')
    },
    colorselect: document.getElementById('color-select'),
    armPosition: document.getElementById('arm-position'),
    positionselect: document.getElementById('position-select')
};

// Key Listeners

NetworkTables.addKeyListener('/SmartDashboard/autonomous state', (key, value) => {
    ui.robotState = 'Robot is ' + value;
});
// Gyro rotation
let updateGyro = (key, value) => {
    ui.gyro.val = value;
    ui.gyro.visualVal = Math.floor(ui.gyro.val - ui.gyro.offset);
    ui.gyro.visualVal %= 360;
    if (ui.gyro.visualVal < 0) {
        ui.gyro.visualVal += 360;
    }
    ui.gyro.arm.style.transform = `rotate(${ui.gyro.visualVal}deg)`;
    ui.gyro.number.innerHTML = ui.gyro.visualVal + 'º';
};
NetworkTables.addKeyListener('/SmartDashboard/Heading', updateGyro);
// -----------------------------------------------------------------------------------------
// EXAMPLE code

// The following case is an example, for a robot with an arm at the front.
// NetworkTables.addKeyListener('/SmartDashboard/arm/encoder', (key, value) => {
//     // 0 is all the way back, 1200 is 45 degrees forward. We don't want it going past that.
//     if (value > 1140) {
//         value = 1140;
//     }
//     else if (value < 0) {
//         value = 0;
//     }
//     // Calculate visual rotation of arm
//     var armAngle = value * 3 / 20 - 45;
//     // Rotate the arm in diagram to match real arm
//     ui.robotDiagram.arm.style.transform = `rotate(${armAngle}deg)`;
// });

// -------------------------------------------------------------------------------------------------------------
// FIX THIS

NetworkTables.addKeyListener('/SmartDashboard/Front Right Position', (key, value) => {
    ui.wheel.frwheel.style.transform = `rotate(${wheelAngle}deg)`;
});
NetworkTables.addKeyListener('/SmartDashboard/Front Left Position', (key, value) => {
    ui.wheel.flwheel.style.transform = `rotate(${wheelAngle}deg)`;
});
NetworkTables.addKeyListener('/SmartDashboard/Back Right Position', (key, value) => {
    ui.wheel.brwheel.style.transform = `rotate(${wheelAngle}deg)`;
});
NetworkTables.addKeyListener('/SmartDashboard/Back Left Position', (key, value) => {
    ui.wheel.blwheel.style.transform = `rotate(${wheelAngle}deg)`;
});

// ----------------------------------------------------------------------------------------------------------------

// This button is just an example of triggering an event on the robot by clicking a button.
// NetworkTables.addKeyListener('/SmartDashboard/example_variable', (key, value) => {
//     // Set class active if value is true and unset it if it is false
//     ui.example.button.classList.toggle('active', value);
//     ui.example.readout.data = 'Value is ' + value;
// });

NetworkTables.addKeyListener('/robot/time', (key, value) => {
    // This is an example of how a dashboard could display the remaining time in a match.
    // We assume here that value is an integer representing the number of seconds left.
    ui.timer.innerHTML = value < 0 ? '0:00' : Math.floor(value / 60) + ':' + (value % 60 < 10 ? '0' : '') + value % 60;
});

// ----------------------------------------------------------------------------------------------------------------
// When game starts, wait for field code
//   When recieve the field setup string (ex. lrr) {
//     str alliance =  get alliance color
//     str setup = get field setup
//     front
//     for (i = 0, i < setup[].length, i++) {
//       var temp_letter = setup.charAt(i)
//       if (i = 0) {
//         if (temp_letter = 'l') {
//           ui.pad.blpad.animate().attr({ fill: '#f03' })
//       }
//     }
//   }
// }



// Load list of prewritten autonomous modes
// NetworkTables.addKeyListener('/SmartDashboard/autonomous/modes', (key, value) => {
//     // Clear previous list
//     while (ui.autoSelect.firstChild) {
//         ui.autoSelect.removeChild(ui.autoSelect.firstChild);
//     }
//     // Make an option for each autonomous mode and put it in the selector
//     for (let i = 0; i < value.length; i++) {
//         var option = document.createElement('option');
//         option.appendChild(document.createTextNode(value[i]));
//         ui.autoSelect.appendChild(option);
//     }
//     // Set value to the already-selected mode. If there is none, nothing will happen.
//     ui.autoSelect.value = NetworkTables.getValue('/SmartDashboard/currentlySelectedMode');
// });

// Load list of prewritten autonomous modes
// NetworkTables.addKeyListener('/SmartDashboard/autonomous/selected', (key, value) => {
//     ui.autoSelect.value = value;
// });

// The rest of the doc is listeners for UI elements being clicked on
// ui.example.button.onclick = function() {
//     // Set NetworkTables values to the opposite of whether button has active class.
//     NetworkTables.putValue('/SmartDashboard/example_variable', this.className != 'active');
// };
// Reset gyro value to 0 on click
ui.gyro.container.onclick = function() {
    // Store previous gyro val, will now be subtracted from val for callibration
    ui.gyro.offset = ui.gyro.val;
    // Trigger the gyro to recalculate value.
    updateGyro('/SmartDashboard/drive/navx/yaw', ui.gyro.val);
};
ui.positionselect.onchange = function() {
    NetworkTables.putValue('/SmartDashboard/Robot Starting Position', this.value);
};
// Update NetworkTables when autonomous selector is changed
// ui.autoSelect.onchange = function() {
//     NetworkTables.putValue('/SmartDashboard/autonomous/selected', this.value);
// };
// // Get value of arm height slider when it's adjusted
// ui.armPosition.oninput = function() {
//     NetworkTables.putValue('/SmartDashboard/arm/encoder', parseInt(this.value));
// };

addEventListener('error',(ev)=>{
    ipc.send('windowError',{mesg:ev.message,file:ev.filename,lineNumber:ev.lineno})
})
