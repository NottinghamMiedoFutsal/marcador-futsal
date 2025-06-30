// Estado global del marcador
const state = {
    team1: { name: "Nottingham Miedo", goals1T: 0, goals2T: 0 },
    team2: { name: "Rival", goals1T: 0, goals2T: 0 },
    currentHalf: "1T",
    timer: { minutes: 20, seconds: 0, running: false, interval: null }
};

// Actualizar overlay desde el estado
function updateOverlay() {
    if(document.getElementById('team1-name')) {
        document.getElementById('team1-name').textContent = state.team1.name;
        document.getElementById('team2-name').textContent = state.team2.name;
        document.getElementById('team1-goals1').textContent = state.team1.goals1T;
        document.getElementById('team1-goals2').textContent = state.team1.goals2T;
        document.getElementById('team2-goals1').textContent = state.team2.goals1T;
        document.getElementById('team2-goals2').textContent = state.team2.goals2T;
        document.getElementById('first-half').classList.toggle('active', state.currentHalf === "1T");
        document.getElementById('second-half').classList.toggle('active', state.currentHalf === "2T");
        const timerDisplay = `${state.timer.minutes.toString().padStart(2, '0')}:${state.timer.seconds.toString().padStart(2, '0')}`;
        document.getElementById('timer').textContent = timerDisplay;
    }
    if(document.getElementById('control-team1')) {
        document.getElementById('control-team1').value = state.team1.name;
        document.getElementById('control-team2').value = state.team2.name;
    }
}

// Control del cronómetro
function controlTimer(action) {
    switch(action) {
        case 'start':
            if (!state.timer.running) {
                state.timer.running = true;
                state.timer.interval = setInterval(() => {
                    if (state.timer.seconds > 0) {
                        state.timer.seconds--;
                    } else if (state.timer.minutes > 0) {
                        state.timer.minutes--;
                        state.timer.seconds = 59;
                    } else {
                        clearInterval(state.timer.interval);
                        state.timer.running = false;
                        state.currentHalf = state.currentHalf === "1T" ? "2T" : "FIN";
                        if (state.currentHalf === "2T") resetTimer();
                    }
                    updateOverlay();
                }, 1000);
            }
            break;
        case 'pause':
            clearInterval(state.timer.interval);
            state.timer.running = false;
            break;
        case 'reset':
            clearInterval(state.timer.interval);
            state.timer.running = false;
            resetTimer();
            updateOverlay();
            break;
    }
}

// Reiniciar cronómetro a 20:00
function resetTimer() {
    state.timer.minutes = 20;
    state.timer.seconds = 0;
}

// Actualizar goles (se llama desde el panel de control)
function updateGoal(team, half) {
    if (half === "1T") {
        state[team].goals1T++;
    } else if (half === "2T") {
        state[team].goals2T++;
    }
    updateOverlay();
}

// Sincronización inicial
document.addEventListener('DOMContentLoaded', updateOverlay);

// Soporte para cambios de nombre desde el panel de control
if(typeof window !== "undefined") {
    window.updateGoal = updateGoal;
    window.controlTimer = controlTimer;
    if(document.getElementById('control-team1')) {
        document.getElementById('control-team1').addEventListener('change', function(e){
            state.team1.name = e.target.value;
            updateOverlay();
        });
    }
    if(document.getElementById('control-team2')) {
        document.getElementById('control-team2').addEventListener('change', function(e){
            state.team2.name = e.target.value;
            updateOverlay();
        });
    }
}
